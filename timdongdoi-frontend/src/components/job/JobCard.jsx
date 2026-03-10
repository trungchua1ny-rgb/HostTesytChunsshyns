import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { formatSalary, formatTimeAgo } from "../../utils/helpers";
import { JOB_TYPES, JOB_LEVELS } from "../../utils/constants";

export default function JobCard({ job, onSave, isSaved = false }) {
  const jobType =
    JOB_TYPES.find((t) => t.value === job.type)?.label || job.type;
  const jobLevel =
    JOB_LEVELS.find((l) => l.value === job.level)?.label || job.level;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-5 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Company logo */}
          <div className="w-12 h-12 rounded-xl border border-gray-100 overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center">
            {job.companyLogo ? (
              <img
                src={`http://localhost:5024${job.companyLogo}`}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <Briefcase size={20} className="text-gray-300" />
            )}
          </div>
          <div className="min-w-0">
            <Link
              to={`/jobs/${job.id}`}
              className="font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-1 group-hover:text-blue-600"
            >
              {job.title}
            </Link>
            <p className="text-sm text-gray-500 truncate">{job.companyName}</p>
          </div>
        </div>

        {/* Save button */}
        {onSave && (
          <button
            onClick={() => onSave(job.id)}
            className={`p-1.5 rounded-lg transition-colors shrink-0
              ${isSaved ? "text-blue-500 hover:text-blue-700" : "text-gray-300 hover:text-gray-500"}`}
          >
            {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          </button>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {jobType && (
          <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
            {jobType}
          </span>
        )}
        {jobLevel && (
          <span className="px-2.5 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded-full">
            {jobLevel}
          </span>
        )}
        {job.locationType && (
          <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
            {job.locationType === "remote"
              ? "Remote"
              : job.locationType === "hybrid"
                ? "Hybrid"
                : "Tại VP"}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1.5 mb-4">
        {job.location && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={14} className="shrink-0 text-gray-400" />
            <span className="truncate">{job.location}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <DollarSign size={14} className="shrink-0 text-gray-400" />
          <span className="font-medium text-gray-700">
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Clock size={12} />
          {formatTimeAgo(job.createdAt)}
        </span>
        <Link
          to={`/jobs/${job.id}`}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Xem chi tiết →
        </Link>
      </div>
    </div>
  );
}
