# PromptLab - Technical Documentation

## Architecture Overview

PromptLab is a full-stack web application built with a React frontend and Flask backend, designed to provide a comprehensive workspace for prompt engineering.

### Technology Stack

#### Frontend
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: High-quality React component library
- **Lucide React**: Icon library
- **React Router**: Client-side routing

#### Backend
- **Flask**: Python web framework
- **SQLAlchemy**: ORM for database operations
- **Flask-CORS**: Cross-origin resource sharing
- **SQLite**: Lightweight database

### Project Structure

```
promptlab-backend/
├── src/
│   ├── main.py              # Flask application entry point
│   ├── models/              # Database models
│   │   ├── user.py         # User model
│   │   └── prompt.py       # Prompt and category models
│   ├── routes/             # API endpoints
│   │   ├── prompt.py       # Prompt CRUD operations
│   │   ├── category.py     # Category management
│   │   └── test.py         # Testing functionality
│   └── static/             # Built frontend files
├── requirements.txt        # Python dependencies
└── venv/                  # Virtual environment

promptlab-frontend/
├── src/
│   ├── App.jsx            # Main application component
│   ├── components/        # React components
│   │   ├── Header.jsx     # Application header
│   │   ├── Sidebar.jsx    # Navigation sidebar
│   │   ├── PromptList.jsx # Prompt listing
│   │   ├── PromptEditor.jsx # Prompt editor
│   │   ├── CommandPalette.jsx # Command palette
│   │   ├── Analytics.jsx  # Analytics dashboard
│   │   ├── Settings.jsx   # Settings page
│   │   └── TestingWorkbench.jsx # Testing interface
│   └── components/ui/     # UI components from Shadcn
├── package.json           # Node.js dependencies
└── dist/                 # Built files
```

### Database Schema

#### Prompts Table
```sql
CREATE TABLE prompts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    category_id INTEGER,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_template BOOLEAN DEFAULT FALSE,
    tags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES categories (id)
);
```

#### Categories Table
```sql
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints

#### Prompt Management
- `GET /api/prompts` - List all prompts
- `POST /api/prompts` - Create new prompt
- `GET /api/prompts/<id>` - Get specific prompt
- `PUT /api/prompts/<id>` - Update prompt
- `DELETE /api/prompts/<id>` - Delete prompt

#### Category Management
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create new category
- `GET /api/categories/<id>` - Get specific category
- `PUT /api/categories/<id>` - Update category
- `DELETE /api/categories/<id>` - Delete category

#### Testing (Future)
- `POST /api/test/run` - Run prompt test
- `GET /api/test/results/<id>` - Get test results
- `POST /api/test/batch` - Run batch tests

### Component Architecture

#### Main Components

1. **App.jsx**: Root component with routing and state management
2. **Header.jsx**: Top navigation with search and command palette trigger
3. **Sidebar.jsx**: Left navigation with prompt list and filters
4. **PromptEditor.jsx**: Rich text editor for prompt creation/editing
5. **CommandPalette.jsx**: Quick search and navigation modal
6. **Analytics.jsx**: Dashboard with metrics and charts
7. **Settings.jsx**: Configuration and category management

#### State Management

The application uses React's built-in state management with hooks:
- `useState` for component-level state
- `useEffect` for side effects and API calls
- Props for data passing between components

#### Routing

React Router handles client-side navigation:
- `/` - Main prompts view
- `/testing` - Testing workbench
- `/analytics` - Analytics dashboard
- `/settings` - Settings and configuration

### Key Features Implementation

#### Command Palette
- Triggered by `Ctrl+K` keyboard shortcut
- Uses React Portal for modal rendering
- Implements fuzzy search across prompts
- Keyboard navigation with arrow keys

#### Search and Filtering
- Real-time search as user types
- Filter by favorites, categories, and tags
- Debounced search to prevent excessive API calls

#### Responsive Design
- Mobile-first approach with Tailwind CSS
- Responsive grid layouts
- Touch-friendly interface elements
- Collapsible sidebar on mobile

### Development Setup

#### Prerequisites
- Node.js 18+ and pnpm
- Python 3.11+ and pip
- Git

#### Backend Setup
```bash
cd promptlab-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python src/main.py
```

#### Frontend Setup
```bash
cd promptlab-frontend
pnpm install
pnpm run dev
```

#### Building for Production
```bash
# Build frontend
cd promptlab-frontend
pnpm run build

# Copy to Flask static directory
cp -r dist/* ../promptlab-backend/src/static/

# Deploy with Manus
cd ../promptlab-backend
# Use Manus deployment tools
```

### Security Considerations

#### CORS Configuration
- Configured to allow cross-origin requests
- Should be restricted in production environments

#### Input Validation
- Server-side validation for all API endpoints
- SQL injection prevention through SQLAlchemy ORM
- XSS prevention through proper data sanitization

#### Authentication (Future)
- JWT-based authentication planned
- User session management
- Role-based access control

### Performance Optimizations

#### Frontend
- Code splitting with React.lazy (future enhancement)
- Image optimization and lazy loading
- Debounced search to reduce API calls
- Efficient re-rendering with React.memo

#### Backend
- Database indexing on frequently queried fields
- Pagination for large datasets
- Caching for static data
- Connection pooling for database

### Testing Strategy

#### Frontend Testing
- Unit tests with Jest and React Testing Library
- Component testing for UI interactions
- E2E testing with Playwright (future)

#### Backend Testing
- Unit tests with pytest
- API endpoint testing
- Database integration tests
- Performance testing

### Deployment

#### Production Deployment
- Built with Manus deployment platform
- Automatic HTTPS and CDN
- Environment variable configuration
- Health checks and monitoring

#### Environment Variables
```bash
FLASK_ENV=production
DATABASE_URL=sqlite:///promptlab.db
SECRET_KEY=your-secret-key
CORS_ORIGINS=https://your-domain.com
```

### Future Enhancements

#### Planned Features
1. **Advanced Testing Workbench**
   - Multi-model AI testing
   - Batch testing capabilities
   - Performance analytics

2. **Collaboration Features**
   - Team workspaces
   - Prompt sharing
   - Comment system

3. **Integration Capabilities**
   - Git/GitHub integration
   - Cloud storage sync
   - API integrations

4. **Advanced Analytics**
   - Usage tracking
   - Performance metrics
   - A/B testing for prompts

#### Technical Improvements
- WebSocket support for real-time updates
- Progressive Web App (PWA) capabilities
- Offline functionality
- Advanced caching strategies

### Contributing

#### Code Style
- ESLint and Prettier for JavaScript/React
- Black and flake8 for Python
- Conventional commits for git messages

#### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit pull request with description

### License

This project is built using the Manus AI Development Platform and follows the platform's licensing terms.

---

**For technical support or questions, visit: https://help.manus.im**

