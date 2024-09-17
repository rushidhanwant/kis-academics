

export interface Tutor {
    id: string;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    slug: string;
    price: string;
    school: string;
    atar: number;
    bio: string;
    profile_picture: string;
    available: boolean;
    postcode: string;
    metadata: object;
    subjects: Subject[];
  }
  export interface Subject {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    curriculum: string;
  }
  export interface TutorProfile extends Tutor {
    subjects: Subject[];
  }