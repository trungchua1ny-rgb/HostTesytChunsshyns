import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MainLayout from "../../components/layout/MainLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  RotateCcw,
  Loader2,
  Briefcase,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

// ============================================
// CONSTANTS
// ============================================
const STATUS_TABS = [
  { value: "", label: "Tất cả" },
  { value: "open", label: "Đang tuyển" },
  { value: "draft", label: "Nháp" },
  { value: "closed", label: "Đã đóng" },
];

const STATUS_COLORS = {
  active: "bg-green-50 text-green-600",
  draft: "bg-gray-100 text-gray-500",
  closed: "bg-red-50 text-red-500",
  open: "bg-green-50 text-green-600",
};

const STATUS_LABELS = {
  active: "Đang tuyển",
  draft: "Nháp",
  closed: "Đã đóng",
  open: "Đang tuyển",
};

const JOB_TYPE_LABELS = {
  "full-time": "Toàn thời gian",
  "part-time": "Bán thời gian",
  contract: "Hợp đồng",
  internship: "Thực tập",
  freelance: "Freelance",
};

const jobService = {
  getMyJobs: (params) => api.get("/jobs/my", { params }),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  closeJob: (id) => api.put(`/jobs/${id}/close`),
  reopenJob: (id) => api.put(`/jobs/${id}/reopen`),
  publishJob: (id) => api.put(`/jobs/${id}/publish`),
  cloneJob: (id) => api.post(`/jobs/${id}/clone`),
};

