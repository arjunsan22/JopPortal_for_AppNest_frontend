// src/pages/admin/AllResumes.jsx
import { useState, useEffect } from 'react';
import ResumeTable from '../../components/admin/ResumeTable';
import { Download } from 'lucide-react';

export default function AllResumes() {
  const [localApplications, setLocalApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/applications', {
          credentials: 'include' // Needed to pass verify admin JWT token cookie
        });
        const data = await res.json();
        if (data.success) {
          // Map backend mongoose schema models into flat table friendly models
          const formattedApps = data.applications.map(app => ({
            id: app._id,
            applicantName: app.applicantName,
            email: app.email,
            phone: app.phone,
            jobTitle: app.jobId ? app.jobId.title : 'Unknown Job',
            workMode: app.workMode,
            experience: app.experience,
            currentCtc: app.currentCtc || 'N/A',
            expectedCtc: app.expectedCtc,
            status: app.status,
            resume: app.resume
          }));
          setLocalApplications(formattedApps);
        } else {
          setError('Failed to load applications');
        }
      } catch (err) {
        setError('Network error loading applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // Handle status change (passed to ResumeTable)
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      // Optimistic UI Update first for real-time responsiveness
      setLocalApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      // Async backend update
      const res = await fetch(`http://localhost:5000/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        // Rollback on failure could go here
        console.error('Failed to update status on server');
      }
    } catch (err) {
      console.error('Network error during status update:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Applications</h1>
          <p className="text-gray-500 mt-1">
            {loading ? 'Loading...' : `${localApplications.length} applications received`}
          </p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {error ? (
        <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
      ) : loading ? (
        <div className="text-gray-500 p-4">Fetching resumes...</div>
      ) : (
        /* Reusable Table Component */
        <ResumeTable 
          applications={localApplications} 
          onStatusChange={handleStatusChange} 
        />
      )}
    </div>
  );
}