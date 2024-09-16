import * as hapi from '@hapi/hapi'
import { isNil } from 'ramda'
import * as repo from './repo'
import { SearchTutorOptions } from './types'

export const handleSearchTutors = async (
  request: hapi.Request,
  h: hapi.ResponseToolkit
): Promise<hapi.ResponseObject> => {
  try {
    const result = await repo.findTutors(request.query as SearchTutorOptions)
    return h.response(result).code(200)
  } catch (err) {
    console.error('Error during tutor search:', err)
    return h.response({ error: 'internal-server-error', message: 'An error occurred' }).code(500)
  }
}

export const handleGetTutorProfile = async (
  request: hapi.Request,
  h: hapi.ResponseToolkit
): Promise<hapi.ResponseObject> => {
  try {
    const { tutorId } = request.params as { tutorId: string }
    const result = await repo.fetchTutorProfile(tutorId)
    if (isNil(result)) {
      return h.response({ error: 'tutor-not-found', message: 'Invalid ID' }).code(404)
    }
    return h.response(result).code(200)
  } catch (err) {
    console.error('Error fetching tutor profile:', err)
    return h.response({ error: 'internal-server-error', message: 'An error occurred' }).code(500)
  }
}

export const handleRequestTutor = async (
  request: hapi.Request,
  h: hapi.ResponseToolkit
): Promise<hapi.ResponseObject> => {
  try {
    const { tutorId } = request.params as { tutorId: string }
    const data = request.payload as { name: string; message: string }
    const existing = await repo.getTutorById(tutorId)
    if (isNil(existing)) {
      return h.response({ error: 'tutor-not-found', message: 'Invalid ID' }).code(404)
    }
    console.log(`Tutor ${existing.first_name}(${existing.id})`)
    console.log(`${data.name} : ${data.message}`)
    return h.response('Request submitted').code(200)
  } catch (err) {
    console.error('Error requesting tutor:', err)
    return h.response({ error: 'internal-server-error', message: 'An error occurred' }).code(500)
  }
}
