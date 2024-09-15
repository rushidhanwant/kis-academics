import slugify from 'slugify'
import db, { tables } from '../db/db'
import { SaveTutor, SearchTutor, Tutor, TutorSortOrder, TutorSubject, SaveSubject, Subject } from './types'

export const saveTutorSubjects = async (entity: TutorSubject[]): Promise<TutorSubject[]> => {
  return await db<TutorSubject>(tables.tutorsSubjects).insert(entity).returning('*')
}
export const addTutor = async (tutor: SaveTutor, knex = db): Promise<Tutor | undefined> => {
  const slug = slugify(`${tutor.first_name} ${tutor.last_name}`, { replacement: '-', lower: true, strict: true })
  const profilePic = `https://placehold.co/600x400?text=${tutor.first_name[0].toUpperCase()}${tutor.last_name[0].toUpperCase()}`
  try {
    const [newTutor] = await knex<Tutor>(tables.tutors)
      .insert({ ...tutor, slug, profile_picture: profilePic })
      .returning('*')
    return newTutor
  } catch (err) {
    console.error('Failed to save tutor:', err)
    throw err
  }
}
export const saveSubject = async (
  subject: SaveSubject,
  knex = db
): Promise<Subject | undefined> => {
  return await knex<Subject>(tables.subjects)
    .insert(subject)
    .returning('*')
    .then((rows) => rows[0])
}
