# Cura — Healthcare Backend Server

Cura is a scalable healthcare backend server built with Node.js and Express. It manages patients, doctors, appointments, and **Electronic Medical Records (EMR)** — with role-based access control, concurrent-safe timeslot booking, and asynchronous notifications, all orchestrated through a Docker microservices architecture.

---

## Features

- **Authentication & Authorization** — JWT-based auth with separate roles for `Patient` and `Doctor`. Access to resources is strictly scoped by role.
- **Electronic Medical Records (EMR)** — Each patient has a dedicated EMR stored in MongoDB. Records and files (stored via **GridFS**) are only accessible to the doctor who owns the booked timeslot for that patient.
- **Timeslot Booking** — Race-condition-safe appointment booking via a dedicated `BookingService` using a request/response message pattern over RabbitMQ.
- **Notifications & Email** — Asynchronous email delivery on signup, booking confirmation, and cancellation via `MailingAndNotificationService` using a pub/sub pattern over RabbitMQ.

---

## Tech Stack

| Category         | Technology                    |
| ---------------- | ----------------------------- |
| Runtime          | Node.js, Express              |
| Relational DB    | MySQL + Sequelize (ORM)       |
| Document DB      | MongoDB + Mongoose (ODM)      |
| Message Queue    | RabbitMQ                      |
| Containerization | Docker                        |
| Orchestration    | docker-compose                |
| Email            | Nodemailer                    |
| Auth             | JWT (access + refresh tokens) |
| Security         | bcrypt                        |
| CI/CD            | CircleCI                      |

---

## Data Storage

Cura uses two databases with distinct responsibilities:

| Database    | ORM/ODM   | Stores                                                               |
| ----------- | --------- | -------------------------------------------------------------------- |
| **MySQL**   | Sequelize | Users (patients & doctors), timeslots, appointments, relational data |
| **MongoDB** | Mongoose  | EMR documents and files per patient (files via **GridFS**)           |

<div style="display: flex;">
  <img src="./diagrams/Database_UML_diagram.jpg" alt="SQL database diagram" style="width: 50%;">
</div>
<div style="display:flex;x">
  <img src="./diagrams/EMR_diagram.jpg" alt="NoSQL database diagram" style="width: 50%; margin: 10px 10px 10px 0px">
  <img src="./diagrams/GridFS.jpg" alt="NoSQL database diagram" style="width: 50%; margin: 10px 0px 10px 0px">
</div>

### EMR Access Control

A doctor can only access a patient's EMR if they own the timeslot that was booked by that patient. This is enforced at the service layer — not just at the route level — so no doctor can query another doctor's patient records.

---

## System Architecture

![System Architecture Diagram](./diagrams/SystemArchitecture.jpg)

### Containers

#### 1. Server (Main)

The primary entry point for all CRUD operations, authentication, authorization, and EMR access. Follows the **MVC pattern** with a `Controller → Service → Repository → Model` layering structure. Issues and validates JWTs for both `Patient` and `Doctor` roles, and enforces EMR access rules at the service layer.

#### 2. MySQL Database

Relational database server managed via Sequelize ORM. Stores users (patients and doctors), timeslots, and appointment records.

#### 3. MongoDB Database

Document database server managed via Mongoose ODM. Stores each patient's EMR documents and binary files via **GridFS**.

#### 4. BookingService

A dedicated microservice responsible for booking timeslots. It exists specifically to solve **race condition problems** over shared resources by serializing booking requests through the message queue.

#### 5. MailingAndNotificationService

Handles asynchronous side effects that the main server does not need to wait on — such as sending signup confirmation emails, booking confirmations, and cancellation notifications.

#### 6. RabbitMQ

The message broker linking all three services. Two messaging patterns are used:

| Pattern                 | Participants                           | Behavior                                                                        |
| ----------------------- | -------------------------------------- | ------------------------------------------------------------------------------- |
| **Publish / Subscribe** | Server → MailingAndNotificationService | Server publishes a message and does **not** wait for a response                 |
| **Request / Response**  | Server ↔ BookingService                | Server sends a booking request and **waits for confirmation** before proceeding |

<div style="display:flex;x">
  <img src="./diagrams/Producer_consumer_pattern.jpg" alt="producer-consumer diagram" style="width: 25%; margin: 10px 10px 10px 0px">
  <img src="./diagrams/Request_Response_pattern.jpg" alt="request-response diagram" style="width: 25%; margin: 10px 0px 10px 0px">
</div>

---

## Project Structure

The main server follows a strict layered architecture:

```
src/
├── controllers/     # Route handlers — parse requests, return responses
├── services/        # Business logic layer
├── repositories/    # Data access layer (DB queries)
└── models/          # Sequelize & Mongoose model definitions
```

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose installed
- Node.js (for local development outside Docker)
- `openssl` (for generating JWT secrets)

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/cura.git
cd cura
```

### 2. Configure Environment Variables

Each service that needs configuration has its own `.env.docker` file. Create them before starting the containers:

- `./Server/.env.docker`
- `./BookingService/.env.docker`

#### `Server/.env.docker`

```env
# Server
PORT=
NODE_ENV=

# MySQL — dev environment
DATABASE_DEV_USERNAME=
DATABASE_DEV_PASSWORD=
DATABASE_DEV_DATABASE=
DATABASE_DEV_HOST=mysql_server      # matches the docker-compose service name
DATABASE_DEV_PORT=3306
DATABASE_DEV_DIALECT=mysql

# MySQL — production environment
DATABASE_PROD_USERNAME=
DATABASE_PROD_PASSWORD=
DATABASE_PROD_DATABASE=
DATABASE_PROD_HOST=mysql_server
DATABASE_PROD_PORT=3306
DATABASE_PROD_DIALECT=mysql

# MySQL — test environment
DATABASE_TEST_USERNAME=
DATABASE_TEST_PASSWORD=
DATABASE_TEST_DATABASE=
DATABASE_TEST_HOST=mysql_server
DATABASE_TEST_PORT=3306
DATABASE_TEST_DIALECT=mysql

# MongoDB
MONGODB_URI=mongodb://mongoadmin:mongopasswd@mongo_server:27017/cura_nosql_db?authSource=admin

# RabbitMQ
RABBITMQ_HOST=rabbitmq_c            # matches the container name
BOOKINGSERVICE_RABBITMQ_MAINQUEUE=  # queue name shared with BookingService

# Nodemailer (SMTP credentials)
USER=
PASSWORD=

# Password hashing
SALT_ROUND=

# JWT secrets — generate with: openssl rand -hex 64
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
```

#### Generating JWT Secrets

```bash
openssl rand -hex 64
```

Run this twice — once for `ACCESS_TOKEN_SECRET` and once for `REFRESH_TOKEN_SECRET`.

### 3. Start All Containers

```bash
docker compose up --build
```

| Service                    | Host Port | Notes                              |
| -------------------------- | --------- | ---------------------------------- |
| **Server**                 | `8080`    | Main API — `http://localhost:8080` |
| **MySQL**                  | `3307`    | Mapped from container port `3306`  |
| **MongoDB**                | `27018`   | Mapped from container port `27017` |
| **RabbitMQ Broker**        | `5672`    | AMQP port                          |
| **RabbitMQ Management UI** | `15672`   | `http://localhost:15672`           |

> **Note:** The `BookingService` and `MailingAndNotificationService` have no exposed host port — they communicate exclusively through RabbitMQ and are not directly accessible.

---

## CI/CD

Cura uses **CircleCI** for continuous integration and deployment. The pipeline runs on every push and covers:

- Dependency installation
- Linting and testing
- Docker image build and push
- Deployment

---
