import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  FileText,
  Download,
  Building2,
  Calendar,
} from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { jobService } from "../../services/jobService";
import { formatDate } from "../../utils/helpers";

export default function ApplicationDetailPage() {
  const { id } = useParams();

  const { data: response, isLoading } = useQuery({
    queryKey: ["application", id],
    queryFn: () => jobService.getApplicationById(id).then((r) => r.data),
  });

  const app = response?.data;

  if (isLoading)
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  if (!app)
    return (
      <MainLayout>
        <div className="text-center py-20">Không tìm thấy đơn ứng tuyển</div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/my-applications"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6"
        >
          <ArrowLeft size={16} /> Quay lại danh sách đơn
        </Link>

        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {app.job?.title}
                </h1>
                <p className="text-blue-600 font-medium mt-1">
                  {app.job?.companyName}
                </p>
              </div>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm ${getStatusStyle(app.status)}`}
              >
                {app.status}
              </span>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Thông tin chung */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar size={20} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">
                    Ngày nộp
                  </p>
                  <p className="font-medium">{formatDate(app.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <FileText size={20} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold">
                    Loại hồ sơ
                  </p>
                  <p className="font-medium">Online CV</p>
                </div>
              </div>
            </div>

            {/* Thư giới thiệu */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Thư giới thiệu (Cover Letter)
              </h3>
              <div className="bg-gray-50 rounded-2xl p-6 text-gray-700 leading-relaxed whitespace-pre-line border border-gray-100">
                {app.coverLetter ||
                  "Bạn không đính kèm thư giới thiệu cho đơn này."}
              </div>
            </div>

            {/* CV Đính kèm */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Tệp đính kèm
              </h3>
              {app.cvFile ? (
                <a
                  href={`http://localhost:5024${app.cvFile}`}
                  target="_blank"
                  className="flex items-center justify-between p-4 bg-white border-2 border-dashed border-blue-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">
                        Curriculum Vitae (CV)
                      </p>
                      <p className="text-xs text-gray-400">
                        Xem hoặc tải xuống bản gốc
                      </p>
                    </div>
                  </div>
                  <Download
                    size={20}
                    className="text-gray-400 group-hover:text-blue-600 mr-2"
                  />
                </a>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  Không có file đính kèm
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function getStatusStyle(status) {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "accepted":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-blue-100 text-blue-700";
  }
}
