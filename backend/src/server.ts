import * as hapi from '@hapi/hapi'
import config from './config'
import * as diagnostic from './diagnostic/router'
import * as tutors from './tutors/router'
export const init = async (): Promise<hapi.Server> => {
  // Hapi JS server initialization
  const server = hapi.server({
    port: config.port,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*']
        // an array of origins or 'ignore',
      }
    }
  })

  // Swagger configuration
  const swaggerOptions = {
    info: {
      title: 'Hapi API Documentation',
      version: '0.0.1'
    },
    host: `${config.baseUrl}`,
  }

  // initialize routers
  diagnostic.registerRoutes(server)
  tutors.registerRoutes(server)

  await server.initialize()
  return server
}
