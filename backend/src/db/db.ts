import { knex } from 'knex'
import * as knexconfig from '../../knexfile'
const db = knex(knexconfig)
export default db

export const tables = {
    tutors: 'public.tutors',
    subjects: 'public.subjects',
    tutorsSubjects: 'public.tutors_subjects'
  }