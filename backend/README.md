# Task Management Board - Backend

Flask REST API backend for the Task Management Board application.

## Setup Instructions

### 1. Install PostgreSQL

Make sure PostgreSQL is installed and running on your system.

### 2. Create Database

```bash
sudo -u postgres psql
CREATE DATABASE task_management;
CREATE USER taskuser WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE task_management TO taskuser;
\q
```

### 3. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 4. Configure Environment

Copy the example environment file and update with your settings:

```bash
cp .env.example .env
```

Edit `.env` and set:
- `SECRET_KEY`: A random secret key for Flask
- `JWT_SECRET_KEY`: A random secret key for JWT tokens
- `DATABASE_URL`: Your PostgreSQL connection string

Example:
```
DATABASE_URL=postgresql://taskuser:your_password@localhost/task_management
```

### 5. Run the Application

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (requires auth)

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/<id>` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/<id>` - Update task
- `DELETE /api/tasks/<id>` - Delete task
- `PATCH /api/tasks/<id>/status` - Update task status (for drag-and-drop)

### Users
- `GET /api/users` - Get all users (for assignment dropdown)
- `GET /api/users/<id>` - Get specific user

## Database Schema

### Users Table
- id (primary key)
- username (unique)
- password_hash
- email (unique)
- full_name
- created_at

### Tasks Table
- id (primary key)
- title
- description
- status (backlog, todo, in_progress, done)
- priority (low, medium, high)
- due_date
- assigned_to (foreign key to users)
- created_by (foreign key to users)
- created_at
- updated_at

## Testing

You can test the API using curl or Postman:

```bash
# Health check
curl http://localhost:5000/api/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123","email":"admin@example.com","full_name":"Admin User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```
