# RUDA Project - Comprehensive Overview

## 🏗️ Project Overview

**RUDA** stands for **Ravi Urban Development Authority** - a comprehensive web-based planning and management system for urban development projects in Lahore, Pakistan. This is a full-stack application designed to visualize, manage, and track development projects, land availability, and project progress.

---

## 📁 Project Structure

### **Backend** (Django REST Framework)
```
Backend/
├── api/                    # Main API application
│   ├── models.py          # Database models (currently empty)
│   ├── views.py           # API views (currently empty)
│   ├── serializers.py     # DRF serializers
│   ├── urls.py            # API endpoints
│   └── utils.py           # Utility functions
├── server/                 # Django project settings
│   ├── settings/
│   │   ├── base.py        # Base settings
│   │   ├── local.py       # Local development settings
│   │   └── production.py  # Production settings
│   ├── urls.py            # Main URL configuration
│   └── wsgi.py            # WSGI configuration
└── db.sqlite3             # SQLite database
```

**Backend Technologies:**
- Django 5.2.8
- Django REST Framework
- Django GIS (for geospatial data)
- CORS headers for cross-origin requests
- SQLite database (can be configured for PostgreSQL/PostGIS)

### **Frontend** (React + Vite)
```
Frontend/
├── src/
│   ├── pages/
│   │   ├── Auth/          # Authentication (Login, Register, Protected Routes)
│   │   ├── Dashboard/     # Main dashboard with map and statistics
│   │   ├── RTWMap/        # Right to Way (RTW) Map visualization
│   │   ├── Portfolio/     # Project portfolio management
│   │   ├── Gantt/         # Gantt charts and timeline views
│   │   ├── Summary/       # Project summaries and milestones
│   │   └── CRUD/          # GeoData management interface
│   ├── components/        # Reusable components (Layout, Navbar, Sidebar)
│   ├── Routes.jsx         # Application routing
│   └── App.jsx            # Main application component
├── public/
│   ├── geojson/           # GeoJSON files for map layers
│   └── [assets]           # Images, logos, icons
└── package.json           # Dependencies
```

**Frontend Technologies:**
- React 19.2.0
- Vite 7.2.4 (build tool)
- Material-UI (MUI) 7.3.6
- Mapbox GL JS 3.17.0 (for interactive maps)
- Leaflet 1.9.4 (alternative mapping library)
- Recharts 3.6.0 (for charts and graphs)
- Turf.js (@turf/turf) 7.3.1 (geospatial calculations)
- React Router DOM 7.11.0
- Axios 1.13.2 (HTTP client)

---

## 🎯 Core Features

### 1. **Dashboard** (`/`)
- **Interactive Map**: Mapbox-based map showing project locations
- **Layer Management**: Toggle visibility of different project layers
- **Statistics Panel**: RUDA statistics with project progress
- **Sidebar Filters**: Filter by phases, packages, categories, and projects
- **Popups**: Click on map features to see project details
- **Color Coding**: Customizable colors for different project layers

### 2. **RTW Map** (`/map`, `/details/:name`)
- **Right to Way Analysis**: Visualize available vs unavailable land
- **Area Calculations**: Real-time calculation of available/unavailable acres
- **Interactive Sidebars**:
  - **Left Sidebar**: Pie charts showing land distribution, statistics cards, available polygons list
  - **Right Sidebar**: Project list with category filtering
- **Layer Toggles**: Show/hide RTW layers and available land layers
- **Project Filtering**: Filter projects by category

### 3. **Portfolio Management** (`/portfolio`)
- **Project Metrics**: Visual cards showing key project metrics
- **Progress Tracking**: Progress bars for different project categories
- **Charts**: Pie charts and bar charts for data visualization
- **PDF Export**: Export portfolio data as PDF
- **Priority Projects**: Display priority project information
- **Integration**: Links to hierarchical Gantt charts

### 4. **Gantt Charts & Timelines**
- **RUDA Development Plan** (`/gantt`): Main development timeline
- **Phase 2 Gantt Chart** (`/phase2-gantt`): Phase 2 specific timeline
- **Hierarchical Gantt** (`/hierarchical-gantt`): Nested project structure
- **Features**:
  - Project phases and packages
  - Duration tracking
  - Performance metrics
  - Planned vs earned value
  - Schedule visualization

### 5. **Project Summary & Milestones**
- **Overall Summary** (`/overall-summary`): High-level project overview
- **Ongoing Projects** (`/ongoing-projects`): Active project tracking
- **Progress Updates** (`/progress-update`): Progress update interface
- **Project Milestones** (`/milestones`): Milestone tracking

### 6. **GeoData Management** (`/crud`)
- **CRUD Operations**: Create, Read, Update, Delete geospatial data
- **GeoJSON Management**: Upload and manage GeoJSON files
- **Data Visualization**: View and edit geographic features

### 7. **Authentication**
- **Login** (`/login`): User authentication
- **Register** (`/register`): User registration
- **Protected Routes**: All main features require authentication

---

## 🗺️ Map Data & Layers

The application uses **GeoJSON** files stored in `Frontend/public/geojson/`:

- **Charhar Bhag**: Development area
- **CB Enclave**: Enclave project
- **Access Road**: Road infrastructure
- **M2 Toll Plaza**: Toll plaza location
- **Development at Jhoke**: 158 acres development
- **Lahore**: City boundary
- **Sheikhupura**: Regional boundary
- **River**: River boundaries
- **Points**: Point features

