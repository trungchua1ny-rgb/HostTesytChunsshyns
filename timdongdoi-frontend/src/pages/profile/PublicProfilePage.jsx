import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "../../components/layout/MainLayout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import userService from "../../services/userService";
import {
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  User,
  ArrowLeft,
  MessageSquare,
  Edit2,
  Building2,
  GraduationCap,
  FileText,
  AlertCircle,
} from "lucide-react";
import { getAvatarFallback } from "../../utils/helpers";
import { useAuth } from "../../contexts/AuthContext";

// ============================================
// CONSTANTS
// ============================================
const GENDER_LABELS = { male: "Nam", female: "Nữ", other: "Khác" };

const SKILL_LEVEL_COLORS = {
  beginner: "bg-gray-100 text-gray-600",
  intermediate: "bg-blue-50 text-blue-600",
  advanced: "bg-indigo-50 text-indigo-600",
  expert: "bg-purple-50 text-purple-600",
  junior: "bg-green-50 text-green-600",
  senior: "bg-orange-50 text-orange-600",
};

const SKILL_LEVEL_LABELS = {
  beginner: "Mới bắt đầu",
  intermediate: "Trung bình",
  advanced: "Nâng cao",
  expert: "Chuyên gia",
  junior: "Junior",
  senior: "Senior",
};

