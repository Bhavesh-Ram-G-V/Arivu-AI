import React, { useMemo } from 'react';
import {
  BookOpen,
  Check,
  Compass,
  GraduationCap,
  HeartHandshake,
  Loader2,
  MapPin,
  Music,
  Search,
  ShieldCheck,
  Trophy,
  User,
  Users,
  Wrench,
} from 'lucide-react';
import {
  AGE_GROUPS,
  CATEGORY_OPTIONS,
  QUICK_PRESETS,
  TN_DISTRICTS,
} from '../data/tnInstitutions';
import { AgeGroupId, CategoryId } from '../types/arivu';

interface CitizenFinderProps {
  category: CategoryId;
  onCategoryChange: (cat: CategoryId) => void;
  ageGroup: AgeGroupId;
  onAgeGroupChange: (age: AgeGroupId) => void;
  district: string;
  onDistrictChange: (district: string) => void;
  interestText: string;
  onInterestTextChange: (text: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const CATEGORY_ICONS: Record<CategoryId, React.ReactNode> = {
  sports: <Trophy className="h-8 w-8 shrink-0" aria-hidden="true" />,
  skill: <Wrench className="h-8 w-8 shrink-0" aria-hidden="true" />,
  library: <BookOpen className="h-8 w-8 shrink-0" aria-hidden="true" />,
  culture: <Music className="h-8 w-8 shrink-0" aria-hidden="true" />,
  all: <Compass className="h-8 w-8 shrink-0" aria-hidden="true" />,
};

const AGE_ICONS: Record<AgeGroupId, React.ReactNode> = {
  child: <GraduationCap className="h-7 w-7 shrink-0" aria-hidden="true" />,
  youth: <User className="h-7 w-7 shrink-0" aria-hidden="true" />,
  adult: <Users className="h-7 w-7 shrink-0" aria-hidden="true" />,
  senior: <HeartHandshake className="h-7 w-7 shrink-0" aria-hidden="true" />,
};

export const CitizenFinder: React.FC<CitizenFinderProps> = ({
  category,
  onCategoryChange,
  ageGroup,
  onAgeGroupChange,
  district,
  onDistrictChange,
  interestText,
  onInterestTextChange,
  onSubmit,
  isLoading,
}) => {
  const hasSensitiveDigits = useMemo(() => {
    return /\b\d[\d\s-]{7,}\d\b/.test(interestText);
  }, [interestText]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onSubmit();
    }
  };

  return (
    <section id="finder" aria-label="Program Finder" className="space-y-10">
      {/* Quick-Tap Presets for effortless single-tap exploration */}
      <div className="cushion-card rounded-[2rem] p-6 sm:p-8">
        <div className="mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1f1b18]">
            உடனே பார்க்க வேண்டுமா? கீழே ஒன்றைத் தொடவும்
          </h2>
          <p className="mt-1 text-base text-[#58423c]">
            Quick start — tap an example or choose your preferences below
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {QUICK_PRESETS.map((preset) => (
            <button
              key={preset.labelEnglish}
              type="button"
              onClick={() => {
                onCategoryChange(preset.category);
                onAgeGroupChange(preset.ageGroup);
                onInterestTextChange(preset.interestText);
              }}
              className="tactile-push flex min-h-[76px] items-center justify-between gap-4 rounded-2xl border-[3px] border-[#f5ebe1] bg-[#fff8f5] px-5 py-4 text-left hover:border-[#d95d39] hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b8282]/40 cursor-pointer"
            >
              <div>
                <div className="text-lg font-bold text-[#1f1b18]">
                  {preset.labelTamil}
                </div>
                <div className="text-base text-[#58423c]">
                  {preset.labelEnglish}
                </div>
              </div>
              <Search className="h-6 w-6 shrink-0 text-[#a43716]" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-10">
        {/* Step 1: Non-Text Visual Choice Cards for Category */}
        <div className="cushion-card rounded-[2rem] p-6 sm:p-9">
          <div className="mb-6">
            <p className="text-base font-bold text-[#a43716]">படி 1 · Step 1</p>
            <h2 className="mt-1 text-2xl sm:text-[26px] font-bold text-[#1f1b18]">
              எந்தத் துறையில் இலவசப் பயிற்சி / சேவை வேண்டும்?
            </h2>
            <p className="mt-1 text-base text-[#58423c]">
              Choose what you or your family member would like to join
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {CATEGORY_OPTIONS.map((item) => {
              const isSelected = category === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onCategoryChange(item.id)}
                  aria-pressed={isSelected}
                  className={`tactile-push relative flex min-h-[128px] w-full items-start gap-4 rounded-[1.75rem] border-[3px] p-5 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b8282]/40 cursor-pointer ${
                    isSelected
                      ? 'border-[#2b8282] bg-[#2b8282] text-white shadow-lg'
                      : 'border-[#f5ebe1] bg-[#fffdf9] text-[#1f1b18] hover:border-[#d95d39]/60 hover:bg-white'
                  }`}
                >
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#f5ebe1] text-[#a43716]'
                    }`}
                  >
                    {CATEGORY_ICONS[item.id]}
                  </div>
                  <div className="flex-1 pr-8">
                    <div className="text-xl font-bold leading-snug">
                      {item.titleTamil}
                    </div>
                    <div
                      className={`mt-0.5 text-base font-semibold ${
                        isSelected ? 'text-[#9ff1f0]' : 'text-[#58423c]'
                      }`}
                    >
                      {item.titleEnglish}
                    </div>
                    <p
                      className={`mt-2 text-base leading-snug ${
                        isSelected ? 'text-white/95' : 'text-[#58423c]'
                      }`}
                    >
                      {item.subtitleTamil}
                    </p>
                  </div>
                  {isSelected && (
                    <span
                      className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#006a6a]"
                      aria-hidden="true"
                    >
                      <Check className="h-6 w-6 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* All categories option */}
          <button
            type="button"
            onClick={() => onCategoryChange('all')}
            aria-pressed={category === 'all'}
            className={`tactile-push mt-6 relative flex min-h-[84px] w-full items-center gap-4 rounded-[1.75rem] border-[3px] px-6 py-4 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b8282]/40 cursor-pointer ${
              category === 'all'
                ? 'border-[#2b8282] bg-[#2b8282] text-white shadow-lg'
                : 'border-[#f5ebe1] bg-[#fffdf9] text-[#1f1b18] hover:border-[#d95d39]/60 hover:bg-white'
            }`}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                category === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#f5ebe1] text-[#a43716]'
              }`}
            >
              {CATEGORY_ICONS.all}
            </div>
            <div className="flex-1 pr-10">
              <div className="text-xl font-bold">
                அனைத்துத் துறைகளையும் காட்டு · Show All Matching Opportunities
              </div>
              <div
                className={`text-base ${
                  category === 'all' ? 'text-white/95' : 'text-[#58423c]'
                }`}
              >
                என் வயதுக்கு ஏற்ற சிறந்த அரசுத் திட்டங்களைப் பரிந்துரைக்கவும்
              </div>
            </div>
            {category === 'all' && (
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#006a6a]"
                aria-hidden="true"
              >
                <Check className="h-6 w-6 stroke-[3]" />
              </span>
            )}
          </button>
        </div>

        {/* Step 2: Age Group Choice Tiles */}
        <div className="cushion-card rounded-[2rem] p-6 sm:p-9">
          <div className="mb-6">
            <p className="text-base font-bold text-[#a43716]">படி 2 · Step 2</p>
            <h2 className="mt-1 text-2xl sm:text-[26px] font-bold text-[#1f1b18]">
              பங்கேற்பவரின் வயதுப் பிரிவு எது?
            </h2>
            <p className="mt-1 text-base text-[#58423c]">
              Select the age group (no birth certificate number needed here)
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {AGE_GROUPS.map((age) => {
              const isSelected = ageGroup === age.id;
              return (
                <button
                  key={age.id}
                  type="button"
                  onClick={() => onAgeGroupChange(age.id)}
                  aria-pressed={isSelected}
                  className={`tactile-push relative flex min-h-[96px] w-full items-center gap-4 rounded-[1.5rem] border-[3px] px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b8282]/40 cursor-pointer ${
                    isSelected
                      ? 'border-[#2b8282] bg-[#2b8282] text-white shadow-md'
                      : 'border-[#f5ebe1] bg-[#fffdf9] text-[#1f1b18] hover:border-[#d95d39]/60 hover:bg-white'
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#f5ebe1] text-[#a43716]'
                    }`}
                  >
                    {AGE_ICONS[age.id]}
                  </div>
                  <div className="flex-1 pr-8">
                    <div className="text-xl font-bold">{age.labelTamil}</div>
                    <div
                      className={`text-base font-semibold ${
                        isSelected ? 'text-[#9ff1f0]' : 'text-[#58423c]'
                      }`}
                    >
                      {age.rangeText} · {age.labelEnglish}
                    </div>
                  </div>
                  {isSelected && (
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#006a6a]"
                      aria-hidden="true"
                    >
                      <Check className="h-5 w-5 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Picture-Assisted Input Wells */}
        <div className="cushion-card rounded-[2rem] p-6 sm:p-9">
          <div className="mb-6">
            <p className="text-base font-bold text-[#a43716]">படி 3 · Step 3</p>
            <h2 className="mt-1 text-2xl sm:text-[26px] font-bold text-[#1f1b18]">
              மாவட்டம் மற்றும் விருப்பம் (District & Goal)
            </h2>
            <p className="mt-1 text-base text-[#58423c]">
              தனிப்பட்ட எண்கள் எதையும் உள்ளிடத் தேவையில்லை
            </p>
          </div>

          <div className="space-y-6">
            {/* District Well */}
            <div>
              <label
                htmlFor="tn-district"
                className="mb-2 block text-lg font-bold text-[#1f1b18]"
              >
                உங்கள் மாவட்டம் · Your Tamil Nadu District
              </label>
              <div className="relative flex items-center rounded-3xl border-[3px] border-[#f5ebe1] bg-[#fffdf9] transition-colors focus-within:border-[#2b8282] focus-within:ring-4 focus-within:ring-[#2b8282]/20">
                <span className="pl-5 text-[#a43716]" aria-hidden="true">
                  <MapPin className="h-7 w-7" />
                </span>
                <select
                  id="tn-district"
                  value={district}
                  onChange={(e) => onDistrictChange(e.target.value)}
                  className="min-h-[64px] w-full appearance-none bg-transparent px-4 py-4 pr-10 text-lg font-semibold text-[#1f1b18] focus:outline-none cursor-pointer"
                >
                  {TN_DISTRICTS.map((d) => (
                    <option key={d.en} value={`${d.ta} (${d.en})`}>
                      {d.ta} — {d.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Free-text Optional Goal Well */}
            <div>
              <label
                htmlFor="citizen-interest"
                className="mb-2 block text-lg font-bold text-[#1f1b18]"
              >
                என்ன கற்க விரும்புகிறீர்கள்? (விருப்பமானால் எழுதவும்) · Specific Interest (Optional)
              </label>
              <div className="relative flex items-start rounded-3xl border-[3px] border-[#f5ebe1] bg-[#fffdf9] transition-colors focus-within:border-[#2b8282] focus-within:ring-4 focus-within:ring-[#2b8282]/20">
                <span className="pl-5 pt-5 text-[#2b8282]" aria-hidden="true">
                  <HeartHandshake className="h-7 w-7" />
                </span>
                <textarea
                  id="citizen-interest"
                  rows={3}
                  value={interestText}
                  onChange={(e) => onInterestTextChange(e.target.value)}
                  placeholder="எ.கா: தையல் பயிற்சி, கபடி, TNPSC படிப்பு, சிலம்பம், வாய்ப்பாட்டு... (தமிழில் அல்லது ஆங்கிலத்தில் எழுதலாம்)"
                  className="w-full resize-none bg-transparent px-4 py-4 text-lg text-[#1f1b18] placeholder:text-[#8b716a] focus:outline-none"
                />
              </div>
            </div>

            {/* Privacy Assurance — Short bullet points */}
            <div className="flex items-start gap-3 rounded-2xl bg-[#fbf2ed] p-4 text-base text-[#58423c]">
              <ShieldCheck
                className="mt-0.5 h-6 w-6 shrink-0 text-[#2b8282]"
                aria-hidden="true"
              />
              <ul className="space-y-1">
                <li className="font-bold text-[#1f1b18]">
                  ஆதார், போன் எண், வங்கி விவரம் உள்ளிட வேண்டாம்.
                </li>
                <li>Never enter Aadhaar, phone, or bank details.</li>
              </ul>
            </div>

            {hasSensitiveDigits && (
              <div
                role="alert"
                className="rounded-2xl bg-[#ffdad6] px-5 py-4 text-base font-bold text-[#93000a]"
              >
                கவனம்: ஆதார் எண் அல்லது தொலைபேசி எண் போன்ற எண்களை உள்ளிட வேண்டாம். அவை தானாக நீக்கப்படும்.
              </div>
            )}
          </div>
        </div>

        {/* Primary Giant Tactile CTA with Breathing Glow Ring */}
        <div className="flex flex-col items-center pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="tactile-push breathing-ring inline-flex min-h-[72px] w-full max-w-xl items-center justify-center gap-4 rounded-full bg-[#d95d39] px-8 py-5 text-xl sm:text-[22px] font-bold text-white hover:bg-[#a43716] disabled:opacity-75 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b8282]/40 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-7 w-7 animate-spin shrink-0" aria-hidden="true" />
                <span>உங்களுக்கான அரசுத் திட்டங்களைத் தேடுகிறோம்...</span>
              </>
            ) : (
              <>
                <Search className="h-7 w-7 shrink-0" aria-hidden="true" />
                <span>இலவச அரசுத் திட்டங்களைக் காண்க · Find Free Programs</span>
              </>
            )}
          </button>
          <p className="mt-5 text-center text-base text-[#58423c]">
            100% இலவச தமிழ்நாடு அரசு பயிற்சிகள் மற்றும் மையங்கள்
          </p>
        </div>
      </form>
    </section>
  );
};
