export const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp Inc.",
    location: "Bangalore, India",
    type: "Full-time",
    mode: "Remote",
    salary: "₹8-12 LPA",
    postedDate: "2024-03-10",
    description: "We are looking for a skilled Frontend Developer with React experience. You will build responsive UIs and collaborate with backend teams.",
    requirements: [
      "2+ years React experience",
      "Strong CSS/Tailwind skills",
      "Knowledge of REST APIs"
    ]
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "DataFlow Systems",
    location: "Pune, India",
    type: "Full-time",
    mode: "Hybrid",
    salary: "₹10-15 LPA",
    postedDate: "2024-03-12",
    description: "Join our backend team to build scalable APIs using Node.js and MongoDB. Experience with microservices is a plus.",
    requirements: [
      "Node.js & Express expertise",
      "MongoDB/PostgreSQL knowledge",
      "Understanding of authentication flows"
    ]
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Creative Labs",
    location: "Mumbai, India",
    type: "Contract",
    mode: "Work From Office",
    salary: "₹6-9 LPA",
    postedDate: "2024-03-13",
    description: "Design beautiful, user-friendly interfaces for web and mobile applications. Portfolio required.",
    requirements: [
      "Figma/Sketch proficiency",
      "Strong portfolio",
      "User research experience"
    ]
  },

  {
    id: 4,
    title: "Full Stack Developer",
    company: "InnovateX",
    location: "Hyderabad, India",
    type: "Full-time",
    mode: "Hybrid",
    salary: "₹9-14 LPA",
    postedDate: "2024-03-14",
    description: "Looking for a MERN stack developer to build scalable web applications.",
    requirements: [
      "React + Node.js experience",
      "MongoDB knowledge",
      "Git and REST API understanding"
    ]
  },

  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudNet Solutions",
    location: "Chennai, India",
    type: "Full-time",
    mode: "Remote",
    salary: "₹12-18 LPA",
    postedDate: "2024-03-15",
    description: "Manage CI/CD pipelines and cloud infrastructure using AWS and Docker.",
    requirements: [
      "AWS experience",
      "Docker & Kubernetes",
      "CI/CD pipeline setup"
    ]
  },

  {
    id: 6,
    title: "Mobile App Developer",
    company: "AppWave",
    location: "Kochi, India",
    type: "Full-time",
    mode: "Work From Office",
    salary: "₹7-11 LPA",
    postedDate: "2024-03-16",
    description: "Build cross-platform mobile applications using React Native.",
    requirements: [
      "React Native experience",
      "JavaScript/TypeScript",
      "Mobile UI development"
    ]
  },

  {
    id: 7,
    title: "Data Analyst",
    company: "Insight Analytics",
    location: "Delhi, India",
    type: "Full-time",
    mode: "Hybrid",
    salary: "₹6-10 LPA",
    postedDate: "2024-03-17",
    description: "Analyze business data and generate insights using SQL and visualization tools.",
    requirements: [
      "SQL expertise",
      "Power BI or Tableau",
      "Strong analytical skills"
    ]
  },

  {
    id: 8,
    title: "Software Tester",
    company: "QualityFirst",
    location: "Noida, India",
    type: "Full-time",
    mode: "Remote",
    salary: "₹5-8 LPA",
    postedDate: "2024-03-18",
    description: "Test web applications and ensure product quality before release.",
    requirements: [
      "Manual testing knowledge",
      "Automation tools like Selenium",
      "Bug tracking experience"
    ]
  },

  {
    id: 9,
    title: "Product Manager",
    company: "NextGen Products",
    location: "Bangalore, India",
    type: "Full-time",
    mode: "Hybrid",
    salary: "₹15-20 LPA",
    postedDate: "2024-03-19",
    description: "Lead product development and coordinate between design, engineering, and marketing teams.",
    requirements: [
      "Product lifecycle knowledge",
      "Strong leadership",
      "Agile methodology experience"
    ]
  }
];

// helper funciton to get single job by id ......
export const getJobById = (id) => jobs.find(job => job.id === Number(id));