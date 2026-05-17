# Salon Management System

Full-stack salon management system with React, Material UI, Express, Sequelize, MySQL, JWT auth, appointments, dashboards, payments, invoices, notifications, FAQ, inventory, and suppliers.

## Folder Structure

- `Backend/` - Express MVC API
- `Backend/models/` - Sequelize models and associations
- `Backend/controllers/` - Request handlers
- `Backend/routes/` - REST routes
- `Backend/services/` - Notification and invoice services
- `Backend/validators/` - `express-validator` rules
- `frontend/` - Vite React app with Material UI, Axios, Formik, Yup, and Recharts

## Backend Setup

1. Create MySQL database:

```sql
CREATE DATABASE salon_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Install backend dependencies:

```bash
cd Backend
npm install
```

3. Create `.env` from `.env.example` and set `JWT_SECRET`, database credentials, and optional SMTP values.

4. Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:5000/api`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The React app runs at `http://localhost:5173`.

## Database Schema

Sequelize creates the schema from models when `DB_ALTER=true`. Main tables:

- `users`: Admin, Staff, Customer accounts with bcrypt-hashed passwords.
- `services`: Salon services with price and duration.
- `appointments`: Links customer, staff, and service. Tracks `Booked`, `Completed`, `Cancelled`.
- `payments`: Payment records linked to appointments.
- `invoices`: Invoice records linked to payments and appointments with immutable JSON snapshot.
- `notifications`: In-app/email notification records.
- `products`, `inventories`, `suppliers`, `product_suppliers`: Inventory and supplier management.
- `faqs`: Published FAQ content.

## Example Invoice JSON

```json
{
  "invoiceNumber": "INV-2026-000001",
  "subtotal": 450,
  "tax": 0,
  "total": 450,
  "billingSnapshot": {
    "customer": { "id": 3, "name": "Ava Smith", "email": "ava@example.com" },
    "staff": { "id": 2, "name": "Mia Stylist" },
    "service": { "id": 1, "name": "Silk Press", "price": 450 },
    "appointment": { "id": 10, "startTime": "2026-05-01T10:00:00.000Z" },
    "payment": { "id": 7, "method": "Card", "reference": "POS-123" }
  }
}
```

## Postman Examples

Set Postman variable `baseUrl` to `http://localhost:5000/api` and `token` to the login response token.

### Register

`POST {{baseUrl}}/auth/register`

```json
{
  "firstName": "Ava",
  "lastName": "Smith",
  "email": "ava@example.com",
  "phone": "+27111222333",
  "password": "StrongPass1!",
  "role": "Customer"
}
```

### Login

`POST {{baseUrl}}/auth/login`

```json
{
  "email": "ava@example.com",
  "password": "StrongPass1!"
}
```

### Create Service

`POST {{baseUrl}}/services`

Headers: `Authorization: Bearer {{token}}`

```json
{
  "name": "Silk Press",
  "description": "Wash, blowout, and press",
  "durationMinutes": 90,
  "price": 450
}
```

### Book Appointment

`POST {{baseUrl}}/appointments`

Headers: `Authorization: Bearer {{token}}`

```json
{
  "staffId": 2,
  "serviceId": 1,
  "startTime": "2026-05-01T10:00:00.000Z",
  "notes": "Prefer a quiet appointment"
}
```

### Update Appointment Status

`PATCH {{baseUrl}}/appointments/1/status`

```json
{
  "status": "Completed"
}
```

### Dashboard Stats

`GET {{baseUrl}}/dashboard/stats`

### Record Payment

`POST {{baseUrl}}/payments`

```json
{
  "appointmentId": 1,
  "amount": 450,
  "method": "Card",
  "reference": "POS-123"
}
```

### Create Product

`POST {{baseUrl}}/inventory/products`

```json
{
  "name": "Shampoo 500ml",
  "sku": "SHAMP-500",
  "unitCost": 55,
  "retailPrice": 120,
  "quantity": 20,
  "reorderLevel": 5,
  "supplierIds": [1]
}
```
