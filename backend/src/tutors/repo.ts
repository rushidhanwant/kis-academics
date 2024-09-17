import slugify from 'slugify'
import db, { tables } from '../db/db'
import { SaveTutor, SearchTutorOptions, Tutor, TutorSortOrder, TutorSubject, SaveSubject, Subject } from './types'

export const saveTutorSubjects = async (entity: TutorSubject[]): Promise<TutorSubject[]> => {
  return await db<TutorSubject>(tables.tutorsSubjects).insert(entity).returning('*')
}

export const getTutorById = async (id: string): Promise<Tutor | undefined> => {
  try {
    return await db(tables.tutors).select('*').where('id', id).first<Tutor>()
  } catch (err) {
    console.error('Failed to find tutor by ID:', err)
    throw err
  }
}

export const fetchTutorProfile = async (id: string): Promise<Tutor | undefined> => {
  try {
    return await db
      .select(`${tables.tutors}.*`, db.raw(`jsonb_agg(${tables.subjects}.*) as subjects`))
      .from(tables.tutors)
      .leftJoin(tables.tutorsSubjects, `${tables.tutors}.id`, `${tables.tutorsSubjects}.tutor_id`)
      .leftJoin(tables.subjects, `${tables.tutorsSubjects}.subject_id`, `${tables.subjects}.id`)
      .where(`${tables.tutors}.id`, id)
      .groupBy(`${tables.tutors}.id`)
      .first<Tutor>()
  } catch (err) {
    console.error('Failed to get tutor profile:', err)
    throw err
  }
}

export const addTutor = async (tutor: SaveTutor, knex = db): Promise<Tutor | undefined> => {
  const slug = slugify(`${tutor.first_name} ${tutor.last_name} `, { replacement: '-', lower: true, strict: true })
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

export const findTutors = async (options: SearchTutorOptions) => {
  const limit = 15;
  const offset = options.page > 0 ? limit * (options.page - 1) : 0
  
  const baseQuery = db
    .from(tables.tutors)
    .leftJoin(tables.tutorsSubjects, `${tables.tutors}.id`, `${tables.tutorsSubjects}.tutor_id`)
    .leftJoin(tables.subjects, `${tables.tutorsSubjects}.subject_id`, `${tables.subjects}.id`)

  // Apply filters
  if (options.query) {
    baseQuery.where(function () {
      this.whereILike('first_name', `%${options.query}%`).orWhereILike('last_name', `%${options.query}%`)
    })
  }
  if (options.curriculum) {
    baseQuery.andWhere('curriculum', '=', options.curriculum)
  }
  if (options.postcode) {
    baseQuery.andWhere('postcode', '=', options.postcode)
  }
  if (options.price) {
    baseQuery.andWhere('price', '=', options.price)
  }
  if (options.school) {
    baseQuery.andWhereILike('school', `%${options.school}%`)
  }
  if (options.subject) {
    const subjects = JSON.parse(decodeURIComponent(options.subject));
    for (const subject of subjects) {
      baseQuery.orWhere('subjects.name', `${subject}`)
    }
  }

  // Clone the base query for the count
  const countQuery = baseQuery.clone()
    .select(`${tables.tutors}.*`)
    .groupBy(`${tables.tutors}.id`);

  // Modify the base query for fetching tutors
  const tutorsQuery = baseQuery
    .select(`${tables.tutors}.*`, db.raw(`jsonb_agg(${tables.subjects}.*) as subjects`))
    .orderBy(...getOrderSequence(options.sort))
    .groupBy(`${tables.tutors}.id`)
    .limit(limit)
    .offset(offset)
  try {
    const [tutors, countResult] = await Promise.all([
      tutorsQuery,
      countQuery
    ])

    const total = countResult.length

    return {
      tutors,
      total,
      page: options.page,
      totalPages: Math.ceil(total / limit)
    }
  } catch (err) {
    console.error('Failed to search tutors:', err)
    throw err
  }
}
