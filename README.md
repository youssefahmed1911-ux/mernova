# Mernova

**Course:** Electronic Business Development (BINF 503) · Winter 2026
**Instructor:** Dr. Nourhan Hamdi
**Teaching Assistants:** Mr. Nour Gaser, Mr. Omar Alaa, Ms. Mariam Khalid, Mr. Younes Zied, Mr. Mahmoud Hani

## 1. Team

| Name | Student ID | Tutorial group | GitHub username |
|---|---|---|---|
| Hamza Mohamed | 16008275 | T5 | hamza24younis10 |
| Youssef Shaaban | 16010089 | T5 | youssefahmed1911-ux |
| Adam Mohamed | 16008987 | T5 | adammohamed2006 |
| Amro Rafik | 16007308 | T5 | errortrail99-del |
| Seif El-Islam Waleed | 16010123 | T5 | SeifElaraby |
| Ahmed Elnady | 16008786 | T4 | aelnady2026 |

## 2. The idea

Mernova is a web application that brings the mechanic to the car owner instead of the other way around. Getting a car fixed usually means driving to a workshop, waiting, and losing a large part of the day, which many busy car owners cannot afford. On Mernova, clients find a mechanic who serves their area, describe the problem, and request a home visit at a time that suits them. On the other side, freelance mechanics and workshop mechanics looking for extra work get a steady source of jobs near them, set their own services and rates, and build a reputation through client reviews.

## 3. Features

### 3.1 The full product

- Registration and login for two types of users: clients and mechanics
- Mechanic profiles with services offered, areas served, hourly rate, experience and availability
- Search and filter mechanics by area, service and rating
- Client garage: save the details of one or more cars
- Request a home visit: choose a mechanic, a car, describe the problem, and set an address and time
- Mechanics accept or reject requests and update the job status until it is completed
- Clients cancel a request before the mechanic accepts it
- Ratings and reviews of mechanics after a completed job
- Request history for clients and job history for mechanics
- In-app chat between client and mechanic
- Live tracking of the mechanic on the way to the client
- Online payment and in-app price quotes
- Photo upload of the car problem
- Emergency roadside assistance requests
- Spare parts ordering through partner suppliers
- Mechanic identity and qualification verification by an admin
- Admin dashboard to manage users, requests and reported reviews
- Notifications by email and SMS when a request changes status

### 3.2 The use cases we will build

| # | Use case | What the user does | What they see | What is stored |
|---|---|---|---|---|
| 1 | Registration and login | Registers with name, email, password, phone and role (client or mechanic); logs in with email and password | Their home page, with their name in the header; clients see the client home and mechanics see the mechanic home | A User, with the password hashed and the role saved |
| 2 | Mechanic manages their profile | A mechanic creates their profile (services, areas served, hourly rate, years of experience, short bio), edits it later, and switches their availability on or off | Their public profile as clients will see it, with the updated details and availability | A MechanicProfile linked to the User, created and then updated |
| 3 | Client manages their cars | A client adds a car (make, model, year, plate number, colour), edits its details or deletes it | Their "My cars" page with the updated list of cars | A Vehicle linked to the client, created, updated or deleted |
| 4 | Client requests a home visit | A client browses available mechanics filtered by area and service, opens a mechanic's profile, picks one of their cars, describes the problem, and enters an address and preferred date and time; they can cancel the request while it is still pending | A confirmation, then the request in their "My requests" page with status "pending" (or "cancelled") | A ServiceRequest linking client, mechanic and vehicle, with status "pending"; updated to "cancelled" on cancel |
| 5 | Mechanic handles requests | A mechanic opens their incoming requests, accepts or rejects each one with an optional note, then updates an accepted job to "on the way" and finally "completed" | Their jobs list with each request's current status; the client sees the same status in "My requests" | The ServiceRequest's status and mechanic note, updated at each step |
| 6 | Client reviews a mechanic | After a job is completed, the client rates the mechanic from 1 to 5 with a comment; they can edit or delete their own review | The review on the mechanic's profile, with the mechanic's updated average rating | A Review linked to the request, client and mechanic; the mechanic's average rating and review count updated in their MechanicProfile |

## 4. Who owns what

| Member | Use case |
|---|---|
| Youssef Shaaban | 1. Registration and login |
| Hamza Mohamed | 2. Mechanic manages their profile |
| Ahmed Elnady | 3. Client manages their cars |
| Seif El-Islam Waleed | 4. Client requests a home visit |
| Adam Mohamed | 5. Mechanic handles requests |
| Amro Rafik | 6. Client reviews a mechanic |

## 5. Data model

### User

```js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // stored hashed, never as plain text
  phone: { type: String, required: true },
  role: { type: String, enum: ['client', 'mechanic'], required: true },
});
```

### MechanicProfile

```js
const mechanicProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String },
  services: [{ type: String }], // e.g. "Oil change", "Battery", "Brakes", "Diagnostics"
  serviceAreas: [{ type: String }], // e.g. "Nasr City", "New Cairo", "Maadi"
  hourlyRate: { type: Number, required: true, min: 0 }, // in EGP
  yearsOfExperience: { type: Number, min: 0, default: 0 },
  isAvailable: { type: Boolean, default: true },
  averageRating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, min: 0, default: 0 },
}, { timestamps: true });
```

### Vehicle

```js
const vehicleSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  make: { type: String, required: true }, // e.g. "Hyundai"
  model: { type: String, required: true }, // e.g. "Elantra"
  year: { type: Number, required: true },
  plateNumber: { type: String, required: true },
  color: { type: String },
}, { timestamps: true });
```

### ServiceRequest

```js
const serviceRequestSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  service: { type: String, required: true }, // one of the mechanic's services
  problemDescription: { type: String, required: true },
  address: { type: String, required: true },
  area: { type: String, required: true },
  preferredDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'on_the_way', 'completed', 'cancelled'],
    default: 'pending',
  },
  mechanicNote: { type: String },
}, { timestamps: true });
```

### Review

```js
const reviewSchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest', required: true, unique: true }, // one review per job
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
}, { timestamps: true });
```

## 6. Run it locally

> Leave this section as it is until Submission 2 (Thursday 10 December 2026,
> 23:59). Then fill it in: we follow these steps to run your project.

### Back end

```bash
cd backend
npm install
# create backend/.env from backend/.env.example (see the table below)
npm start
```

The API runs on http://localhost:3000.

| Variable in `.env` | What it is |
|---|---|
| `MONGODB_URI` | The connection string of your MongoDB Atlas database |
| `JWT_SECRET` | Any long random text, used to sign login tokens |
| [Any other variable] | [What it is] |

### Front end

```bash
cd frontend
npm install
npm run dev
```

The app runs on [the address `npm run dev` prints, e.g. http://localhost:5173].
