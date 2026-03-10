import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, BriefcaseBusiness } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import JobCard from "../../components/job/JobCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import  {jobService } from "../../services/jobService";

export default function SavedJobsPage() {
  const queryClient = useQueryClient();

  // 1. Lấy danh sách job đã lưu
  const { data, isLoading } = useQuery({
    queryKey: ["saved-jobs"],
    // API trả về mảng trực tiếp hoặc bọc trong .data tùy theo Backend
    queryFn: () => jobService.getSavedJobs().then((r) => r.data),
  });

  // 2. Xử lý bỏ lưu (Unsave) ngay tại trang này
  const unsaveMutation = useMutation({
    mutationFn: (jobId) => jobService.unsaveJob(jobId),
    onSuccess: () => {
      // Làm mới danh sách sau khi bỏ lưu thành công
      queryClient.invalidateQueries(["saved-jobs"]);
    },
  });

  const savedJobs = data?.data || []; // Bóc tách mảng jobs từ JSON trả về

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Heart className="text-red-500 fill-red-500" size={24} />
            Việc làm đã lưu
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {savedJobs.length} công việc bạn đã quan tâm
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : savedJobs.length === 0 ? (
          <EmptyState
            icon={<Heart size={64} className="text-gray-200" />}
            title="Chưa có việc làm nào được lưu"
            description="Hãy lưu lại những công việc phù hợp để xem lại và ứng tuyển sau"
            action={
              <Link
                to="/jobs"
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md text-sm"
              >
                Khám phá việc làm ngay
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={true} // Chắc chắn là true vì đang ở trang Saved
                onSave={(id) => unsaveMutation.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
