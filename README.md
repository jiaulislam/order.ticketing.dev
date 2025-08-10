# Order Service

This service is part of the ticketing.dev microservices architecture. It manages order creation, updates, retrieval, and deletion for tickets. The service is built with Node.js, TypeScript, Express, and Prisma ORM.

## Features

- Create, update, delete, and fetch orders
- RESTful API endpoints
- JWT-based authentication
- PostgreSQL database integration via Prisma
- Environment-based configuration
- Error handling and validation

## Folder Structure

```
order-service/
├── .env
├── Dockerfile
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app.ts
│   ├── index.ts
│   ├── routes/
│   │   ├── index.ts
│   │   └── order.route.ts
│   └── service/
│       └── index.ts
```

## Environment Variables

Set these in `.env`:
- `DATABASE_URL` – PostgreSQL connection string
- `JWT_SECRET` – Secret key for JWT authentication
- `SERVER_PORT` – Port to run the service (default: 4002)
- `NODE_ENV` – Environment (development/production)

## API Endpoints

### Order Routes
- `POST /api/v1/order` – Create a new order
- `GET /api/v1/order/:id` – Get order by ID
- `PUT /api/v1/order/:id` – Update order
- `DELETE /api/v1/order/:id` – Delete order
- `GET /api/v1/order` – List all orders

### Authentication
- All endpoints require a valid JWT in the `Authorization` header.

## Database

- Uses PostgreSQL
- Prisma ORM for migrations and queries
- See `prisma/schema.prisma` for schema definition

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up `.env` file with required variables.
3. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
4. Start the service:
   ```bash
   npm run start
   ```

## Docker

To build and run with Docker:
```bash
docker build -t order-service .
docker run --env-file .env -p 4002:4002 order-service
```

## Development

- Uses TypeScript for type safety
- ESLint and Prettier for code quality
- Hot-reload with `ts-node-dev` (if configured)

## Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

## License
MIT

## Contact
For questions or support, contact the maintainer at [your-email@example.com].
