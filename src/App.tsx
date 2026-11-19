/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState } from 'react';
import { AlertCircle, PhoneCall, ShieldCheck } from 'lucide-react';
import { CitizenFinder } from './components/CitizenFinder';
import { Header } from './components/Header';
import { InstitutionalDirectory } from './components/InstitutionalDirectory';
import { ProgramResults } from './components/ProgramResults';
import { TN_DISTRICTS } from './data/tnInstitutions';
import { AgeGroupId, ArivuResponse, CategoryId } from './types/arivu';

export function App() {
  const [category, setCategory] = useState<CategoryId>('sports');
  const [ageGroup, setAgeGroup] = useState<AgeGroupId>('youth');
  const [district, setDistrict] = useState<string>(
    `${TN_DISTRICTS[0].ta} (${TN_DISTRICTS[0].en})`,
  );
  const [interestText, setInterestText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<ArivuResponse | null>(null);

  const resultsTopRef = useRef<HTMLDivElement | null>(null);

  const fetchRecommendations = async (overrideCategory?: CategoryId) => {
    const activeCategory = overrideCategory ?? category;
    if (overrideCategory) {
      setCategory(overrideCategory);
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: activeCategory,
          ageGroup,
          district,
          interestText,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(
          payload.error ||
            'தகவலைப் பெறுவதில் சிக்கல் ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.',
        );
      }

      setResults(payload as ArivuResponse);
      setTimeout(() => {
        resultsTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickOfficeSearch = (selectedCat: CategoryId) => {
    setResults(null);
    setCategory(selectedCat);
    fetchRecommendations(selectedCat);
  };

  return (
    <div id="top" className="min-h-screen bg-[#fff8f5] text-[#1f1b18] flex flex-col">
      <Header onReset={handleReset} showReset={results !== null} />

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-8 sm:px-8 sm:py-12 space-y-12">
        {/* Hero Intro — Short punchy lines only, no paragraphs */}
        <section aria-label="Welcome" className="space-y-5">
          <p className="text-base sm:text-lg font-bold text-[#006a6a]">
            தமிழ்நாடு 100% இலவச அரசு வழிகாட்டி · Free Citizen Guide
          </p>
          <h1 className="text-3xl sm:text-[40px] font-bold leading-tight text-[#1f1b18]">
            உங்களுக்கான இலவச அரசு மையங்களைக் கண்டறியுங்கள்.
          </h1>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-1 text-base font-semibold text-[#58423c]">
            <li className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[#2b8282]" aria-hidden="true" />
              <span>100% கட்டணமில்லா பயிற்சிகள்</span>
            </li>
            <li className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[#2b8282]" aria-hidden="true" />
              <span>சரியான அலுவலகம் & அதிகாரி விவரம்</span>
            </li>
            <li className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[#2b8282]" aria-hidden="true" />
              <span>ஆதார், போன், வங்கி எண் தேவையில்லை</span>
            </li>
          </ul>
        </section>

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-3xl border-[3px] border-[#ba1a1a]/30 bg-[#ffdad6] p-6 text-[#93000a]"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-6 w-6 shrink-0" aria-hidden="true" />
              <div className="text-lg font-bold">{errorMessage}</div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => fetchRecommendations()}
                className="tactile-push inline-flex min-h-[48px] items-center rounded-full bg-[#93000a] px-6 py-2.5 text-base font-bold text-white hover:bg-[#ba1a1a] cursor-pointer"
              >
                மீண்டும் முயற்சிக்கவும் · Try Again
              </button>
            </div>
          </div>
        )}

        <div ref={resultsTopRef} className="scroll-mt-24">
          {results ? (
            <ProgramResults data={results} onReset={handleReset} />
          ) : (
            <CitizenFinder
              category={category}
              onCategoryChange={setCategory}
              ageGroup={ageGroup}
              onAgeGroupChange={setAgeGroup}
              district={district}
              onDistrictChange={setDistrict}
              interestText={interestText}
              onInterestTextChange={setInterestText}
              onSubmit={() => fetchRecommendations()}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Institutional Directory */}
        <InstitutionalDirectory onSelectCategory={handleQuickOfficeSearch} />

        {/* Helplines Summary */}
        <section
          id="helplines"
          aria-label="Official Tamil Nadu Helplines"
          className="cushion-card rounded-[2rem] p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 text-xl font-bold text-[#1f1b18]">
            <PhoneCall className="h-6 w-6 text-[#a43716]" aria-hidden="true" />
            <span>முக்கிய அரசு உதவி எண்கள் · Important Helplines</span>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 text-base">
            <div className="rounded-2xl bg-[#fbf2ed] p-4">
              <div className="font-bold text-[#58423c]">
                விளையாட்டு · Sports (SDAT)
              </div>
              <div className="mt-1 text-xl font-bold tabular-nums text-[#1f1b18]">
                044-25611551
              </div>
            </div>
            <div className="rounded-2xl bg-[#fbf2ed] p-4">
              <div className="font-bold text-[#58423c]">
                திறன் பயிற்சி · Skill Training
              </div>
              <div className="mt-1 text-xl font-bold tabular-nums text-[#1f1b18]">
                14417 / 1800-425-1333
              </div>
            </div>
            <div className="rounded-2xl bg-[#fbf2ed] p-4">
              <div className="font-bold text-[#58423c]">
                பொது நூலகம் · Public Libraries
              </div>
              <div className="mt-1 text-xl font-bold tabular-nums text-[#1f1b18]">
                044-28524263
              </div>
            </div>
            <div className="rounded-2xl bg-[#fbf2ed] p-4">
              <div className="font-bold text-[#58423c]">
                இசை & கலைப் பள்ளி · Art & Music
              </div>
              <div className="mt-1 text-xl font-bold tabular-nums text-[#1f1b18]">
                044-28193157
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#f0e6e1] bg-[#fbf2ed] py-8">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-base text-[#58423c]">
          <p className="font-bold text-[#1f1b18]">அறிவு AI · Arivu AI</p>
          <p>
            தமிழ்நாடு மக்களுக்கான 100% இலவச அரசு சேவை வழிகாட்டி · எளிய வழிகாட்டல்
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
