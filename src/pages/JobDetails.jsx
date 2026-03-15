import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Calendar,
  ChevronLeft,
  Building2
} from "lucide-react";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/job/${id}`);
        const data = await res.json();
        
        if (data.success) {
          setJob(data.data?.job);
        } else {
          setError(data.message || 'Failed to fetch job');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-800">Job not found</h2>
          <p className="text-slate-500 mt-2">{error}</p>
          <Link
            to="/"
            className="text-slate-600 mt-4 flex items-center justify-center gap-2 hover:text-slate-900"
          >
            <ChevronLeft size={18} />
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  // Map MongoDB fields to fallback on mock variables safely if needed during transition
  const jobId = job._id || job.id;
  const isType = job.jobType || job.type || 'N/A';
  const isMode = job.workMode || job.mode || 'N/A';
  const dateStr = job.createdAt || job.postedDate || new Date();

  return (
    <div className="min-h-screen bg-slate-50 pb-24">

      {/* Top Navigation */}
      <nav className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
          >
            <ChevronLeft size={18} />
            Back to jobs
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-10 space-y-8">

        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          <div className="flex gap-4 items-start">

            <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Building2 size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-slate-900 leading-tight">
                {job.title}
              </h1>

              <p className="text-slate-600 mt-1">
                {job.company}
              </p>
            </div>

          </div>


<div className="grid sm:grid-cols-2 gap-4 mb-6">

  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 backdrop-blur-sm hover:bg-gray-100 transition">
    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
      <MapPin size={18} />
    </div>
    <span className="text-gray-700 font-medium">{job.location}</span>
  </div>

  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 backdrop-blur-sm hover:bg-gray-100 transition">
    <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
      <Briefcase size={18} />
    </div>
    <span className="text-gray-700 font-medium">
      {isType} • {isMode}
    </span>
  </div>

  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 backdrop-blur-sm hover:bg-gray-100 transition">
    <div className="p-2 rounded-lg bg-green-100 text-green-600">
      <IndianRupee size={18} />
    </div>
    <span className="text-gray-700 font-medium">{job.salary}</span>
  </div>

  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 backdrop-blur-sm hover:bg-gray-100 transition">
    <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
      <Calendar size={18} />
    </div>
    <span className="text-gray-700 font-medium">
      Posted: {new Date(dateStr).toLocaleDateString()}
    </span>
  </div>

</div>

        </div>

        {/* Description */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            About the role
          </h2>

          <p className="text-slate-600 leading-relaxed">
            {job.description}
          </p>
        </section>

        {/* Requirements */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">
            Requirements
          </h2>

          <ul className="space-y-3">
            {job.requirements.map((req, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-slate-600"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2" />
                {req}
              </li>
            ))}
          </ul>
        </section>

        {/* Apply Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <button
            onClick={() => navigate(`/apply/${jobId}`)}
            className="px-10 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition"
          >
            Apply for this position
          </button>
        </div>

      </main>
    </div>
  );
}
