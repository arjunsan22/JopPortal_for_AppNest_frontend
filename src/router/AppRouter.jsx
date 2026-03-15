// src/router/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Home from '../pages/Home'
import JobDetails from '../pages/JobDetails'
import ApplyForm from '../pages/ApplyForm'
//admin
import AdminLayout from '../components/layout/admin/AdminLayout'
import AdminDashboard from '../pages/admin/AdminDashboard';
import AllResumes from '../pages/admin/AllResumes';
import Login from '../pages/auth/Login'
import PostJob from '../pages/admin/PostJob'
import AllJobs from '../pages/admin/AllJobs';

const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

const AdminRoute = ({ children }) => {
  const user = getUser();

  if (!user || user.role !== 'admin') {
    return <Navigate to='/login' replace />
  }
  return children;
}

// Checking the if admin is already logged in....
const PublicRoute = ({ children }) => {
  const user = getUser();

  if (user && user.role === 'admin') {
    return <Navigate to='/admin' replace />
  }
  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* auth route */}
        <Route
          path='/login'
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }

        />

        {/* User Routes - With Navbar & Footer */}
        <Route path="/" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Home />
            </main>
            <Footer />
          </div>
        } />

        <Route path="/job/:id" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <JobDetails />
            </main>
            <Footer />
          </div>
        } />

        <Route path="/apply/:jobId" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <ApplyForm />
            </main>
            <Footer />
          </div>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={
            <AdminDashboard />
          } />
          <Route path="resumes" element={<AllResumes />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="all-jobs" element={<AllJobs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}