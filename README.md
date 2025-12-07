Run Steps

- Backend
  - cd server
  - npm install
  - npx prisma generate
  - npx prisma migrate dev --name init
  - node src/seed.js
  - node src/index.js
- Frontend
  - cd client
  - npm install
  - npm run build or npm run dev