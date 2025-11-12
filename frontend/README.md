# Task Management Board - Frontend

React frontend for the Task Management Board application with drag-and-drop kanban functionality.

## Features

- Drag-and-drop kanban board with 4 columns (Backlog, To Do, In Progress, Done)
- Create, edit, and delete tasks
- Assign tasks to team members
- Set task priority (Low, Medium, High)
- Set due dates
- User authentication (login/register)
- Responsive design

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

If your backend is running on a different host/port, update `.env`:

```
REACT_APP_API_URL=http://your-backend-url:5000/api
```

### 3. Run Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Usage

### First Time Setup

1. Start the backend server (see backend/README.md)
2. Open the frontend application
3. Click "Register" to create a new account
4. Login with your credentials

### Creating Tasks

1. Click the "+ Create Task" button
2. Fill in the task details:
   - Title (required)
   - Description
   - Status (Backlog, To Do, In Progress, Done)
   - Priority (Low, Medium, High)
   - Due Date
   - Assign To (select a team member)
3. Click "Save"

### Managing Tasks

- **Drag and Drop:** Click and drag tasks between columns to update their status
- **Edit:** Click on a task card to edit its details
- **Delete:** Open a task and click the "Delete" button

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── KanbanBoard.js    # Main board component
│   │   ├── TaskCard.js       # Individual task card
│   │   ├── TaskModal.js      # Create/edit task modal
│   │   └── Login.js          # Login/register page
│   ├── services/
│   │   ├── api.js            # API service layer
│   │   └── AuthContext.js    # Authentication context
│   ├── styles/
│   │   └── App.css           # Global styles
│   ├── App.js                # Main app component
│   └── index.js              # Entry point
└── package.json
```

## Technologies Used

- **React** - UI library
- **react-beautiful-dnd** - Drag and drop functionality
- **axios** - HTTP client
- **react-router-dom** - Routing
- **date-fns** - Date formatting

## Deployment to Raspberry Pi

### Option 1: Development Server

```bash
# Set the backend URL in .env
echo "REACT_APP_API_URL=http://your-pi-ip:5000/api" > .env

# Start the development server
npm start
```

### Option 2: Production Build with Nginx

```bash
# Build the app
npm run build

# Copy build folder to Raspberry Pi
scp -r build/ pi@your-pi-ip:/var/www/task-board

# Configure nginx to serve the static files
# See deployment documentation for nginx configuration
```

## Troubleshooting

### CORS Errors

Make sure the backend has CORS enabled (Flask-CORS is installed and configured in the backend).

### API Connection Issues

- Verify the backend is running
- Check the `REACT_APP_API_URL` in your `.env` file
- Check browser console for errors

### Drag and Drop Not Working

Make sure `react-beautiful-dnd` is properly installed:

```bash
npm install react-beautiful-dnd
```
