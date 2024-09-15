psql -U postgres -f setup_db.sql

# run all migrations
npm run db:migrate
