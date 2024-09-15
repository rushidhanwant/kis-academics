echo "Setting up database"
psql -U postgres -f setup_db.sql

echo "Running migrations"
npm run db:migrate