// ============================================
// JOB CARD
// ============================================
function JobCard({
  job,
  onDelete,
  onToggleStatus,
  onClone,
  onPublish,
  isProcessing,
}) {
  const status = job.status?.toLowerCase();
  const hasApplications = (job.applicationCount || 0) > 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Link
              to={`/jobs/${job.id}`}
              className="text-base font-bold text-gray-900 hover:text-blue-600 transition truncate"
            >
              {job.title}
            </Link>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUS_COLORS[status] || "bg-gray-100 text-gray-500"}`}
            >
              {STATUS_LABELS[status] || status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3">
            {job.location && <span>{job.location}</span>}
            {job.type && <span>{JOB_TYPE_LABELS[job.type] || job.type}</span>}
            {job.salaryMin && job.salaryMax && (
              <span className="text-green-600 font-medium">
                {Number(job.salaryMin).toLocaleString("vi-VN")}đ —{" "}
                {Number(job.salaryMax).toLocaleString("vi-VN")}đ
              </span>
            )}
            {job.deadline && (
              <span
                className={
                  new Date(job.deadline) < new Date() ? "text-red-400" : ""
                }
              >
                Hạn: {new Date(job.deadline).toLocaleDateString("vi-VN")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link
              to={`/company/jobs/${job.id}/applications`}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition"
            >
              <Users size={13} />{" "}
              <span className="font-medium">{job.applicationCount || 0}</span>{" "}
              ứng viên
            </Link>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Eye size={13} /> {job.viewCount || 0} lượt xem
            </span>
            <span className="text-xs text-gray-400">
              Đăng{" "}
              {job.createdAt
                ? new Date(job.createdAt).toLocaleDateString("vi-VN")
                : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <Link
            to={`/company/jobs/${job.id}/edit`}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
          >
            <Edit2 size={15} />
          </Link>

          <button
            onClick={() => onClone(job.id)}
            disabled={isProcessing}
            className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition"
            title="Sao chép"
          >
            <Copy size={15} />
          </button>

          {status === "draft" && (
            <button
              onClick={() => onPublish(job.id)}
              disabled={isProcessing}
              className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition"
              title="Đăng tin"
            >
              <Eye size={15} />
            </button>
          )}

          {status === "active" || status === "open" ? (
            <button
              onClick={() => onToggleStatus(job.id, "close")}
              disabled={isProcessing}
              className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition"
              title="Đóng tin"
            >
              <EyeOff size={15} />
            </button>
          ) : status === "closed" ? (
            <button
              onClick={() => onToggleStatus(job.id, "reopen")}
              disabled={isProcessing}
              className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition"
              title="Mở lại"
            >
              <RotateCcw size={15} />
            </button>
          ) : null}

          {/* ✅ NÚT XÓA TRỰC QUAN */}
          <button
            onClick={() => onDelete(job.id)}
            disabled={isProcessing}
            className={`p-2 transition rounded-lg ${
              hasApplications
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-400 hover:text-red-500 hover:bg-red-50"
            }`}
            title={
              hasApplications
                ? "Tin đã có ứng viên - Khuyên dùng 'Đóng tin' để dừng tuyển"
                : "Xóa tin tuyển dụng"
            }
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function ManageJobsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["myJobs", statusFilter],
    queryFn: () =>
      jobService
        .getMyJobs({ status: statusFilter || undefined, pageSize: 50 })
        .then((r) => r.data),
  });

  const jobs = data?.Data || data?.data || [];
  const filtered = jobs.filter(
    (j) => !search || j.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    total: jobs.length,
    active: jobs.filter((j) => j.status === "open").length,
    draft: jobs.filter((j) => j.status === "draft").length,
    closed: jobs.filter((j) => j.status === "closed").length,
    totalApplications: jobs.reduce((s, j) => s + (j.applicationCount || 0), 0),
  };

  // ✅ CẬP NHẬT MUTATION XÓA ĐỂ BẮT LỖI TRỰC QUAN
  const deleteMutation = useMutation({
    mutationFn: (id) => jobService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["myJobs"]);
      toast.success("Đã xóa tin tuyển dụng thành công");
      setProcessingId(null);
    },
    onError: (err) => {
      const backendMessage =
        err.response?.data?.Message || err.response?.data?.message || "";

      // Kiểm tra lỗi ràng buộc khóa ngoại (Association)
      if (
        backendMessage.includes("association") ||
        backendMessage.includes("Application") ||
        backendMessage.includes("hồ sơ")
      ) {
        toast.error(
          "Không thể xóa vì tin này đã có hồ sơ ứng tuyển. Hãy sử dụng chức năng 'Đóng tin' để ngừng tuyển dụng mà vẫn giữ được lịch sử.",
          { duration: 6000 },
        );
      } else {
        toast.error(backendMessage || "Xóa tin tuyển dụng thất bại");
      }
      setProcessingId(null);
    },
  });

  const closeMutation = useMutation({
    mutationFn: (id) => jobService.closeJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["myJobs"]);
      toast.success("Đã đóng tin tuyển dụng");
      setProcessingId(null);
    },
    onError: () => {
      toast.error("Đóng tin thất bại");
      setProcessingId(null);
    },
  });

  const reopenMutation = useMutation({
    mutationFn: (id) => jobService.reopenJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["myJobs"]);
      toast.success("Đã mở lại tin tuyển dụng");
      setProcessingId(null);
    },
    onError: () => {
      toast.error("Mở lại tin thất bại");
      setProcessingId(null);
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id) => jobService.publishJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["myJobs"]);
      toast.success("Đã đăng tin tuyển dụng!");
      setProcessingId(null);
    },
    onError: () => {
      toast.error("Đăng tin thất bại");
      setProcessingId(null);
    },
  });

  const cloneMutation = useMutation({
    mutationFn: (id) => jobService.cloneJob(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["myJobs"]);
      toast.success("Đã sao chép tin!");
      setProcessingId(null);
      const job = res.data.Data || res.data.data;
      if (job?.id) navigate(`/company/jobs/${job.id}/edit`);
    },
    onError: () => {
      toast.error("Sao chép thất bại");
      setProcessingId(null);
    },
  });

  const handleDelete = (id) => {
    if (!window.confirm("Xác nhận xóa tin tuyển dụng này vĩnh viễn?")) return;
    setProcessingId(id);
    deleteMutation.mutate(id);
  };

  const handleToggleStatus = (id, action) => {
    setProcessingId(id);
    if (action === "close") closeMutation.mutate(id);
    else reopenMutation.mutate(id);
  };

  const handleClone = (id) => {
    setProcessingId(id);
    cloneMutation.mutate(id);
  };
  const handlePublish = (id) => {
    setProcessingId(id);
    publishMutation.mutate(id);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Quản lý tin tuyển dụng
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Quản lý tất cả tin đăng tuyển của công ty
            </p>
          </div>
          <Link
            to="/company/jobs/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-sm text-sm"
          >
            <Plus size={16} /> Đăng tin mới
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Tổng tin", value: stats.total, color: "text-gray-900" },
            {
              label: "Đang tuyển",
              value: stats.active,
              color: "text-green-600",
            },
            { label: "Nháp", value: stats.draft, color: "text-gray-500" },
            { label: "Đã đóng", value: stats.closed, color: "text-red-500" },
            {
              label: "Tổng ứng viên",
              value: stats.totalApplications,
              color: "text-blue-600",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm"
            >
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Tìm kiếm tin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition ${statusFilter === tab.value ? "bg-blue-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Job list */}
        {isLoading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <Briefcase size={32} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">
              Chưa có tin tuyển dụng nào
            </p>
            <p className="text-sm text-gray-400 mt-1 mb-5">
              Bắt đầu đăng tin để tìm ứng viên phù hợp
            </p>
            <Link
              to="/company/jobs/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition"
            >
              <Plus size={14} /> Đăng tin ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                onClone={handleClone}
                onPublish={handlePublish}
                isProcessing={processingId === job.id}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
