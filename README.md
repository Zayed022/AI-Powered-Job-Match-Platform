#  AI-Powered Job Match Platform

A full-stack AI-integrated platform that connects job seekers with tailored opportunities and provides admin capabilities to manage job postings. Built using the MERN stack and enhanced with GPT-based AI for intelligent job matching.

---
##  Setup Instructions

###  Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- npm or yarn
- Vite (for frontend)

###  Backend Setup

```bash
cd backend
npm install

##  Features Overview

### 1. 👤 User Authentication & Token Management

- **User Registration**: New users can register with name, email, password, and role (`user` or `admin`).
- **Login**: Secure login with email and password. A JSON Web Token (JWT) is issued on success.
- **Logout**: Token is invalidated on logout (handled on frontend).
- **Secure Token Management**:
  - JWT stored in HTTP headers for secure communication.
  - Token expiry and refresh logic managed to protect routes and sessions.

---

### 2.  User Profile Management

- **Profile View**: Logged-in users can view their profile details.
- **Profile Update**:
  - Users can update fields like `name`, `email`, `location`, and `skills`.
  - All changes are reflected in MongoDB through secured routes.
- **Authorization**:
  - Only the authenticated user can update their profile.
  - Uses middleware to verify tokens and access roles.

---

### 3.  Job Listing Page

- **Job List View**:
  - Displays a list of jobs fetched in real-time from the backend API.
  - Job details include: `Title`, `Company`, `Location`, `Skills Required`.
- **Responsive UI**:
  - Mobile and desktop-friendly.
  - Modern design with a table view or cards layout.
- **Frontend Framework**: Built using Vite + React.

---

### 4.  Admin Dashboard Features

Admins have access to advanced features including:

####  Job Creation
- Create new job listings with:
  - `Title`
  - `Company`
  - `Location`
  - `Skills Required`
- Secured using role-based middleware (`admin` only).

####  Update Job
- Modify any job details by ID.
- Admin can fetch job info, edit, and update it using a form interface.

####  View All Jobs
- Admin can view the complete list of jobs in a dashboard table.
- Includes “Edit” and “Delete” action buttons.

####  Delete Job
- Deletes a job permanently from MongoDB.
- Uses `DELETE` HTTP method secured with JWT in headers.
- Instant UI refresh on successful deletion.

---

### 5.  AI-Powered Job Recommendation System

This is the core intelligence of the platform.

####  How It Works:
- User submits resume text or skill keywords.
- The system compares it against job descriptions in the database.
- Uses CohereAI  API (or mock if in development) to evaluate:
  - Skill match
  - Experience fit
  - Overall compatibility

####  Sample Prompt to AI:

```js
const prompt = `
Match the candidate to the job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide:
- Summary of compatibility
- Matching percentage
`;
