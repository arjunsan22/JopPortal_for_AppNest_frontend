// src/services/mockApplications.js
export const applications = [
  {
    id: 1,
    applicantName: "Rahul Sharma",
    email: "rahul.sharma@email.com",
    phone: "+91 9876543210",
    jobTitle: "Frontend Developer",
    jobId: 1,
    experience: "3",
    currentCtc: "6.5",
    expectedCtc: "10",
    workMode: "Remote",
    status: "pending",
    appliedDate: "2024-03-10",
    resume: "resume_rahul.pdf"
  },
  {
    id: 2,
    applicantName: "Priya Patel",
    email: "priya.patel@email.com",
    phone: "+91 9123456789",
    jobTitle: "Frontend Developer",
    jobId: 1,
    experience: "5",
    currentCtc: "9",
    expectedCtc: "14",
    workMode: "Hybrid",
    status: "selected",
    appliedDate: "2024-03-11",
    resume: "resume_priya.pdf"
  },
  {
    id: 3,
    applicantName: "Amit Kumar",
    email: "amit.kumar@email.com",
    phone: "+91 9988776655",
    jobTitle: "Backend Engineer",
    jobId: 2,
    experience: "4",
    currentCtc: "8",
    expectedCtc: "12",
    workMode: "Work From Office",
    status: "rejected",
    appliedDate: "2024-03-12",
    resume: "resume_amit.pdf"
  },
  {
    id: 4,
    applicantName: "Sneha Reddy",
    email: "sneha.reddy@email.com",
    phone: "+91 9765432108",
    jobTitle: "Backend Engineer",
    jobId: 2,
    experience: "2",
    currentCtc: "5",
    expectedCtc: "9",
    workMode: "Remote",
    status: "pending",
    appliedDate: "2024-03-13",
    resume: "resume_sneha.pdf"
  },
  {
    id: 5,
    applicantName: "Vikram Singh",
    email: "vikram.singh@email.com",
    phone: "+91 9654321087",
    jobTitle: "UI/UX Designer",
    jobId: 3,
    experience: "6",
    currentCtc: "11",
    expectedCtc: "16",
    workMode: "Hybrid",
    status: "pending",
    appliedDate: "2024-03-13",
    resume: "resume_vikram.pdf"
  },
  {
    id: 6,
    applicantName: "Ananya Das",
    email: "ananya.das@email.com",
    phone: "+91 9543210876",
    jobTitle: "Frontend Developer",
    jobId: 1,
    experience: "1",
    currentCtc: "3.5",
    expectedCtc: "6",
    workMode: "Remote",
    status: "selected",
    appliedDate: "2024-03-14",
    resume: "resume_ananya.pdf"
  }
];

// Helper to get stats
export const getApplicationStats = () => {
  const total = applications.length;
  const pending = applications.filter(app => app.status === 'pending').length;
  const selected = applications.filter(app => app.status === 'selected').length;
  const rejected = applications.filter(app => app.status === 'rejected').length;
  
  return { total, pending, selected, rejected };
};

// Helper to update application status
export const updateApplicationStatus = (applicationId, newStatus) => {
  const app = applications.find(a => a.id === applicationId);
  if (app) {
    app.status = newStatus;
    console.log(`✅ Updated application ${applicationId} to ${newStatus}`);
    return true;
  }
  return false;
};