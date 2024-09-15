import * as hapi from '@hapi/hapi'

export const register = (server: hapi.Server): void => {
  server.route({
    method: 'get',
    path: '/internal/ping',
    options: {
      handler: () => 'pong',
      tags: ['api', 'internal'],
      auth: false,
      description: 'Returns pong',
      notes: 'Diagnostic API responding to ping'
    }
  })
}
