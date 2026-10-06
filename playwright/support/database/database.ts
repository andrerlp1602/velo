import pg from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import type { Database } from './schema'

export function createDatabase(): Kysely<Database> {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL não definida. Copie .env.example para .env e preencha os valores.',
    )
  }

  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new pg.Pool({ connectionString, max: 10 }),
    }),
  })
}
