# RTWMap Directory - Files & Functionalities

## 📁 Directory Structure

```
Frontend/src/pages/RTWMap/
├── RTWMap.jsx              (18KB, 552 lines) - Main map component
├── DashboardRTW.jsx        (30KB, 905 lines) - Project detail dashboard
├── RTWLeftSidebar.jsx      (16KB, 478 lines) - Left sidebar with statistics
├── RTWRightSidebar.jsx     (22KB, 637 lines) - Right sidebar with layer controls
└── RTWProjectList.jsx      (2.4KB, 89 lines) - Project list component (unused)
```

---

## 📄 File Details & Functionalities

### 1. **RTWMap.jsx** - Main Map Component
**Purpose**: Core interactive map component for Right to Way (RTW) visualization

**Key Features**:
- ✅ Initializes Mapbox GL map with satellite imagery
- ✅ Loads project features from API (`https://ruda-planning.onrender.com/api/all`)
- ✅ Loads available land data from `/Final.geojson`
- ✅ Manages two layer types:
  - **Red layers**: Project boundaries (unavailable land)
  - **Green layers**: Available land (from Final.geojson)
- ✅ Handles project visibility toggling
- ✅ Calculates area statistics (available vs unavailable)
- ✅ Supports URL query parameters (`?selected=ProjectName`)
- ✅ Responsive design (embedded mode support)
- ✅ Click handlers for map popups showing area in acres

**State Management**:
- `loading`: Loading state
- `areaStats`: Calculated area statistics
- `layerVisibility`: Toggle states for RTW and available layers
- `showChart`: Left sidebar visibility
- `showToggle`: Right sidebar visibility
- `projectVisibility`: Map of project names to visibility states
- `selectedCategory`: Current category filter
- `projectFeatures`: Array of project GeoJSON features
- `allAvailableFeaturesRef`: Reference to available land features

**Key Functions**:
- `toggleLayer()`: Show/hide map layers
- `recalculateAreaStats()`: Calculate available/unavailable land areas
- `tryShowGreenLayer()`: Helper to display available land layer

**Props**:
- `isEmbedded`: Boolean for embedded mode
- `defaultFilter`: Default filter value for embedded mode

**Exports**: `RTWMap` (default)

---

### 2. **DashboardRTW.jsx** - Project Detail Dashboard
**Purpose**: Detailed project information dashboard with charts and statistics

**Key Features**:
- ✅ Fetches project data from API based on URL parameter (`/details/:name`)
- ✅ Displays comprehensive project information:
  - Project name, description, dates
  - Scope of work
  - Land status (pie chart)
  - Awarded cost and duration
  - Progress brief table
  - Physical progress chart
  - Financial progress chart
  - Firms information with avatars
  - Scope KPIs (bar chart)
  - Progress curve (line chart)
- ✅ Responsive design (Mobile and Desktop views)
- ✅ PDF export functionality
- ✅ Image handling for firm logos
- ✅ Error handling for missing projects

**State Management**:
- `data`: Project data object
- `loading`: Loading state
- `error`: Error message
- `theme`: Material-UI theme
- `isMobile`: Responsive breakpoint

**URL Parameter**: `name` (from route `/details/:name`)

**Key Components**:
- `MobileView`: Mobile-optimized layout
- `DesktopView`: Desktop layout with print support
- `SectionCard`: Reusable section container

**Exports**: `DashboardRTWExact` (default)

**Route**: `/details/:name`

---

### 3. **RTWLeftSidebar.jsx** - Statistics Sidebar
**Purpose**: Left sidebar displaying land area statistics and available polygons

**Key Features**:
- ✅ Pie chart showing Available vs Unavailable land distribution
- ✅ Statistics cards:
  - Total Project Area
  - Available Area (green)
  - Unavailable Area (red)
- ✅ List of available polygons with area in acres
- ✅ Collapsible sidebar (horizontal collapse)
- ✅ Responsive design (mobile and desktop)
- ✅ Scrollable content area
- ✅ Only shows when `areaStats` is available

**Props**:
- `areaStats`: Area statistics object
- `showChart`: Boolean for sidebar visibility
- `setShowChart`: Function to toggle sidebar
- `projectFeatures`: Array of project features
- `projectVisibility`: Map of project visibility states
- `allAvailableFeaturesRef`: Reference to available features
- `mapRef`: Mapbox map reference

**Key Calculations**:
- Available percentage: `(available / total) * 100`
- Unavailable percentage: `(unavailable / total) * 100`
- Polygon areas using Turf.js

**Exports**: `RTWLeftSidebar` (default)

---

### 4. **RTWRightSidebar.jsx** - Layer Control Sidebar
**Purpose**: Right sidebar for controlling map layers and project visibility

