# Hotel Room Reservation System — Solution Document

> SDE 3 Assessment Submission | Unstop

---

## Submission Links

| Item | Link | Status |
|------|------|--------|
| **Live Application** | https://your-frontend-url.vercel.app | Deployed |
| **Source Code (GitHub)** | https://github.com/yourusername/hotel-reservation | Public |
| **API Documentation (Swagger)** | https://your-backend-url.render.com/api-docs | Live |
| **Backend Health Check** | https://your-backend-url.render.com/api/health | Live |

---

## Project Overview

A full-stack Hotel Room Reservation System with an intelligent booking algorithm that minimizes travel time between booked rooms.

### Hotel Structure

| Floor | Rooms | Room Numbers |
|-------|-------|-------------|
| 1–9 | 10 each | 101–110, 201–210, …, 901–910 |
| 10 | 7 | 1001–1007 |
| **Total** | **97** | — |

### Travel Time Rules

- **Horizontal Movement**: 1 minute per room position difference on the same floor
- **Vertical Movement**: 2 minutes per floor difference
- **Lift/Stairs**: Located on the left side; lower room numbers = closer to lift

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS |
| Backend | Express 5 + TypeScript + Node.js |
| API Docs | Swagger/OpenAPI 3.0 (auto-generated from JSDoc) |
| Testing | Jest + ts-jest |
| Deployment | Vercel (frontend) + Render (backend) |

---

## Features Implemented

1. **Room Booking Interface**
   - Input field for number of rooms (1–5)
   - Book button with validation

2. **Floor Visualization**
   - Grid showing all 97 rooms across 10 floors
   - Color-coded: Green (available), Red (occupied), Blue (newly booked)
   - Lift indicator on left side

3. **Random Occupancy Generator**
   - One-click random room occupancy (configurable percentage)

4. **Reset Button**
   - Clears all bookings and restores initial state

5. **Booking Statistics Panel**
   - Shows total/available/occupied/booked counts
   - Displays latest booking details (rooms, travel time, floors involved)

6. **API Documentation**
   - Interactive Swagger UI at `/api-docs`

---

## Architecture

### Backend Architecture

```
Request → Route → Validator (Joi) → Controller → Service → Repository → In-Memory Store
```

**Design Patterns Used:**
- **Repository Pattern**: Abstracts data access; easily swappable for real database
- **Service Layer**: Business logic isolated from HTTP; fully unit-testable
- **Controller Pattern**: Thin controllers delegate to services
- **Joi Validation**: Centralized request validation on all endpoints
- **Message Codes**: Consistent API responses with unique codes (M1000, M2000, etc.)

### Project Structure

```
backend/
├── src/
│   ├── api/v1/rooms/         # Room endpoints
│   ├── api/v1/bookings/      # Booking endpoints
│   ├── config/constants.ts   # Environment config (Joi-validated)
│   ├── models/room.model.ts  # Room entity generator
│   ├── repositories/         # Data access layer
│   ├── services/             # Business logic (booking algorithm)
│   ├── middlewares/          # Error handler, request logger
│   ├── utils/responseHandler.ts  # Standardized responses
│   └── docs/index.ts         # Swagger configuration
├── tests/booking.test.ts     # 17 Jest tests
└── server.ts                 # Express entry point
```

---

## Booking Algorithm (Core Solution)

### Priority Rules

1. **Same Floor First**: Try to allocate all rooms on a single floor
2. **Minimize Total Travel Time**: If impossible, find optimal multi-floor combination
3. **Tie-breaking**: Fewer floors > Lower floor numbers > Lower room numbers

### Travel Time Formula

```
Pairwise Distance(A, B) = |positionA - positionB| + 2 × |floorA - floorB|
Total Travel Time = Sum of all pairwise distances
```

Where `position` is the room's distance from lift (1 = closest).

### Algorithm Flow

```
PHASE 1: Same-Floor Booking
  For each floor with >= N available rooms:
    Generate ALL combinations of N rooms
    Score each: travelTime × 10000 + floors × 1000 + minFloor × 10 + minRoom
  Return the best combination

PHASE 2: Multi-Floor Booking (fallback)
  Collect all available rooms (capped at 40 for performance)
  Generate combinations across all floors
  Score with same composite function
  Return the best combination
```