**Main GeoJSON Files:**
- `rtw2.geojson`: Right to Way data
- `Final.geojson`: Final project boundaries
- `River.geojson`: River boundaries

---

## 🔌 API Integration

The frontend connects to a backend API:
- **Base URL**: `https://ruda-planning.onrender.com/api/`
- **Endpoints**:
  - `/api/all` - Get all features
  - `/api/portfoliocrud/` - Portfolio CRUD operations

**Note**: The backend is currently minimal (empty models/views), suggesting the API might be hosted separately or the backend is in early development.

---

## 🎨 UI/UX Features

### Design System
- **Material-UI**: Primary component library
- **Dark Theme**: Dark color scheme for maps and dashboards
- **Responsive Design**: Works on desktop and mobile
- **Custom Styling**: Inline styles and CSS modules

### Key UI Components
- **Sidebars**: Collapsible sidebars for filters and information
- **Cards**: Information cards with statistics
- **Charts**: Pie charts, bar charts for data visualization
- **Tables**: Data tables for project listings
- **Popups**: Interactive popups on map clicks
- **Modals**: Dialog boxes for detailed views

---

## 🚀 Getting Started

### Prerequisites
- Node.js (for frontend)
- Python 3.x (for backend)
- Mapbox Access Token (for map functionality)

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev  # Starts Vite dev server on http://localhost:5173
```

### Backend Setup
```bash
cd Backend
pip install -r requirements.txt  # (if requirements.txt exists)
python manage.py migrate
python manage.py runserver  # Starts Django server on http://localhost:8000
```

### Environment Variables
Create `.env` file in Frontend directory:
```
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

---

## 📊 Key Functionalities

### 1. **Land Availability Analysis**
- Calculate available vs unavailable land
- Visual representation with pie charts
- Real-time area calculations using Turf.js
- Filter by project categories

### 2. **Project Tracking**
- Track project phases and packages
- Monitor progress with Gantt charts
- View project statistics and metrics
- Export data as PDF

### 3. **Geospatial Operations**
- Load and display GeoJSON layers
- Calculate areas and distances
- Intersect features
- Buffer operations

### 4. **Data Visualization**
- Interactive maps with Mapbox
- Charts with Recharts
- Progress indicators
- Statistical summaries

---

## 🔐 Security & Authentication

- **Protected Routes**: All main features require authentication
- **Login/Register**: User authentication system
- **CORS**: Configured for cross-origin requests
- **Environment Variables**: Sensitive data stored in environment variables

---

## 📈 Project Status

### Current State
- ✅ Frontend fully functional
- ✅ Map visualization working
- ✅ Dashboard with statistics
- ✅ RTW analysis features
- ✅ Portfolio management
- ✅ Gantt charts
- ⚠️ Backend API minimal (models/views empty)
- ⚠️ Some features may depend on external API

### Development Areas
- Backend API implementation
- Database models for projects
- User management system
- Data persistence
- API endpoints for CRUD operations

---

## 🛠️ Technology Stack Summary

| Category | Technology |
|----------|-----------|
| **Frontend Framework** | React 19.2.0 |
| **Build Tool** | Vite 7.2.4 |
| **UI Library** | Material-UI 7.3.6 |
| **Mapping** | Mapbox GL JS 3.17.0, Leaflet 1.9.4 |
| **Charts** | Recharts 3.6.0 |
| **Geospatial** | Turf.js 7.3.1 |
| **Routing** | React Router DOM 7.11.0 |
| **HTTP Client** | Axios 1.13.2 |
| **Backend Framework** | Django 5.2.8 |
| **API** | Django REST Framework |
| **Database** | SQLite (configurable) |
| **GIS** | Django GIS |

---

## 📝 Key Files to Understand

1. **`Frontend/src/Routes.jsx`**: All application routes
2. **`Frontend/src/pages/Dashboard/Dashboard.jsx`**: Main dashboard
3. **`Frontend/src/pages/RTWMap/RTWMap.jsx`**: RTW map implementation
4. **`Frontend/src/pages/RTWMap/RTWLeftSidebar.jsx`**: Land analysis sidebar
5. **`Frontend/src/pages/Portfolio/Portfolio.jsx`**: Portfolio management
6. **`Backend/server/settings/base.py`**: Django configuration

---

## 🎯 Use Cases

1. **Urban Planning**: Visualize and plan urban development projects
2. **Land Management**: Track available and unavailable land
3. **Project Monitoring**: Monitor project progress and milestones
4. **Data Analysis**: Analyze project statistics and metrics
5. **Reporting**: Generate reports and export data

---

## 🔄 Data Flow

1. **Frontend** loads GeoJSON files from `/public/geojson/`
2. **API calls** to `https://ruda-planning.onrender.com/api/` for dynamic data
3. **Mapbox** renders interactive maps with layers
4. **Turf.js** performs geospatial calculations
5. **Recharts** visualizes data in charts
6. **Material-UI** provides UI components

---

## 📌 Notes

- The project appears to be for **RUDA (Ravi Urban Development Authority)** in Lahore, Pakistan
- Focus on **land development**, **project tracking**, and **geospatial visualization**
- Backend is minimal - most functionality is frontend-based
- Uses external API for some data (hosted on Render)
- Mapbox token required for map functionality
- GeoJSON files contain actual project boundaries and features

---

This is a comprehensive urban development planning and management system with strong emphasis on geospatial visualization and project tracking capabilities.

