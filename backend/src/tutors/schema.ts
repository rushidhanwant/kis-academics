import joi from 'joi'
import { TutorSortOrder } from './types'
import { curriculums, pricing } from '../../utils/constants'

export const search = joi
  .object({
    query: joi.string().optional(),
    price: joi.string().valid(...pricing).optional(),
    school: joi.string().optional(),
    postcode: joi.string().optional(),
    curriculum: joi.string().valid(...curriculums).optional(),
    subject: joi.string().optional(),
    sort: joi
      .string()
      .valid(...Object.values(TutorSortOrder))
      .default(TutorSortOrder.atar_desc),
    page: joi.number().default(0)
  })
  .label('Search tutors')

export const profile = joi
  .object({
    tutorId: joi.number().required()
  })
  .label('Tutor profile id')

export const request = joi.object({
  name: joi.string().required(),
  message: joi.string().required()
})
