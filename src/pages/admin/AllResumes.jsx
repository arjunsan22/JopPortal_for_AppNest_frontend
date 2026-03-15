// src/pages/admin/AllResumes.jsx
import { useState, useEffect } from 'react';
import ResumeTable from '../../components/admin/ResumeTable';
import { Download } from 'lucide-react';

export default function AllResumes() {
  const [localApplications, setLocalApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page,
        limit: 3,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && statusFilter !== 'all' && { status: statusFilter })
      });

      const res = await fetch(`http://localhost:5000/api/applications?${queryParams}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        const formattedApps = (data.data?.data || []).map(app => ({
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
        setTotalPages(data.data?.pagination?.totalPages || 1);
      } else {
        setError('Failed to load applications');
      }
    } catch (err) {
      setError('Network error loading applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, searchTerm, statusFilter]);

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
      ) : (
        <>
          <ResumeTable
            applications={localApplications}
            onStatusChange={handleStatusChange}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            loading={loading}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-gray-600 font-medium">Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}