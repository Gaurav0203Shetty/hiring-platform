# Hiring Platform
A next-generation, AI-powered recruitment platform that connects recruiters with top talent. This platform includes features for resume processing, candidate-recruiter matching, job posting, interview scheduling, internal messaging, and real-time notifications.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Project Overview
The Hiring Platform is designed to streamline the recruitment process by integrating advanced resume parsing, intelligent job-candidate matching, and a suite of tools for both candidates and recruiters. The application supports role-based views, allowing candidates to browse and apply for jobs, and recruiters to post jobs, track applications, schedule interviews, and communicate via an internal messaging system.

## Features

#### Core Features
- **User Authentication & Role-Based Access:**  
  Implemented with NextAuth.js and Prisma, supporting both candidates and recruiters.
- **Resume Processing:**  
  Upload, parse (with fallback dummy data), and update candidate profiles.
- **Candidate Portal:**  
  - Job browsing with search and filter capabilities.
  - "My Applications" and "Favorites" pages.
  - Advanced matching details with skill gap analysis.
  - Resume Improvement Suggestions.
- **Recruiter Portal:**  
  - Job posting and application tracking dashboard.
  - Interview scheduling and analytics.
  - Real-time notifications using Pusher.
- **Internal Messaging System:**  
  Unified messaging for candidates and recruiters.

#### Bonus / Advanced Features
- **Advanced Matching Algorithm:**  
  Weighted skills and text similarity for candidate-job matching.
- **Automated Interview Question Generation:**  
  (Currently returns dummy questions; can be enhanced with AI.)
- **Real-Time Notifications:**  
  Using Pusher channels for live updates on job postings and applications.

## Tech Stack

- **Frontend:**  
  Next.js 13 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui components, Recharts
- **Backend:**  
  Next.js API routes, Prisma ORM, PostgreSQL
- **Authentication:**  
  NextAuth.js with role-based session management
- **Real-Time Notifications:**  
  Pusher Channels
- **Other Tools:**  
  Vercel for deployment, Git for version control


## Installation

1. **Clone the Repository:** 

```bash
  git clone https://github.com/your-username/hiring-platform.git
  cd hiring-platform
```

2. **Install Dependencies:** 
```bash
  npm Install
```

3. **Set Up Environment Variables:** 
Create a .env file in the root directory and add the following (update with your own values)-
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_value
DATABASE_URL=postgresql://user:password@localhost:5432/your_db_name

# Pusher environment variables
PUSHER_APP_ID=your_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
```

4. **Run Prisma Migrations:**
```bash
npx prisma migrate dev --name init
npx prisma generate

```

5. **Seed The Database (Optional):**
If you have a seed script (e.g., seed.ts) for creating initial users (candidates and recruiters):
```bash
npx ts-node seed.ts

```









    
## Usage

1. **Start The Development Server:**
 ```bash
npm run dev
```

2. **Access The Application:**
Open your browser and navigate to http://localhost:3000.

3. **Sign In:**
Use the authentication page to sign in as a candidate or recruiter. Role-based dashboards and navigation links will be displayed accordingly.

4. **Explore Features:**
- **Candidates:**  
  Browse jobs, view "My Applications," mark jobs as favorites, request        interviews, and view resume improvement suggestions.       
- **Recruiters:**  
  Post new jobs, view applications, schedule interviews, see analytics, and receive real-time notifications.

4. **Messaging:**
Use the internal messaging system to communicate between candidates and recruiters.






## Deployment

The project can be deployed on platforms like Vercel:
1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Set environment variables in Vercel's dashboard.
4. Deploy!


## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: git checkout -b feature/your-feature-name
3. Commit your changes: git commit -m 'Add your feature'
4. Push to your branch: git push origin feature/your-feature-name
5. Open a Pull Request.
