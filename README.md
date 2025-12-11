🏸 Acorn Globus — Sports Facility Court Booking Platform

A full-stack application for managing court bookings, equipment rental, coach scheduling, and dynamic pricing.


---

📌 Overview

This project is a complete end-to-end booking system designed for sports facilities.
Users can book badminton courts, rent equipment, and optionally hire a coach.
The platform handles multi-resource scheduling, conflict detection, and dynamic pricing based on rules configured by the admin.

This assignment demonstrates real-world backend architecture, database design, and frontend workflow.


---

🚀 Features

✔ 1. Multi-Resource Booking

A single booking can include:

Court (indoor/outdoor)

Equipment (rackets, shoes)

Coach (optional)


All resources undergo conflict checks before confirming a booking.


---

✔ 2. Availability Engine

The system ensures:

No overlapping bookings for courts

Equipment stock availability is respected

Coach availability & active status are validated



---

✔ 3. Dynamic Pricing Engine

Pricing rules are stored in the database (not hardcoded).
The final price is calculated by combining:

Rule Type	Example

Peak Hour Multiplier	6 PM – 9 PM → ×1.5
Weekend Surcharge	Saturday/Sunday → +₹5
Indoor Premium	Indoor courts → +₹2
Equipment Fee	Based on quantity
Coach Fee	Fixed per session


Rules stack together automatically.


---

✔ 4. Admin Controls

Admins can manage:

Courts

Coaches

Equipment inventory

Pricing rules (enable/disable/multipliers/surcharges)



---

✔ 5. Frontend (React Demo)

A simple React interface allowing users to:

View courts

Choose date & time slots

Add equipment

Make bookings

See booking confirmation



---

🗂 Project Structure

/root
 ├── backend
 │    ├── models          # Mongoose schemas
 │    ├── routes          # API endpoints
 │    ├── utils           # Pricing logic
 │    ├── seed.js         # Seed initial data
 │    ├── server.js       # App entry point
 │    └── .env.example
 │
 └── frontend
      ├── public
      └── src             # React components & API calls


---

⚙ Tech Stack

Frontend

React

Axios


Backend

Node.js + Express

MongoDB + Mongoose

dotenv, cors, body-parser


Tools

VS Code

Postman

GitHub



---

🛠 Setup Instructions

1️⃣ Clone & Install Backend

cd backend
npm install

2️⃣ Setup Environment File

Create .env inside /backend:

PORT=5000
MONGO_URI=mongodb://localhost:27017/acorn_globus

3️⃣ Seed Initial Data

npm run seed

This inserts sample:

4 courts

3 coaches

Equipment stock

Pricing rules


4️⃣ Start Backend

npm start


---

🖥 Run the Frontend (Demo)

cd frontend
npm install
npm start

Open browser →
http://localhost:3000


---

🧪 API Endpoints

Courts

GET   /api/courts
POST  /api/courts/admin

Equipment

GET   /api/equipment
POST  /api/equipment/admin

Coaches

GET   /api/coaches
POST  /api/coaches/admin

Pricing Rules

GET   /api/pricing
POST  /api/pricing/admin

Bookings

GET   /api/bookings
POST  /api/bookings


---

🧠 Architecture Highlights

Multi-Resource Availability Logic

The system checks:

Court overlapping time blocks

Available equipment count

Coach active status


If any resource fails → full booking rejected (atomic behavior).

Pricing Engine

Rules are stored in DB:

multipliers

surcharges

time-based rules

day-based rules


The engine calculates:

finalPrice = (basePrice × multipliers) + surcharges + equipmentFee + coachFee


---

📦 Seed Data Summary

Automatically created:

4 courts (2 indoor, 2 outdoor)

Equipment: 10 rackets, 8 shoes

3 coaches

Pricing rules (peak, weekend, indoor premium)



---

📽 Screen Recording (For Submission)

Include a short video showing:

1. Backend running


2. Frontend booking process


3. Price calculation


4. Admin endpoints (Postman)


5. Booking history




---

📄 Assignment Notes

This project covers:

Database schema design

Conflict detection logic

Dynamic pricing engine

Clean API structure

Simple working frontend

Seeded data for evaluation


Designed to be easy for reviewers to test and understand.


---

🙌 Thank You
