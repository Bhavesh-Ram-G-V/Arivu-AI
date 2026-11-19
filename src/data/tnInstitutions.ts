import { AgeGroupId, CategoryId } from '../types/arivu';

export interface CategoryOption {
  id: CategoryId;
  titleTamil: string;
  titleEnglish: string;
  subtitleTamil: string;
  officeTamil: string;
  officeEnglish: string;
  officerTitle: string;
  documentsSummaryTamil: string;
  helpline: string;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    id: 'sports',
    titleTamil: 'விளையாட்டுப் பயிற்சி',
    titleEnglish: 'Sports Coaching',
    subtitleTamil: 'தடகளம், கபடி, ஹாக்கி, நீச்சல் மற்றும் பல',
    officeTamil: 'மாவட்ட விளையாட்டரங்கம்',
    officeEnglish: 'District Sports Complex (SDAT)',
    officerTitle: 'District Sports Officer (DSO)',
    documentsSummaryTamil: 'வயது சான்றிதழ் / பள்ளி அடையாள அட்டை + 2 புகைப்படங்கள்',
    helpline: '044-25611551',
  },
  {
    id: 'skill',
    titleTamil: 'திறன் & தொழில்நுட்பம்',
    titleEnglish: 'Skill, Craft & Tech',
    subtitleTamil: 'கணினி, தையல், எலக்ட்ரீஷியன், கைவினைப் பயிற்சி',
    officeTamil: 'மாவட்ட திறன் பயிற்சி அலுவலகம் / RSETI',
    officeEnglish: 'District Skill Training Office (Collectorate / Employment Office)',
    officerTitle: 'Assistant Director (Skill Training)',
    documentsSummaryTamil: 'கடைசி மதிப்பெண் சான்றிதழ் + முகவரி சான்றிதழ்',
    helpline: '14417 / 1800-425-1333',
  },
  {
    id: 'library',
    titleTamil: 'நூலகம் & படிப்பு வட்டம்',
    titleEnglish: 'Library & Study Circle',
    subtitleTamil: 'போட்டித் தேர்வு பயிற்சி, இலவசப் புத்தகங்கள், வாசிப்பு',
    officeTamil: 'மாவட்ட மைய நூலகம் / கிளை நூலகம்',
    officeEnglish: 'District Central Library / Branch Library',
    officerTitle: 'Librarian',
    documentsSummaryTamil: 'முகவரி சான்றிதழ் (குடும்ப அட்டை / மாணவர் அடையாள அட்டை)',
    helpline: '044-28524263',
  },
  {
    id: 'culture',
    titleTamil: 'இசை, கலை & சிலம்பம்',
    titleEnglish: 'Folk Art, Music & Silambam',
    subtitleTamil: 'வாய்ப்பாட்டு, நாதஸ்வரம், பரதம், சிலம்பம், நாட்டுப்புறக் கலை',
    officeTamil: 'மாவட்ட அரசு இசைப் பள்ளி / மண்டல கலை பண்பாட்டு அலுவலகம்',
    officeEnglish: 'District Govt Music School / Zonal Art & Culture Office',
    officerTitle: 'Headmaster / Assistant Director',
    documentsSummaryTamil: 'வயது சான்றிதழ் + முகவரி சான்றிதழ்',
    helpline: '044-28193157',
  },
];

export interface AgeGroupOption {
  id: AgeGroupId;
  labelTamil: string;
  labelEnglish: string;
  rangeText: string;
}

export const AGE_GROUPS: AgeGroupOption[] = [
  {
    id: 'child',
    labelTamil: 'பள்ளி மாணவர்',
    labelEnglish: 'School Student',
    rangeText: '6 – 14 வயது',
  },
  {
    id: 'youth',
    labelTamil: 'இளைஞர் / கல்லூரி',
    labelEnglish: 'Youth / College',
    rangeText: '15 – 25 வயது',
  },
  {
    id: 'adult',
    labelTamil: 'பெரியவர்',
    labelEnglish: 'Adult',
    rangeText: '26 – 59 வயது',
  },
  {
    id: 'senior',
    labelTamil: 'மூத்த குடிமக்கள்',
    labelEnglish: 'Senior Citizen',
    rangeText: '60+ வயது',
  },
];

export interface QuickPreset {
  labelTamil: string;
  labelEnglish: string;
  category: CategoryId;
  ageGroup: AgeGroupId;
  interestText: string;
}

