export interface ArivuProgram {
  title_tamil: string;
  eligibility_tamil: string[] | string;
  free_benefits_tamil: string[] | string;
  where_to_go_tamil: string;
  whom_to_contact_tamil: string;
  documents_to_carry_tamil: string[];
}

export interface ArivuResponse {
  summary_tamil: string;
  programs: ArivuProgram[];
  helpline: string;
  spoken_explanation_tamil: string;
}

export type CategoryId = 'sports' | 'skill' | 'library' | 'culture' | 'all';

export type AgeGroupId = 'child' | 'youth' | 'adult' | 'senior';

export interface SearchRequestPayload {
  category: CategoryId;
  ageGroup: AgeGroupId;
  district: string;
  interestText: string;
}
