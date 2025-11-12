# Task Management Board

A full-stack task management application with a Trello-like kanban board interface. Built for the Tech/Production team to organize work tasks and track progress.

## Features

- **Drag & Drop Kanban Board** - 4 columns: Backlog, To Do, In Progress, Done
- **Task Management** - Create, edit, delete, and assign tasks
- **Priority Levels** - Low, Medium, High priority indicators
- **Due Dates** - Set and track task deadlines
- **User Assignment** - Assign tasks to team members
- **Authentication** - Secure login/register system
- **Responsive Design** - Works on desktop and mobile

## Tech Stack

### Backend
- Python/Flask
- PostgreSQL
- SQLAlchemy ORM
- Flask-JWT-Extended for authentication
- Flask-CORS

### Frontend
- React
- react-beautiful-dnd (drag and drop)
- Axios (API calls)
- date-fns (date formatting)

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

### 1. Clone the Repository

```bash
cd Projects/task-management-board
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create PostgreSQL database
sudo -u postgres psql
CREATE DATABASE task_management;
CREATE USER taskuser WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE task_management TO taskuser;
\q

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run the backend
python app.py
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment (optional)
cp .env.example .env

# Run the development server
npm start
```

Frontend will open at `http://localhost:3000`

## Usage

1. **Register** - Create your first user account
2. **Login** - Sign in with your credentials
3. **Create Tasks** - Click "+ Create Task" to add new tasks
4. **Organize** - Drag and drop tasks between columns
5. **Assign** - Assign tasks to team members
6. **Track** - Monitor progress across the board

## Project Structure

```
task-management-board/
├── backend/
│   ├── app.py              # Flask application
│   ├── models.py           # Database models
│   ├── config.py           # Configuration
│   ├── routes/             # API endpoints
│   │   ├── auth.py         # Authentication routes
│   │   ├── tasks.py        # Task CRUD routes
│   │   └── users.py        # User routes
│   ├── requirements.txt    # Python dependencies
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── KanbanBoard.js
│   │   │   ├── TaskCard.js
│   │   │   ├── TaskModal.js
│   │   │   └── Login.js
│   │   ├── services/       # API and auth services
│   │   │   ├── api.js
│   │   │   └── AuthContext.js
│   │   ├── styles/         # CSS styles
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
└── README.md               # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/<id>` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/<id>` - Update task
- `DELETE /api/tasks/<id>` - Delete task
- `PATCH /api/tasks/<id>/status` - Update task status

### Users
- `GET /api/users` - Get all users
- `GET /api/users/<id>` - Get specific user

## Deployment to Raspberry Pi

### Backend Deployment

1. Copy backend files to Raspberry Pi
2. Install PostgreSQL on Pi
3. Install Python dependencies
4. Configure environment variables
5. Run with gunicorn for production:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend Deployment

**Option 1: Development Server**
```bash
npm start
```

**Option 2: Production Build with Nginx**
```bash
npm run build
sudo cp -r build/* /var/www/task-board/
# Configure nginx to serve static files
```

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/task-board;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Future Enhancements (Phase 2)

- [ ] Microsoft 365 OAuth integration
- [ ] Email notifications
- [ ] Teams/Outlook calendar integration
- [ ] Task comments and attachments
- [ ] Activity history/audit log
- [ ] Task filtering and search
- [ ] Custom board columns
- [ ] Task templates
- [ ] Reporting and analytics

## Next Steps

After this Task Management Board is complete, we'll build:
1. **Internal Events Board** - Ministry Platform integration for internal events
2. **External Events Board** - Ministry Platform integration for external events

## License

Internal use only - Tech/Production Team

## Support

For issues or questions, contact the Tech/Production team.
