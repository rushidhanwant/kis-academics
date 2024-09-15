import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const query = `
    create type prices as enum ('gold', 'platinum', 'executive');

    create table public.tutors (
        created_at timestamptz default now(),
        updated_at timestamptz default now(),
        id BIGSERIAL PRIMARY KEY,
        first_name text,
        last_name text,
        slug text,
        price prices default 'gold',
        school text,
        atar integer not null check ( atar between 0 and 100 ),
        bio text,
        profile_picture text,
        available boolean default false,
        postcode text
    );

    create trigger tutors_updated
    before insert or update on public.tutors
    for each row execute procedure update_updated_at();
  `
  return knex.schema.raw(query)
}

export async function down(knex: Knex): Promise<void> {
  const query = `
    drop table if exists public.tutors cascade;
    drop type prices;
  `
  return knex.schema.raw(query)
}
