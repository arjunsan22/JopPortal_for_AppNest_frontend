import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, Filter, ChevronRight, TrendingUp } from "lucide-react";
import JobCard from '../components/jobs/JobCard';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          page: 1,
          limit: 10,
          ...(searchTerm && { search: searchTerm }),
          ...(location && { location: location })
        });

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/job?${queryParams}`);
        const data = await res.json();
        if (data.success) {
          // The backend was updated to return pagination, so the array is under data.data
          setJobs(data.data?.data || []);
        } else {
          setError('Failed to fetch jobs');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [searchTerm, location]);

  // Make sure jobs are rendered
  const filteredJobs = jobs || [];

  const popularTags = ["Remote", "Frontend", "Product Design", "Full-time", "Senior Role"];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-white">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
              <TrendingUp size={16} /> 1,240 new jobs posted this week
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              Find your next <span className="text-blue-600">career milestone.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              We connect the world's most ambitious designers and engineers with
              companies building the future. No fluff, just opportunities.
            </p>
          </motion.div>

          {/* --- MODERN SEARCH BAR --- */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white p-2 md:p-3 rounded-2xl shadow-2xl shadow-blue-100 border border-slate-100 flex flex-col md:flex-row items-center gap-2">
              <div className="flex-1 flex items-center w-full px-4 border-b md:border-b-0 md:border-r border-slate-100">
                <Search className="text-slate-400 mr-3" size={20} />
                <input
                  type="text"
                  placeholder="Job title or company"
                  className="w-full py-3 focus:outline-none text-slate-700 placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-1 flex items-center w-full px-4">
                <MapPin className="text-slate-400 mr-3" size={20} />
                <input
                  type="text"
                  placeholder="Location (e.g. Remote)"
                  className="w-full py-3 focus:outline-none text-slate-700 placeholder:text-slate-400"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-200 active:scale-95">
                Search Jobs
              </button>
            </div>

            {/* Popular Tags */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="text-slate-500 text-sm self-center">Popular:</span>
              {popularTags.map((tag) => (
                <button key={tag} className="px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-sm hover:border-blue-400 hover:text-blue-600 transition-colors">
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- CONTENT SECTION --- */}
      <main className="max-w-7xl mx-auto px-6 -mt-12 pb-20 relative z-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Opportunities</h2>
            <p className="text-slate-500">Showing {filteredJobs.length} results based on your preferences</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm">
            <Filter size={18} /> Filters
          </button>
        </div>

        {/* Jobs Grid with AnimatePresence for smooth filtering */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading jobs...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 bg-red-50 rounded-2xl border border-red-100">{error}</div>
        ) : (
          <motion.div
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode='popLayout'>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <motion.div
                    key={job._id || job.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <JobCard job={job} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                  <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Search className="text-slate-300" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">No matches found</h3>
                  <p className="text-slate-500">Try adjusting your keywords or location filters.</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}


      </main>
    </div>
  );
}