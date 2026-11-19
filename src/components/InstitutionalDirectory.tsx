import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Building2,
  FileText,
  Music,
  PhoneCall,
  Trophy,
  UserCheck,
  Wrench,
} from 'lucide-react';
import { CATEGORY_OPTIONS } from '../data/tnInstitutions';
import { CategoryId } from '../types/arivu';

interface InstitutionalDirectoryProps {
  onSelectCategory: (category: CategoryId) => void;
}

const ICONS: Record<string, React.ReactNode> = {
  sports: <Trophy className="h-7 w-7 text-[#a43716]" aria-hidden="true" />,
  skill: <Wrench className="h-7 w-7 text-[#a43716]" aria-hidden="true" />,
  library: <BookOpen className="h-7 w-7 text-[#a43716]" aria-hidden="true" />,
  culture: <Music className="h-7 w-7 text-[#a43716]" aria-hidden="true" />,
};

export const InstitutionalDirectory: React.FC<InstitutionalDirectoryProps> = ({
  onSelectCategory,
}) => {
  return (
    <section id="offices" aria-label="Tamil Nadu Official Institutional Directory" className="space-y-6 pt-4">
      <div>
        <p className="text-base font-bold text-[#006a6a]">
          தமிழ்நாடு அரசு நேரடி மையங்கள் · Official Institutional Counters
        </p>
        <h2 className="mt-1 text-2xl sm:text-[28px] font-bold text-[#1f1b18]">
          எந்த அலுவலகத்திற்குச் செல்ல வேண்டும்?
        </h2>
        <p className="mt-1 text-lg text-[#58423c]">
          நேரடியாகச் சென்று சந்திக்க வேண்டிய அரசு அதிகாரிகள் மற்றும் உதவி எண்கள்
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {CATEGORY_OPTIONS.map((office) => (
          <article
            key={office.id}
            className="cushion-card cushion-card-interactive flex flex-col justify-between rounded-[2rem] p-6 sm:p-7"
          >
            <div>
              <div className="flex items-center gap-4 pb-4 border-b border-[#f0e6e1]">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fbf2ed]">
                  {ICONS[office.id]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1f1b18]">
                    {office.titleTamil}
                  </h3>
                  <p className="text-base font-semibold text-[#58423c]">
                    {office.titleEnglish}
                  </p>
                </div>
              </div>

              <dl className="mt-5 space-y-4 text-base">
                <div>
                  <dt className="flex items-center gap-2 font-bold text-[#58423c]">
                    <Building2 className="h-5 w-5 text-[#a43716] shrink-0" aria-hidden="true" />
                    <span>செல்ல வேண்டிய இடம்</span>
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-[#1f1b18]">
                    {office.officeTamil} ({office.officeEnglish})
                  </dd>
                </div>

                <div>
                  <dt className="flex items-center gap-2 font-bold text-[#58423c]">
                    <UserCheck className="h-5 w-5 text-[#2b8282] shrink-0" aria-hidden="true" />
                    <span>சந்திக்க வேண்டிய அதிகாரி</span>
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-[#1f1b18]">
                    {office.officerTitle}
                  </dd>
                </div>

                <div>
                  <dt className="flex items-center gap-2 font-bold text-[#58423c]">
                    <FileText className="h-5 w-5 text-[#2b8282] shrink-0" aria-hidden="true" />
                    <span>தேவையான ஆவணங்கள்</span>
                  </dt>
                  <dd className="mt-1 text-base text-[#1f1b18]">
                    {office.documentsSummaryTamil}
                  </dd>
                </div>

                <div>
                  <dt className="flex items-center gap-2 font-bold text-[#58423c]">
                    <PhoneCall className="h-5 w-5 text-[#a43716] shrink-0" aria-hidden="true" />
                    <span>உதவி எண் · Helpline</span>
                  </dt>
                  <dd className="mt-1 text-lg font-bold tabular-nums text-[#1f1b18]">
                    {office.helpline}
                  </dd>
                </div>
              </dl>
            </div>

            <button
              type="button"
              onClick={() => onSelectCategory(office.id)}
              className="tactile-push mt-6 inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#f5ebe1] px-5 py-3 text-base font-bold text-[#1f1b18] hover:bg-[#2b8282] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b8282]/40 cursor-pointer"
            >
              <span>இதில் உள்ள திட்டங்களைக் காண்க</span>
              <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};