// ============================================
// MAIN PAGE
// ============================================
export default function PublicProfilePage() {
  const { id } = useParams();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const isOwnProfile = authUser && String(authUser.id) === String(id);

  // Fetch profile công khai — dùng endpoint GET /api/Users/{id}
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["publicProfile", id],
    queryFn: () =>
      userService.getPublicProfile(id).then((r) => r.data.data || r.data.Data),
    enabled: !!id,
  });

  // Nếu xem chính mình → fetch thêm skills/exp/edu từ endpoint /me
  const { data: skills = [] } = useQuery({
    queryKey: ["publicSkills", id],
    queryFn: () => userService.getMySkills().then((r) => r.data.data || []),
    enabled: isOwnProfile === true,
  });

  const { data: experiences = [] } = useQuery({
    queryKey: ["publicExperiences", id],
    queryFn: () =>
      userService
        .getExperiences()
        .then((r) => r.data.Data || r.data.data || []),
    enabled: isOwnProfile === true,
  });

  const { data: educations = [] } = useQuery({
    queryKey: ["publicEducations", id],
    queryFn: () =>
      userService.getEducations().then((r) => r.data.Data || r.data.data || []),
    enabled: isOwnProfile === true,
  });

  // Với profile người khác, dùng skills/exp/edu trong response profile nếu có
  const displaySkills = isOwnProfile ? skills : profile?.skills || [];
  const displayExperiences = isOwnProfile
    ? experiences
    : profile?.experiences || [];
  const displayEducations = isOwnProfile
    ? educations
    : profile?.educations || [];

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          <ArrowLeft size={14} /> Quay lại
        </button>

        {/* Loading */}
        {isLoading && <LoadingSpinner />}

        {/* Error */}
        {isError && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            <AlertCircle size={18} className="flex-shrink-0" />
            Không tìm thấy hồ sơ người dùng này.
          </div>
        )}

        {/* Profile content */}
        {!isLoading && !isError && profile && (
          <>
            {/* ---- HEADER ---- */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden flex-shrink-0">
                    {profile.avatar ? (
                      <img
                        src={`http://localhost:5024${profile.avatar}`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getAvatarFallback(profile.fullName)
                    )}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      {profile.fullName}
                    </h1>
                    {profile.jobTitle && (
                      <p className="text-sm text-blue-600 font-medium mt-0.5">
                        {profile.jobTitle}
                      </p>
                    )}
                    {profile.address && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <MapPin size={11} /> {profile.address}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isOwnProfile ? (
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
                    >
                      <Edit2 size={13} /> Chỉnh sửa
                    </Link>
                  ) : (
                    authUser && (
                      <Link
                        to={`/messages/${id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition shadow-sm"
                      >
                        <MessageSquare size={14} /> Nhắn tin
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* ---- GIỚI THIỆU ---- */}
            {profile.aboutMe && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-800 mb-3">
                  Giới thiệu
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {profile.aboutMe}
                </p>
              </div>
            )}

            {/* ---- THÔNG TIN ---- */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User size={16} className="text-blue-500" /> Thông tin
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow
                  icon={<Briefcase size={14} />}
                  label="Vị trí"
                  value={profile.jobTitle}
                />
                <InfoRow
                  icon={<DollarSign size={14} />}
                  label="Lương mong muốn"
                  value={
                    profile.salaryExpectation
                      ? `${Number(profile.salaryExpectation).toLocaleString("vi-VN")} VNĐ`
                      : null
                  }
                />
                <InfoRow
                  icon={<Calendar size={14} />}
                  label="Ngày sinh"
                  value={
                    profile.birthday
                      ? new Date(profile.birthday).toLocaleDateString("vi-VN")
                      : null
                  }
                />
                <InfoRow
                  icon={<User size={14} />}
                  label="Giới tính"
                  value={GENDER_LABELS[profile.gender]}
                />
                <InfoRow
                  icon={<MapPin size={14} />}
                  label="Địa chỉ"
                  value={profile.address}
                />
                {profile.cvFile && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1">
                      <span className="text-gray-300">
                        <FileText size={14} />
                      </span>{" "}
                      CV
                    </p>
                    <a
                      href={`http://localhost:5024${profile.cvFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline font-medium"
                    >
                      Xem CV
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* ---- KỸ NĂNG ---- */}
            {displaySkills.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Briefcase size={16} className="text-blue-500" /> Kỹ năng
                </h2>
                <div className="flex flex-wrap gap-2">
                  {displaySkills.map((skill) => {
                    const level = skill.level?.toLowerCase() || "beginner";
                    return (
                      <div
                        key={skill.id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-xl shadow-sm"
                      >
                        <span className="text-sm font-medium text-gray-800">
                          {skill.skillName}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${SKILL_LEVEL_COLORS[level] || "bg-gray-100 text-gray-600"}`}
                        >
                          {SKILL_LEVEL_LABELS[level] || level}
                        </span>
                        {skill.yearsExperience && (
                          <span className="text-xs text-gray-400">
                            {skill.yearsExperience} năm
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---- KINH NGHIỆM ---- */}
            {displayExperiences.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Building2 size={16} className="text-blue-500" /> Kinh nghiệm
                  làm việc
                </h2>
                <div className="space-y-4">
                  {displayExperiences.map((exp) => (
                    <div key={exp.id} className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Building2 size={16} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {exp.position}
                        </p>
                        <p className="text-sm text-blue-600">
                          {exp.companyName}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {exp.startDate
                            ? new Date(exp.startDate).toLocaleDateString(
                                "vi-VN",
                                { month: "2-digit", year: "numeric" },
                              )
                            : ""}
                          {" → "}
                          {exp.isCurrent
                            ? "Hiện tại"
                            : exp.endDate
                              ? new Date(exp.endDate).toLocaleDateString(
                                  "vi-VN",
                                  { month: "2-digit", year: "numeric" },
                                )
                              : ""}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---- HỌC VẤN ---- */}
            {displayEducations.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <GraduationCap size={16} className="text-indigo-500" /> Học
                  vấn
                </h2>
                <div className="space-y-4">
                  {displayEducations.map((edu) => (
                    <div key={edu.id} className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <GraduationCap size={16} className="text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {edu.schoolName}
                        </p>
                        <p className="text-sm text-indigo-600">
                          {[edu.degree, edu.major].filter(Boolean).join(" - ")}
                        </p>
                        {(edu.startYear || edu.endYear) && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {edu.startYear} — {edu.endYear || "Hiện tại"}
                          </p>
                        )}
                        {edu.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}

function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1">
        <span className="text-gray-300">{icon}</span> {label}
      </p>
      <p className="text-sm text-gray-800 font-medium">{value}</p>
    </div>
  );
}
    