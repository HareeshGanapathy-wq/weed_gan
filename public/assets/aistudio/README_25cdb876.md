# WEED.AI — AI-Based Weed Detection and Weed Density Mapping (Frontend)

## 1. Overview
Frontend-only research prototype. Upload a field image, view weed detections, density statistics and a field density map. No ML model or backend is included; every API call falls back to mock data and the UI shows a "Demo mode" notice.

## 2. Features
Dashboard, Weed Detection (upload, preview, simulated detection, PNG download), Density Map (Leaflet), Analysis charts, History (search and filters), Settings (saved in localStorage).

## 3. Stack
React 18, Vite, TypeScript, Tailwind CSS 3, Lucide React, Recharts, Leaflet / React-Leaflet, React Router (hash routing).

## 4. Structure
    src/components/{Layout,common,Dashboard,Detection,DensityMap,Analysis}
    src/pages/             one file per page
    src/services/          api.ts (all backend calls), useApi.ts
    src/data/mockData.ts   mock data
    src/types/index.ts     API response types

## 5-6. Install and run
    npm install
    npm run dev

## 7. Environment variables
Copy `.env.example` to `.env`: `VITE_API_BASE_URL=http://localhost:8000`. The Settings page can override this in the browser.

## 8. Connecting the Python backend
Run FastAPI/Flask on the base URL and enable CORS for `http://localhost:5173`. The frontend calls your endpoints first and falls back to mock data only if the request fails or times out (4 s). Edit `src/services/api.ts` only. Your model output goes in the `/api/detect` response.

## 9. Endpoints
| Method | Path | Purpose |
|---|---|---|
| POST | /api/detect | multipart field `image` |
| GET | /api/history | history records |
| GET | /api/density/{field_id} | density map |
| GET | /api/analysis/{field_id} | analysis data |
| GET | /api/fields | field list |

## 10. Response formats (see `src/types/index.ts`)
`/api/detect`:

    {"image_url":"...","image_width":640,"image_height":480,"total_weeds":42,"average_confidence":0.946,"processing_time":1.82,
     "detections":[{"class":"weed","confidence":0.962,"bbox":[120,85,166,157]}]}

`bbox` is `[x1, y1, x2, y2]` in pixels of the original image. `image_width` and `image_height` are required so boxes scale correctly.

`/api/density/{id}`:

    {"field_id":"field_a","area_hectares":2.4,"total_weeds":4286,"average_density":18.4,"max_density":37.8,"min_density":4.2,
     "points":[{"lat":10.123,"lng":76.123,"density":21.5}]}