**Key Features**:
- ✅ Category filter dropdown:
  - Select Category (default)
  - Phases
  - Packages
  - Projects
  - Show All
  - Clear All
- ✅ "Toggle All" button for current category
- ✅ Available Land toggle switch
- ✅ Project list with visibility toggles
- ✅ Individual project visibility controls
- ✅ Auto-zoom to selected projects
- ✅ Auto-opens left sidebar when projects are shown
- ✅ Color-coded project indicators (red dots)
- ✅ Collapsible sidebar (horizontal collapse)
- ✅ Responsive design

**Props**:
- `showToggle`: Boolean for sidebar visibility
- `setShowToggle`: Function to toggle sidebar
- `selectedCategory`: Current category filter
- `setSelectedCategory`: Function to set category
- `projectVisibility`: Map of project visibility states
- `setProjectVisibility`: Function to update visibility
- `layerVisibility`: Map of layer visibility states
- `setLayerVisibility`: Function to update layer visibility
- `mapRef`: Mapbox map reference
- `toggleLayer`: Function to toggle map layers
- `recalculateAreaStats`: Function to recalculate statistics
- `allAvailableFeaturesRef`: Reference to available features
- `projectFeatures`: Array of project features
- `setShowChart`: Function to open left sidebar

**Key Functions**:
- `handleProjectClick()`: Zoom to project on map
- `handleProjectToggle()`: Toggle project visibility
- `handleCategoryChange()`: Filter by category
- `handleToggleAll()`: Toggle all projects in category
- `handleAvailableLandToggle()`: Toggle available land layer

**Exports**: `RTWRightSidebar` (default)

---

### 5. **RTWProjectList.jsx** - Project List Component
**Purpose**: Alternative project list component (currently UNUSED)

**Status**: ⚠️ **NOT USED** - Commented out in RTWMap.jsx (lines 518-526)

**Features**:
- Simple project list with checkboxes
- Category filtering
- Project visibility toggling
- Positioned at bottom-right of map

**Note**: This component is replaced by RTWRightSidebar which has more features.

**Exports**: `RTWProjectList` (default)

---

## 🔄 Component Relationships

```
RTWMap.jsx (Main)
├── RTWLeftSidebar.jsx (when !isEmbedded)
│   └── Shows statistics when areaStats exists
└── RTWRightSidebar.jsx (when !isEmbedded)
    └── Controls layers and project visibility

DashboardRTW.jsx (Separate Route)
└── Standalone dashboard for project details
```

---

## 🗺️ Data Flow

1. **RTWMap.jsx** loads:
   - Project features from API: `https://ruda-planning.onrender.com/api/all`
   - Available land from: `/Final.geojson`

2. **Project Visibility**:
   - User toggles projects in RTWRightSidebar
   - RTWMap updates map layers
   - RTWMap recalculates area statistics
   - RTWLeftSidebar displays updated statistics

3. **Area Calculations**:
   - Uses Turf.js for geospatial calculations
   - Converts square meters to acres (divide by 4046.8564224)
   - Calculates available vs unavailable land

4. **URL Navigation**:
   - `/map` → RTWMap component
   - `/map?selected=ProjectName` → RTWMap with pre-selected project
   - `/details/:name` → DashboardRTW component

---

## 🐛 **IDENTIFIED ISSUE**

### Navigation Problem at `/map` Route

**Problem**: In `Routes.jsx` line 4, there's an incorrect import:

```javascript
import RTWMap from "./pages/RTWMap/DashboardRTW";  // ❌ WRONG!
```

**Issue**:
- `DashboardRTW.jsx` exports `DashboardRTWExact` as default, NOT `RTWMap`
- This causes the `/map` route to fail or show wrong component

**Solution**: Change to:
```javascript
import RTWMap from "./pages/RTWMap/RTWMap";  // ✅ CORRECT
```

---

## 📊 Key Technologies Used

- **Mapbox GL JS**: Interactive mapping
- **Turf.js**: Geospatial calculations
- **Material-UI**: UI components
- **Recharts**: Charts and graphs
- **Axios**: HTTP requests
- **React Hooks**: State management

---

## 🎯 Use Cases

1. **View Map**: Navigate to `/map` to see interactive map
2. **Filter Projects**: Use right sidebar to filter by category
3. **View Statistics**: Toggle projects to see area statistics in left sidebar
4. **View Details**: Click project name to navigate to `/details/:name`
5. **URL Navigation**: Use `?selected=ProjectName` to pre-select project

---

## 🔧 Dependencies

All components depend on:
- Mapbox access token: `VITE_MAPBOX_TOKEN`
- API endpoint: `https://ruda-planning.onrender.com/api/all`
- GeoJSON file: `/Final.geojson` (in public folder)

