export type TutorPricing = 'gold' | 'platinum' | 'executive'

export interface TutorSubject {
  tutor_id: string
  subject_id: string | null
}

export type Curriculum = 'VCE' | 'WACE' | 'HSC' | 'QCE' | 'IB'

export interface Subject {
  id: string
  created_at: string
  updated_at: string
  name: string
  curriculum: Curriculum
}

export interface SaveSubject {
  name: string
  curriculum: Curriculum
}

export enum TutorSortOrder {
  created_asc = 'created_asc',
  created_desc = 'created_desc',
  atar_asc = 'atar_asc',
  atar_desc = 'atar_desc'
}

export interface Tutor {
  id: string
  created_at: string
  updated_at: string
  first_name: string
  last_name: string
  slug: string
  price: TutorPricing
  school: string
  atar: number
  bio: string
  profile_picture: string
  available: boolean
  postcode: string
}

export interface SaveTutor {
  first_name: string
  last_name: string
  school: string
  atar: number
  bio: string
  price: TutorPricing
  profile_picture?: string
  available: boolean
  postcode: string
}

export interface SearchTutorOptions {
  query?: string
  price?: TutorPricing
  school?: string
  postcode?: string
  curriculum?: Curriculum
  subject?: string
  sort: TutorSortOrder
  page: number
}
