import { knex } from 'knex'
import * as knexconfig from '../../knexfile'
const db = knex(knexconfig)
export default db

