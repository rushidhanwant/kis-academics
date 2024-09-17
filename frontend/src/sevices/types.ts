
export type TutorPricing = "gold" | "platinum" | "executive";
export type Curriculum = "VCE" | "WACE" | "HSC" | "QCE" | "IB";
export enum TutorSortOrder {
    created_asc = "created_asc",
    created_desc = "created_desc",
    atar_asc = "atar_asc",
    atar_desc = "atar_desc",
  }
export interface TutorSearchOptions {
    query?: string;
    price?: string;
    school?: string;
    postcode?: string;
    curriculum?: string;
    subject?: string;
    sort: TutorSortOrder;
    page: number;
  }