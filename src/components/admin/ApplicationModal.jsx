import React from 'react';
import { Download, X, User } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ApplicationModal({ open, onClose, application }) {
  if (!open || !application) return null;

  const handleDownload = () => {
    // Assuming backend serves files from /public/resumes...
    window.open(`http://localhost:5000${application.resume}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                {application.applicantName}
              </h2>
              <p className="text-sm text-gray-500">
                Applied for <span className="font-medium text-gray-700">{application.jobTitle}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">

            {/* Email */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
              <p className="text-gray-900">{application.email}</p>
            </div>

            {/* Phone */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
              <p className="text-gray-900">{application.phone}</p>
            </div>

            {/* Experience */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Experience</p>
              <p className="text-gray-900">{application.experience} years</p>
            </div>

            {/* Work Mode */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Work Mode</p>
              <p className="text-gray-900">{application.workMode}</p>
            </div>

            {/* Current CTC */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Current CTC</p>
              <p className="text-gray-900">
                {application.currentCtc ? `₹${application.currentCtc} LPA` : 'N/A'}
              </p>
            </div>

            {/* Expected CTC */}
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Expected CTC</p>
              <p className="text-gray-900 border border-green-200 bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded inline-block">
                ₹{application.expectedCtc} LPA
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-2">Current Status</p>
            <StatusBadge status={application.status} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Close
          </button>

        </div>
      </div>
    </div>
  );
}
