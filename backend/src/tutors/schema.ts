import joi from 'joi'
import { TutorSortOrder } from './types'

export const search = joi
  .object({
    query: joi.string().optional(),
    price: joi.string().valid('gold', 'premium', 'executive').optional(),
    school: joi.string().optional(),
    postcode: joi.string().optional(),
    curriculum: joi.string().valid('VCE', 'WACE', 'HSC', 'QCE', 'IB').optional(),
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
    tutor: joi.string().uuid().required()
  })
  .label('Tutor profile id')

export const request = joi.object({
  name: joi.string().required(),
  message: joi.string().required()
})
