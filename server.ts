import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in server environment.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const ARIVU_SYSTEM_INSTRUCTION = `You are Arivu AI (அறிவு AI), a calm, accurate Tamil Nadu guide matching citizens of all ages to 100% FREE government-run sports coaching, skill training centers, public libraries, and cultural art schools.

ALWAYS map every recommendation to these exact Tamil Nadu institutional counters so the user knows precisely where to go and whom to meet:
1. SPORTS: District Sports Complex (மாவட்ட விளையாட்டரங்கம்) -> Meet District Sports Officer (DSO) -> Carry Age Proof / School ID + 2 Photos. Helpline: 044-25611551.
2. SKILL / CRAFT / TECH: District Skill Training Office at District Collectorate / Employment Office (மாவட்ட திறன் பயிற்சி அலுவலகம் / RSETI) -> Meet Assistant Director (Skill Training) -> Carry Last Mark Sheet + Address Proof. Helpline: 14417 / 1800-425-1333.
3. LIBRARY / STUDY CIRCLE: District Central Library (மாவட்ட மைய நூலகம்) or Branch Library -> Meet Librarian -> Carry Address Proof (Ration Card / Student ID). Helpline: 044-28524263.
4. FOLK ART / MUSIC / SILAMBAM: District Govt Music School (மாவட்ட அரசு இசைப் பள்ளி) / Zonal Art & Culture Office -> Meet Headmaster / Assistant Director -> Carry Age Proof + Address Proof. Helpline: 044-28193157.

CRITICAL FORMATTING & SPEECH RULES:
1. ABSOLUTE NO PARAGRAPHS RULE: Never write paragraphs or long text blocks anywhere. Every bullet point and field must be short and punchy (under 15 words per line).
2. STRUCTURED DATA REQUIREMENT: Fill ALL 6 scannable fields for every program completely (never leave any array or string empty):
   - title_tamil: Short program title with English name in brackets.
   - eligibility_tamil: 2 or 3 short bullet strings for Who Can Join.
   - free_benefits_tamil: 2 or 3 short bullet strings for Free Benefits.
   - where_to_go_tamil: Exact Tamil Nadu counter name with English name in brackets.
   - whom_to_contact_tamil: Exact officer title with English designation in brackets.
   - documents_to_carry_tamil: 2 or 3 short safe document strings (never mention Aadhaar, phone number, or bank details).
3. TAMIL SPEECH-FRIENDLY FORMATTING (CRITICAL OVERRIDE):
   - Never output raw, unpunctuated Tamil strings for audio reading.
   - Use plain, everyday conversational Tamil without long compound words or English tech jargon.
   - For "summary_tamil": Write 1 short warm sentence (under 15 words).
   - For "spoken_explanation_tamil": Strictly write ONLY 2 or 3 short, simple, conversational Tamil sentences. Insert explicit commas (,) after every short phrase of 3 to 5 words, and end every sentence with a period (.). Example style: "மதுரையில் உள்ளவர்கள், மாவட்ட விளையாட்டரங்கத்திற்கு நேரில் செல்லலாம். அங்குள்ள விளையாட்டு அதிகாரியைச் சந்தித்து, வயது சான்றிதழ் மற்றும் இரண்டு புகைப்படங்களைக் கொடுங்கள். இந்தப் பயிற்சி முழுவதும், முற்றிலும் இலவசம்."
   - Never use English words, acronyms, brackets, or slashes inside "spoken_explanation_tamil".
4. STRICT PRIVACY RULE: Never ask for Aadhaar numbers, phone numbers, or bank details.
5. Return 2 or 3 relevant 100% FREE Tamil Nadu government programs.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary_tamil: {
      type: Type.STRING,
      description: "One short warm summary sentence in simple conversational Tamil.",
    },
    programs: {
      type: Type.ARRAY,
      minItems: 2,
      items: {
        type: Type.OBJECT,
        properties: {
          title_tamil: {
            type: Type.STRING,
            description: "Short program title in simple Tamil with English name in brackets.",
          },
          eligibility_tamil: {
            type: Type.ARRAY,
            minItems: 2,
            items: { type: Type.STRING },
            description: "2-3 short bullet points for Who Can Join (under 15 words each).",
          },
          free_benefits_tamil: {
            type: Type.ARRAY,
            minItems: 2,
            items: { type: Type.STRING },
            description: "2-3 short bullet points for Free Benefits (under 15 words each).",
          },
          where_to_go_tamil: {
            type: Type.STRING,
            description: "Exact office name in Tamil with English name in brackets.",
          },
          whom_to_contact_tamil: {
            type: Type.STRING,
            description: "Exact officer title in Tamil with English designation in brackets.",
          },
          documents_to_carry_tamil: {
            type: Type.ARRAY,
            minItems: 2,
            items: { type: Type.STRING },
            description: "2-3 short safe documents to carry (no Aadhaar/phone/bank).",
          },
        },
        required: [
          "title_tamil",
          "eligibility_tamil",
          "free_benefits_tamil",
          "where_to_go_tamil",
          "whom_to_contact_tamil",
          "documents_to_carry_tamil",
        ],
      },
    },
    helpline: {
      type: Type.STRING,
      description: "Official helpline number(s) matching the recommended institutions.",
    },
    spoken_explanation_tamil: {
      type: Type.STRING,
      description: "Strictly 2 or 3 short, simple conversational Tamil sentences with commas and periods after every short phrase, no English words, no tech jargon, and no long compound words.",
    },
  },
  required: ["summary_tamil", "programs", "helpline", "spoken_explanation_tamil"],
};

function sanitizeUserInput(text: string): string {
  // Strip any accidental long digit sequences (e.g. Aadhaar / phone / bank numbers) before sending to AI
  return text.replace(/\b\d[\d\s-]{7,}\d\b/g, "[தனிப்பட்ட எண் நீக்கப்பட்டது]").trim();
}

function ensurePunctuatedSentence(sentence: string): string {
  let normalized = sentence
    .replace(/[।|]/g, ".")
    .replace(/[.!?]+$/g, "")
    .trim();

  if (!normalized) return "";

  // Ensure long unpunctuated phrases get a natural comma pause every ~4-5 words
  const commaParts = normalized.split(",").map((part) => part.trim()).filter(Boolean);
  const punctuatedParts = commaParts.map((part) => {
    const words = part.split(/\s+/);
    if (words.length <= 7) return part;
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += 5) {
      chunks.push(words.slice(i, i + 5).join(" "));
    }
    return chunks.join(", ");
  });

  return `${punctuatedParts.join(", ")}.`;
}

function sanitizeSpokenTamil(text: string): string {
  const cleaned = text
    .replace(/\([^)]*\)/g, "")
    .replace(/[A-Za-z_/-]+/g, "")
    .replace(/\s*,\s*,+/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();

  const sentences = cleaned
    .split(/(?<=[.!?।])\s+/)
    .map((s) => ensurePunctuatedSentence(s))
    .filter(Boolean);

  return sentences.slice(0, 3).join(" ");
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/recommend", async (req, res) => {
    try {
      const { category, ageGroup, district, interestText } = req.body ?? {};
      const safeInterest = sanitizeUserInput(String(interestText || ""));
      const safeDistrict = sanitizeUserInput(String(district || "Tamil Nadu"));

      const categoryMap: Record<string, string> = {
        sports: "SPORTS (District Sports Complex / SDAT)",
        skill: "SKILL / CRAFT / TECH (District Skill Training Office / RSETI)",
        library: "LIBRARY / STUDY CIRCLE (District Central Library / Branch Library)",
        culture: "FOLK ART / MUSIC / SILAMBAM (District Govt Music School / Zonal Art & Culture Office)",
        all: "ALL FOUR CATEGORIES (pick the best 2-3 matching the citizen's age and interest)",
      };

      const ageMap: Record<string, string> = {
        child: "School Student (ages 6 to 14)",
        youth: "Youth / College Student (ages 15 to 25)",
        adult: "Adult (ages 26 to 59)",
        senior: "Senior Citizen (ages 60+)",
      };

      const userPrompt = [
        `Citizen Category Choice: ${categoryMap[String(category)] || categoryMap.all}`,
        `Citizen Age Group: ${ageMap[String(ageGroup)] || "All ages"}`,
        `District in Tamil Nadu: ${safeDistrict}`,
        `Specific Interest or Goal: ${safeInterest || "General free government opportunities for my age and area"}`,
        "",
        "Provide accurate, encouraging recommendations strictly mapped to the Tamil Nadu institutional counters in the system instructions.",
      ].join("\n");

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: userPrompt,
        config: {
          systemInstruction: ARIVU_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      });

      const rawText = (response.text ?? "").trim();
      if (!rawText) {
        res.status(502).json({
          error: "தகவலைப் பெற முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
        });
        return;
      }

      const parsed = JSON.parse(rawText);
      if (typeof parsed.spoken_explanation_tamil === "string") {
        parsed.spoken_explanation_tamil = sanitizeSpokenTamil(parsed.spoken_explanation_tamil);
      }
      res.json(parsed);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown server error";
      console.error("Error in /api/recommend:", message);
      res.status(500).json({
        error: "வழிகாட்டி தகவலைப் பெறுவதில் தற்காலிக சிக்கல் உள்ளது. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.",
        details: message,
      });
    }
  });

  app.post("/api/tts", async (req, res) => {
    try {
      const { text } = req.body ?? {};
      const cleanText = sanitizeSpokenTamil(String(text || ""));
      if (!cleanText) {
        res.status(400).json({ error: "No text provided for speech synthesis." });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured in server environment.");
      }

      const ttsStylePrompt = `Read the following Tamil guidance warmly, calmly, and clearly at a steady pace, pausing naturally at commas and periods:\n\n${cleanText}`;

      let base64Audio: string | undefined;

      // Primary: v1alpha supports speechMetadata and speechConfig on gemini-3.8-flash-lite-tts
      try {
        const aiAlpha = new GoogleGenAI({
          apiKey,
          apiVersion: "v1alpha",
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });
        const responseAlpha = await aiAlpha.models.generateContent({
          model: "gemini-3.8-flash-lite-tts",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: cleanText,
                  speechMetadata: {
                    style:
                      "Warm, natural conversational Tamil guide. Speak clearly at a steady, friendly pace, pausing naturally at commas and periods.",
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: "Kore" },
              },
            },
          },
        });
        base64Audio =
          responseAlpha.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      } catch (alphaErr) {
        console.warn(
          "v1alpha TTS attempt failed, trying v1beta standard audio:",
          alphaErr instanceof Error ? alphaErr.message : alphaErr,
        );
        // Fallback: v1beta without speechMetadata/speechConfig fields
        const aiBeta = getAiClient();
        const responseBeta = await aiBeta.models.generateContent({
          model: "gemini-3.8-flash-lite-tts",
          contents: ttsStylePrompt,
          config: {
            responseModalities: ["AUDIO"],
          },
        });
        base64Audio =
          responseBeta.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      }

      if (!base64Audio) {
        res.status(502).json({ error: "Audio generation returned empty output." });
        return;
      }

      res.json({
        audioBase64: base64Audio,
        mimeType: "audio/wav",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "TTS generation error";
      console.error("Error in /api/tts:", message);
      res.status(500).json({
        error: "ஒலி வடிவம் தயாரிப்பதில் சிக்கல் ஏற்பட்டது.",
        details: message,
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Arivu AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
