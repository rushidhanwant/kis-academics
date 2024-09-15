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

const getOrderSequence = (order: TutorSortOrder): [string, 'asc' | 'desc'] => {
  switch (order) {
    case TutorSortOrder.created_asc:
      return ['created_at', 'asc']
    case TutorSortOrder.created_desc:
      return ['created_at', 'desc']
    case TutorSortOrder.atar_asc:
      return ['atar', 'asc']
    case TutorSortOrder.atar_desc:
      return ['atar', 'desc']
    default:
      throw new Error('Invalid sort order')
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

export const findTutors = async (options: SearchTutor) => {
  const limit = 15;
  const offset = options.page > 0 ? limit * (options.page - 1) : 0
  const query = db
    .select(`${tables.tutors}.*`)
    .from(tables.tutors)
    .leftJoin(tables.tutorsSubjects, `${tables.tutors}.id`, `${tables.tutorsSubjects}.tutor_id`)
    .leftJoin(tables.subjects, `${tables.tutorsSubjects}.subject_id`, `${tables.subjects}.id`)
    .orderBy(...getOrderSequence(options.sort))
    .groupBy(`${tables.tutors}.id`)
    .limit(limit)
    .offset(offset)

  if (options.query) {
    query.where(function () {
      this.whereILike('first_name', `%${options.query}%`).orWhereILike('last_name', `%${options.query}%`)
    })
  }
  if (options.price) {
    query.andWhere('price', '=', options.price)
  }
  if (options.school) {
    query.andWhereILike('school', `%${options.school}%`)
  }
  if (options.postcode) {
    query.andWhere('postcode', '=', options.postcode)
  }
  if (options.curriculum) {
    query.andWhere('curriculum', '=', options.curriculum)
  }
  if (options.subject) {
    query.andWhereILike('subjects.name', `%${options.subject}%`)
  }

  try {
    return await query
  } catch (err) {
    console.error('Failed to search tutors:', err)
    throw err
  }
}
