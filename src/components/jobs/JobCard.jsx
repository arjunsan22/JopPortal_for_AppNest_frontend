import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock } from "lucide-react";

export default function JobCard({ job }) {
  // Map MongoDB fields / Mock fields so it won't break previous mock references instantly
  const jobId = job._id || job.id;
  const isType = job.jobType || job.type || 'N/A';
  const isMode = job.workMode || job.mode || 'N/A';
  const dateStr = job.createdAt || job.postedDate || new Date();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition cursor-pointer">
      <Link to={`/job/${jobId}`}>
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
        <p className="text-blue-600 font-medium mb-3">{job.company}</p>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={16} />
            <span>{isType} • {isMode}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{job.salary}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">
            Posted: {new Date(dateStr).toLocaleDateString()}
          </span>
          <span className="text-blue-600 font-medium text-sm hover:underline">
            View Details →
          </span>
        </div>
      </Link>
    </div>
  );
}