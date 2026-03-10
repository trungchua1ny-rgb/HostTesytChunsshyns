import { useState } from "react"; // ✅ Thêm useState
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BriefcaseBusiness,
  Calendar,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import MainLayout from "../../components/layout/MainLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import ConfirmModal from "../../components/common/ConfirmModal"; // ✅ Import Modal mới
import { jobService } from "../../services/jobService";
import { formatDate } from "../../utils/helpers";

export default function MyApplicationsPage() {
  const queryClient = useQueryClient();
  const [selectedAppId, setSelectedAppId] = useState(null); // ✅ Quản lý ID đơn muốn rút

  // 1. Lấy danh sách đơn ứng tuyển (GET /api/applications/my)
  const { data: response, isLoading } = useQuery({
    queryKey: ["my-applications"],
    queryFn: () => jobService.getMyApplications().then((r) => r.data),
  });

  // 2. Xử lý Rút đơn ứng tuyển (DELETE /api/applications/{id})
  const withdrawMutation = useMutation({
    mutationFn: (id) => jobService.withdrawApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["my-applications"]);
      toast.success("Đã rút đơn ứng tuyển thành công");
      setSelectedAppId(null); // ✅ Đóng modal sau khi thành công
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Không thể rút đơn lúc này");
    },
  });

  const applications = response?.data || [];

  if (isLoading)
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Đơn ứng tuyển của tôi
        </h1>

        {applications.length === 0 ? (
          <EmptyState
            icon={<BriefcaseBusiness size={64} className="text-gray-200" />}
            title="Chưa có đơn ứng tuyển"
            description="Bạn chưa nộp đơn vào công việc nào."
            action={
              <Link
                to="/jobs"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold"
              >
                Tìm việc ngay
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gray-50 border flex items-center justify-center shrink-0">
                      {app.job?.companyLogo ? (
                        <img
                          src={`http://localhost:5024${app.job.companyLogo}`}
                          alt=""
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <BriefcaseBusiness className="text-gray-300" />
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-800">
                        {app.job?.title || "Vị trí tuyển dụng"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {app.job?.companyName}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="text-gray-400">
                          Ngày nộp: {formatDate(app.createdAt)}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-medium ${getStatusStyle(app.status)}`}
                        >
                          {app.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/my-applications/${app.id}`}
                      className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      Xem chi tiết
                    </Link>

                    {/* Nút Rút đơn */}
                    {app.status?.toLowerCase() === "pending" && (
                      <button
                        onClick={() => setSelectedAppId(app.id)} // ✅ Mở modal thay vì window.confirm
                        disabled={withdrawMutation.isPending}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Rút đơn"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}

                    <Link
                      to={`/jobs/${app.jobId}`}
                      className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg"
                      title="Xem bài đăng tuyển dụng"
                    >
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Confirm Modal hiện đại thay thế cho image_e45c8a.png */}
        <ConfirmModal
          isOpen={!!selectedAppId}
          onClose={() => setSelectedAppId(null)}
          onConfirm={() => withdrawMutation.mutate(selectedAppId)}
          title="Xác nhận rút đơn"
          message="Hành động này không thể hoàn tác. Bạn có chắc chắn muốn rút hồ sơ khỏi vị trí này?"
          isLoading={withdrawMutation.isPending}
        />
      </div>
    </MainLayout>
  );
}

function getStatusStyle(status) {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-50 text-yellow-600";
    case "reviewed":
      return "bg-blue-50 text-blue-600";
    case "accepted":
      return "bg-green-50 text-green-600";
    case "rejected":
      return "bg-red-50 text-red-600";
    default:
      return "bg-gray-50 text-gray-600";
  }
}
