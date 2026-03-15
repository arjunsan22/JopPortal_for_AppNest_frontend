import { useState } from 'react';
import { Search, Phone, Briefcase, MapPin, CheckCircle, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ApplyedJobs() {
    const [phone, setPhone] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    
    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const fetchAppliedJobs = async (currentPage = 1) => {
        if (!phone) {
            toast.error('Please enter your phone number');
            return;
        }

        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: currentPage,
                limit: 2,
                phone: phone.trim()
            });
            
            if (searchTerm) {
                queryParams.append('search', searchTerm.trim());
            }

            const res = await fetch(`http://localhost:5000/api/applications/applied?${queryParams}`);
            const data = await res.json();
            
            if (res.ok && data.success) {
                setApplications(data.data?.data || []);
                setTotalPages(data.data?.pagination?.totalPages || 1);
                setPage(currentPage);
                setHasSearched(true);
            } else {
                toast.error(data.message || 'Failed to fetch applied jobs');
            }
        } catch (error) {
            toast.error('Network error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchAppliedJobs(1);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'selected':
                return { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle className="w-5 h-5 text-green-600" /> };
            case 'rejected':
                return { bg: 'bg-red-100', text: 'text-red-800', icon: <XCircle className="w-5 h-5 text-red-600" /> };
            default:
                return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock className="w-5 h-5 text-yellow-600" /> };
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl shadow-blue-50/50 border border-slate-100 p-8 mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Track Your Applications</h1>
                    <p className="text-lg text-slate-500 mb-8 font-medium">Enter the phone number you used during the application process to view your status.</p>

                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1 relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="tel"
                                placeholder="Phone Number (e.g. 9876543210)"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Filter by Job Title (Optional)"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-10 py-4 rounded-2xl font-bold transition-all flex items-center justify-center min-w-[160px] disabled:opacity-70 shadow-lg shadow-blue-200"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                "Find My Jobs"
                            )}
                        </button>
                    </form>
                </div>

                {hasSearched && (
                    <div className="space-y-6">
                        {loading && applications.length === 0 ? (
                           <div className="text-center py-20">
                               <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600 mx-auto"></div>
                               <p className="mt-4 text-slate-500 font-medium">Fetching your applications...</p>
                           </div>
                        ) : applications.length === 0 ? (
                            <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
                                <div className="mx-auto w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                    <Briefcase className="w-12 h-12 text-slate-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">No Applications Found</h3>
                                <p className="text-lg text-slate-500 max-w-md mx-auto leading-relaxed">We couldn't find any active job applications associated with <span className="font-semibold text-slate-700">{phone}</span>. Please check the number and try again.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {applications.map((app) => (
                                    <div key={app._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all flex flex-col md:flex-row gap-6 md:items-center justify-between group">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                    {app.jobId ? app.jobId.title : 'Deleted Job'}
                                                </h3>
                                                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100/50 uppercase tracking-wider">
                                                    Applied {new Date(app.appliedDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 font-semibold text-lg mb-5 flex items-center gap-2">
                                                <Briefcase className="w-5 h-5 text-blue-500" />
                                                {app.jobId ? app.jobId.company : 'N/A'}
                                            </p>
                                            
                                            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                                                <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 font-medium">
                                                    <MapPin className="w-4 h-4 text-slate-400" />
                                                    {app.jobId ? app.jobId.location : '-'}
                                                </span>
                                                <span className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 font-medium">
                                                    <strong>Work Mode:</strong> {app.workMode}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between md:justify-end">
                                            <div className="flex flex-col md:items-end gap-2 text-left md:text-right">
                                                <p className="text-sm text-slate-400 font-semibold tracking-wide uppercase hidden md:block">Application Status</p>
                                                <div className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm border shadow-sm ${getStatusStyle(app.status).bg} ${getStatusStyle(app.status).text} border-current/10`}>
                                                    {getStatusStyle(app.status).icon}
                                                    <span className="capitalize tracking-wide">{app.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-4 mt-8">
                                        <button 
                                            disabled={page === 1} 
                                            onClick={() => fetchAppliedJobs(page - 1)}
                                            className="px-6 py-3 bg-white border border-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 font-semibold text-slate-700 shadow-sm transition-all"
                                        >
                                            Previous
                                        </button>
                                        <div className="px-6 py-3 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-600 font-bold">
                                            Page <span className="text-blue-600">{page}</span> of {totalPages}
                                        </div>
                                        <button 
                                            disabled={page === totalPages} 
                                            onClick={() => fetchAppliedJobs(page + 1)}
                                            className="px-6 py-3 bg-white border border-slate-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 font-semibold text-slate-700 shadow-sm transition-all"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
