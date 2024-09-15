import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const query = `
    create table public.tutors_subjects (
        tutor_id BIGINT references public.tutors(id) on delete cascade,
        subject_id BIGINT references public.subjects(id) on delete cascade
    );
  `
  return knex.schema.raw(query)
}

export async function down(knex: Knex): Promise<void> {
  const query = `
    drop table if exists public.tutors_subjects cascade;
  `
  return knex.schema.raw(query)
}