export const QUICK_PRESETS: QuickPreset[] = [
  {
    labelTamil: 'பள்ளி மாணவர் விளையாட்டுப் பயிற்சி',
    labelEnglish: 'School Athletics & Kabaddi',
    category: 'sports',
    ageGroup: 'child',
    interestText: 'தடகளம், கபடி அல்லது நீச்சல் போன்ற இலவச விளையாட்டுப் பயிற்சி வேண்டும்',
  },
  {
    labelTamil: 'தையல் & கணினி வேலைவாய்ப்புப் பயிற்சி',
    labelEnglish: 'Tailoring & Computer Skills',
    category: 'skill',
    ageGroup: 'adult',
    interestText: 'சுயதொழில் தொடங்க தையல், கணினி அல்லது கைவினைப் பயிற்சி வேண்டும்',
  },
  {
    labelTamil: 'TNPSC போட்டித் தேர்வு படிப்பு வட்டம்',
    labelEnglish: 'Free Exam Study Circle',
    category: 'library',
    ageGroup: 'youth',
    interestText: 'அரசு போட்டித் தேர்வுகளுக்குப் படிக்க இலவச நூலகம் மற்றும் படிப்பு வட்டம் வேண்டும்',
  },
  {
    labelTamil: 'சிலம்பம் & பாரம்பரிய இசைப் பள்ளி',
    labelEnglish: 'Silambam & Music School',
    category: 'culture',
    ageGroup: 'child',
    interestText: 'சிலம்பம், வாய்ப்பாட்டு அல்லது இசைக் கருவி கற்க அரசு இசைப் பள்ளி விவரம் வேண்டும்',
  },
];

export const TN_DISTRICTS: { ta: string; en: string }[] = [
  { ta: 'அனைத்து மாவட்டங்களும் (பொது)', en: 'Any Tamil Nadu District' },
  { ta: 'சென்னை', en: 'Chennai' },
  { ta: 'கோயம்புத்தூர்', en: 'Coimbatore' },
  { ta: 'மதுரை', en: 'Madurai' },
  { ta: 'திருச்சிராப்பள்ளி', en: 'Tiruchirappalli' },
  { ta: 'சேலம்', en: 'Salem' },
  { ta: 'திருநெல்வேலி', en: 'Tirunelveli' },
  { ta: 'ஈரோடு', en: 'Erode' },
  { ta: 'வேலூர்', en: 'Vellore' },
  { ta: 'தஞ்சாவூர்', en: 'Thanjavur' },
  { ta: 'திண்டுக்கல்', en: 'Dindigul' },
  { ta: 'தூத்துக்குடி', en: 'Thoothukudi' },
  { ta: 'கன்னியாகுமரி', en: 'Kanyakumari' },
  { ta: 'திருப்பூர்', en: 'Tiruppur' },
  { ta: 'காஞ்சிபுரம்', en: 'Kancheepuram' },
  { ta: 'செங்கல்பட்டு', en: 'Chengalpattu' },
  { ta: 'திருவள்ளூர்', en: 'Tiruvallur' },
  { ta: 'கடலூர்', en: 'Cuddalore' },
  { ta: 'விழுப்புரம்', en: 'Viluppuram' },
  { ta: 'கள்ளக்குறிச்சி', en: 'Kallakurichi' },
  { ta: 'திருவண்ணாமலை', en: 'Tiruvannamalai' },
  { ta: 'ராணிப்பேட்டை', en: 'Ranipet' },
  { ta: 'திருப்பத்தூர்', en: 'Tirupattur' },
  { ta: 'கிருஷ்ணகிரி', en: 'Krishnagiri' },
  { ta: 'தர்மபுரி', en: 'Dharmapuri' },
  { ta: 'நாமக்கல்', en: 'Namakkal' },
  { ta: 'கரூர்', en: 'Karur' },
  { ta: 'நாகப்பட்டினம்', en: 'Nagapattinam' },
  { ta: 'மயிலாடுதுறை', en: 'Mayiladuthurai' },
  { ta: 'திருவாரூர்', en: 'Tiruvarur' },
  { ta: 'புதுக்கோட்டை', en: 'Pudukkottai' },
  { ta: 'சிவகங்கை', en: 'Sivaganga' },
  { ta: 'ராமநாதபுரம்', en: 'Ramanathapuram' },
  { ta: 'விருதுநகர்', en: 'Virudhunagar' },
  { ta: 'தேனி', en: 'Theni' },
  { ta: 'தென்காசி', en: 'Tenkasi' },
  { ta: 'நீலகிரி', en: 'The Nilgiris' },
  { ta: 'அரியலூர்', en: 'Ariyalur' },
  { ta: 'பெரம்பலூர்', en: 'Perambalur' },
];
