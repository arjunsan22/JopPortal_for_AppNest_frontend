import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

export default function ApplyForm() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/job/${jobId}`);
        const data = await res.json();
        if (data.success) {
          setJob(data.data?.job);
        } else {
          setError('Failed to fetch job');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    resume: null,
    expectedCtc: "",
    currentCtc: "",
    workMode: "Remote",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.resume) {
      toast.error("Please upload a resume.");
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    data.append("jobId", jobId);
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("experience", formData.experience);
    data.append("currentCtc", formData.currentCtc);
    data.append("expectedCtc", formData.expectedCtc);
    data.append("workMode", formData.workMode);
    data.append("resume", formData.resume); // Multer expects this exact property name

    try {
      const response = await fetch("http://localhost:5000/api/applications/apply", {
        method: "POST",
        body: data, // Using FormData, let the browser define matching Content-Type and boundaries
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Application submitted successfully!");
        setTimeout(() => {
          navigate(`/job/${jobId}`);
        }, 1500);
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error("Network error while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-gray-500">Loading form...</div></div>;
  }

  if (error || !job) {
    return <div className="p-10 text-center bg-gray-50 text-red-500 font-medium">Job not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Toaster position="top-center" />

      <div className="max-w-2xl mx-auto">

        <Link
          to={`/job/${jobId}`}
          className="text-sm text-gray-500 hover:text-gray-800 mb-6 inline-block"
        >
          ← Back to Job
        </Link>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

          {/* Header */}
          <div className="mb-8 border-b pb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Apply for {job.title}
            </h1>

            <p className="text-gray-500 mt-1 text-sm">
              {job.company} • {job.location}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">

            {/* Personal Info */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                Personal Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">

                <input
                  required
                  placeholder="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  required
                  placeholder="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>
            </div>

            {/* Contact */}
            <div className="grid sm:grid-cols-2 gap-4">

              <input
                required
                placeholder="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                required
                placeholder="Experience (years)"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Salary */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                Salary Details
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">

                <input
                  placeholder="Current CTC (LPA)"
                  name="currentCtc"
                  value={formData.currentCtc}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  required
                  placeholder="Expected CTC (LPA)"
                  name="expectedCtc"
                  value={formData.expectedCtc}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>
            </div>

            {/* Work Mode */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Preferred Work Mode
              </h2>

              <div className="flex gap-6 text-gray-700">

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="workMode"
                    value="Remote"
                    checked={formData.workMode === "Remote"}
                    onChange={handleChange}
                  />
                  Remote
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="workMode"
                    value="Work From Office"
                    checked={formData.workMode === "Work From Office"}
                    onChange={handleChange}
                  />
                  Office
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="workMode"
                    value="Hybrid"
                    checked={formData.workMode === "Hybrid"}
                    onChange={handleChange}
                  />
                  Hybrid
                </label>

              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Resume / CV
              </label>

              <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition">

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                  className="w-full text-sm text-gray-600"
                />

                <p className="text-xs text-gray-400 mt-2">
                  Upload PDF, DOC, or DOCX (max 5MB)
                </p>

              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
