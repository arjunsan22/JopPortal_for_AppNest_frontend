import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Trash2, Plus, Eye, X, Save } from "lucide-react";
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AllJobs() {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page,
                limit: 4,
                ...(searchTerm && { search: searchTerm }),
                ...(location && { location: location })
            });

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/job?${queryParams}`);
            const data = await res.json();
            if (data.success) {
                setJobs(data.data?.data || []);
                setTotalPages(data.data?.pagination?.totalPages || 1);
            } else {
                toast.error('Failed to fetch jobs');
            }
        } catch (err) {
            toast.error('Network error while fetching jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [page, searchTerm, location]);

    // Custom Confirmation Toast Helper
    const confirmAction = (message, actionText, onConfirm) => {
        toast((t) => (
            <div className="flex flex-col gap-3 p-2">
                <p className="font-medium text-gray-900">{message}</p>
                <div className="flex gap-2 justify-end mt-2">
                    <button
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700 font-medium transition"
                        onClick={() => toast.dismiss(t.id)}>
                        Cancel
                    </button>
                    <button
                        className={`px-3 py-1.5 rounded-md text-sm text-white font-medium transition ${actionText === 'Delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        onClick={() => {
                            toast.dismiss(t.id);
                            onConfirm();
                        }}>
                        Yes, {actionText}
                    </button>
                </div>
            </div>
        ), { duration: Infinity });
    };

    const handleDelete = (jobId) => {
        confirmAction("Are you sure you want to delete this job?", "Delete", async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/job/${jobId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                const data = await res.json();

                if (data.success) {
                    toast.success('Job deleted successfully');
                    setJobs(jobs.filter(job => job._id !== jobId));
                } else {
                    toast.error(data.message || 'Failed to delete job');
                }
            } catch (error) {
                toast.error('Network error during deletion');
            }
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        confirmAction("Are you sure you want to update this job?", "Update", async () => {
            try {
                let formattedRequirements = editingJob.requirements;
                if (typeof editingJob.requirements === 'string') {
                    formattedRequirements = editingJob.requirements.split(',').map(req => req.trim()).filter(Boolean);
                }

                const payload = {
                    ...editingJob,
                    requirements: formattedRequirements
                };

                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/job/${editingJob._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });

                const data = await res.json();

                if (data.success) {
                    toast.success('Job updated successfully');
                    setJobs(jobs.map(job => (job._id === editingJob._id ? data.data?.job || payload : job)));
                    setIsModalOpen(false);
                    setEditingJob(null);
                } else {
                    toast.error(data.message || 'Failed to update job');
                }
            } catch (error) {
                toast.error('Network error during update');
            }
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingJob(prev => ({ ...prev, [name]: value }));
    };

    const openModal = (job) => {
        // Prepare the job object for editing, changing requirements array to a comma-separated string for the textarea
        setEditingJob({
            ...job,
            requirements: Array.isArray(job.requirements) ? job.requirements.join(', ') : job.requirements
        });
        setIsModalOpen(true);
    };

    const filteredJobs = jobs; // Filter is now done via API call

    const locations = [...new Set(jobs.map(job => job.location).filter(Boolean))];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
                    <p className="text-gray-500 mt-1">View, edit, and manage all your posted jobs</p>
                </div>
                <Link
                    to="/admin/post-job"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Post New Job
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by job title or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
                        />
                    </div>

                    <div className="flex-1 sm:max-w-xs relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-gray-50/50 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207l5%205%205-5%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_10px_center] pr-10"
                        >
                            <option value="">All Locations</option>
                            {locations.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p>Loading jobs...</p>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-1">No jobs found</p>
                        <p>Try adjusting your search filters or create a new job.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/80 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Role</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type / Location</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredJobs.map(job => (
                                    <tr key={job._id} className="hover:bg-gray-50/50 transition duration-150">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 mb-1">{job.title}</div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(job.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{job.company}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="inline-flex max-w-max items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                                    {job.jobType}
                                                </span>
                                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {job.location}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {job.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openModal(job)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="View & Edit Job"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(job._id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete job"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

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

            {/* View/Edit Job Modal */}
            {isModalOpen && editingJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-bold text-gray-900">Update Job Information</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <form id="updateJobForm" onSubmit={handleUpdate} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                        <input type="text" name="title" value={editingJob.title || ''} onChange={handleEditChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                        <input type="text" name="company" value={editingJob.company || ''} onChange={handleEditChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input type="text" name="location" value={editingJob.location || ''} onChange={handleEditChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                                        <input type="text" name="salary" value={editingJob.salary || ''} onChange={handleEditChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                                        <input type="text" name="experience" value={editingJob.experience || ''} onChange={handleEditChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                                        <select name="jobType" value={editingJob.jobType || ''} onChange={handleEditChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
                                        <select name="workMode" value={editingJob.workMode || ''} onChange={handleEditChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                            <option value="Remote">Remote</option>
                                            <option value="Work From Office">Work From Office</option>
                                            <option value="Hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select name="status" value={editingJob.status || 'Active'} onChange={handleEditChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                            <option value="Active">Active</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea name="description" value={editingJob.description || ''} onChange={handleEditChange} rows="3" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (comma separated)</label>
                                    <textarea name="requirements" value={editingJob.requirements || ''} onChange={handleEditChange} rows="2" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                                </div>
                            </form>
                        </div>

                        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                                Cancel
                            </button>
                            <button type="submit" form="updateJobForm" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                Save Updates
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
