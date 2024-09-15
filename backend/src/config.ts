import dotenv from 'dotenv'
import _ from 'ramda'

dotenv.config()

const baseUrl = process.env.BASE_URL || '0.0.0.0:4000'

const config = {
  baseUrl,
  port: process.env.PORT || 4000,
}

const dev = _.mergeRight(config, {
  db: {
    url: process.env.DB
  }
})

const test = _.mergeRight(config, {
  db: {
    url: process.env.DB_TEST
  }
})

export = (function () {
  switch (process.env.NODE_ENV) {
    case 'dev':
      return dev
    case 'test':
      return test
    default:
      return dev
  }
})()
