import { faker } from '@faker-js/faker'
import { Knex } from 'knex'
import { TutorPricing, Curriculum } from '../src/tutors/types'
import * as tutorRepo from '../src/tutors/repo'
import { curriculums, pricing, schools, subjects } from '../utils/constants'

export async function seed(knex: Knex): Promise<void> { 
    const tutorsResp = await Promise.all(
        Array.from({ length: 50 }).map(async () => {
          const tutor = await tutorRepo.addTutor(
            {
              first_name: faker.person.firstName(),
              last_name: faker.person.lastName(),
              atar: faker.number.int({ min: 0, max: 100 }),
              available: faker.helpers.arrayElement([true, false]),
              bio: faker.lorem.sentences(10),
              postcode: faker.location.zipCode(),
              price: faker.helpers.arrayElement<TutorPricing>(pricing as TutorPricing[]),
              school: faker.helpers.arrayElement<string>(schools as string[])
            },
            knex
          )
          return tutor ? tutor.id : null
        })
      )


  const shuffledSubjectNames = faker.helpers.shuffle(subjects).slice(0, 15)

  const subjectsResp = await Promise.all(
    shuffledSubjectNames.map(async (name) => {
      const subject = await tutorRepo.saveSubject(
        {
          name,
          curriculum: faker.helpers.arrayElement<Curriculum>(curriculums as Curriculum[]),
        },
        knex
      )
      return subject ? subject.id : null
    })
  )

  await Promise.all(
    tutorsResp.map(async (tutor) => {
      if (tutor) {
        const subjectsToLink = faker.helpers.arrayElements(subjectsResp.filter(Boolean), {
          min: 2,
          max: 4
        })
        const toInsert = subjectsToLink.map((sub) => ({ tutor_id: tutor, subject_id: sub }))
        await tutorRepo.saveTutorSubjects(toInsert)
      }
    })
  )
}