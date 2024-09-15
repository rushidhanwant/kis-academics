import * as hapi from '@hapi/hapi'
import * as handler from './handler'
import * as schema from './schema'

export const registerRoutes = (server: hapi.Server): void => {
  server.route({
    method: 'GET',
    path: '/tutors/search',
    options: {
      handler: async (request: hapi.Request, h: hapi.ResponseToolkit): Promise<hapi.ResponseObject> => {
        try {
          return await handler.handleSearchTutors(request, h)
        } catch (err) {
          console.error('API error:', request.url.href, err)
          return h.response({ error: err }).code(400)
        }
      },
      tags: ['api', 'tutors', 'search'],
      validate: {
        query: schema.search
      },
      description: 'Search tutors',
      notes: 'Search tutors by filters'
    }
  })