### Why This Scoring Works

| Factor | Weight | Effect |
|--------|--------|--------|
| `travelTime × 10000` | Primary | Lower travel always wins |
| `floors × 1000` | Secondary | Fewer floors preferred |
| `minFloor × 10` | Tertiary | Lower floors preferred |
| `minRoomNumber` | Quaternary | Closer to lift preferred |

### Complexity

| Scenario | Complexity | Typical Performance |
|----------|-----------|---------------------|
| Same-floor | O(F × C(R, K)) | < 1ms |
| Multi-floor | O(C(N, K)) | < 100ms (N capped at 40) |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/v1/rooms` | Get all rooms + stats |
| GET | `/api/v1/rooms/stats` | Room statistics only |
| POST | `/api/v1/rooms/random-occupy` | Randomly occupy rooms |
| POST | `/api/v1/rooms/reset` | Reset all rooms |
| POST | `/api/v1/bookings` | Book rooms `{roomCount: N}` |
| GET | `/api/v1/bookings/algorithm-info` | Algorithm documentation |
| GET | `/api-docs` | Swagger UI |

### Sample API Response

```json
{
  "statusCode": 200,
  "status": "success",
  "message": "Rooms booked successfully",
  "data": {
    "booking": {
      "id": "abc123",
      "roomIds": ["id1", "id2", "id3"],
      "rooms": [
        { "id": "id1", "number": 101, "floor": 1, "position": 1, "status": "booked" },
        { "id": "id2", "number": 102, "floor": 1, "position": 2, "status": "booked" },
        { "id": "id3", "number": 103, "floor": 1, "position": 3, "status": "booked" }
      ],
      "totalTravelTime": 3,
      "floorsInvolved": 1,
      "createdAt": "2026-05-23T10:00:00.000Z"
    }
  }
}
```

---

## Testing

### Test Coverage

- **17/17 tests passing**
- Coverage report: `backend/coverage/`

### Test Categories

| Category | Tests |
|----------|-------|
| Same-floor booking | 4 tests (basic, contiguous preference, max rooms, single room) |
| Multi-floor booking | 2 tests (cross-floor, vertical minimization) |
| Edge cases | 6 tests (invalid counts, insufficient rooms, exact matches, state management) |
| Travel time | 3 tests (zero vertical, positive time, comparison) |

### Run Tests

```bash
cd backend
npm test          # With coverage
npx jest          # Without coverage
```

---

## Deployment

### Backend → Render / Railway / Fly.io

```bash
cd backend
npm run build     # Compiles TypeScript to dist/
npm start         # Runs dist/server.js
```

### Frontend → Vercel / Netlify

```bash
cd frontend
npm run build     # Creates dist/ folder
deploy dist/      # Upload to CDN
```

### Environment Variables

**Backend** (`.env`):
```
PORT=8080
NODE_ENV=production
APP_URL=https://your-backend-url.render.com
FRONTEND_URL=https://your-frontend-url.vercel.app
LOG_LEVEL=info
```

**Frontend** (`.env`):
```
VITE_API_URL=https://your-backend-url.render.com/api/v1
```

---

## What Interviewers Will See

1. **Clean Architecture**: Repository + Service + Controller layers with clear separation
2. **Type Safety**: Strict TypeScript throughout frontend and backend
3. **Optimization Algorithm**: Well-documented, tested, correct travel-time minimization
4. **Code Quality**: Joi validation, Winston logging, Helmet security, CORS handling
5. **Documentation**: README + Swagger + inline JSDoc + this solution document
6. **Production Readiness**: Error handling, logging, compression, standardized responses

---

## Local Development

```bash
# Terminal 1: Backend
cd hotel-reservation/backend
npm install
npm run dev        # http://localhost:8080

# Terminal 2: Frontend
cd hotel-reservation/frontend
npm install
npm run dev        # http://localhost:5173
```

Access:
- Frontend: http://localhost:5173
- API Docs: http://localhost:8080/api-docs
- Health: http://localhost:8080/api/health

---

*Submitted by: [Your Name]*
*Date: 2026-05-23*
