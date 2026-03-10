import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute, RoleRoute } from "./components/layout/ProtectedRoute";
import { Toaster } from "react-hot-toast";

// Pages - Projects
import MyProjectApplicationsPage from "./pages/projects/MyProjectApplicationsPage";
import CreateProjectPage from "./pages/projects/CreateProjectPage";
import EditProjectPage from "./pages/projects/EditProjectPage";
import ManageProjectPage from "./pages/projects/ManageProjectPage";

// Pages - Auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Pages - Public
import HomePage from "./pages/HomePage";
import JobListPage from "./pages/jobs/JobListPage";
import JobDetailPage from "./pages/jobs/JobDetailPage";
import JobSearchPage from "./pages/jobs/JobSearchPage";
// Sửa dòng này (đổi Search thành search)
import CompanySearchPage from "./pages/company/Companysearchpage";
import PublicCompanyPage from "./pages/company/PublicCompanyPage";
import ProjectListPage from "./pages/projects/ProjectListPage";
import ProjectDetailPage from "./pages/projects/ProjectDetailPage";
import PublicProfilePage from "./pages/profile/PublicProfilePage";

// Pages - User
import ProfilePage from "./pages/profile/ProfilePage";
import MyApplicationsPage from "./pages/jobs/MyApplicationsPage";
import ApplicationDetailPage from "./pages/jobs/ApplicationDetailPage";
import SavedJobsPage from "./pages/jobs/SavedJobsPage";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import MessagesPage from "./pages/messages/MessagesPage";

// Pages - Company
import CompanyProfilePage from "./pages/company/CompanyProfilePage";
import ManageJobsPage from "./pages/company/ManageJobsPage";
import PostJobPage from "./pages/company/PostJobPage";
import ManageApplicationsPage from "./pages/company/ManageApplicationsPage";

// Pages - Admin
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminCompaniesPage from "./pages/admin/AdminCompaniesPage";
import AdminJobsPage from "./pages/admin/AdminJobsPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" />
        <BrowserRouter>
          <Routes>
            {/* ==========================================
                1. PUBLIC ROUTES (Ai cũng vào được)
                ========================================== */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/jobs" element={<JobListPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/job-search" element={<JobSearchPage />} />
            <Route path="/companies" element={<CompanySearchPage />} />
            <Route path="/companies/:id" element={<PublicCompanyPage />} />
            <Route path="/projects" element={<ProjectListPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/profile/:id" element={<PublicProfilePage />} />

            {/* ==========================================
                2. USER ROUTES (Bắt buộc phải đăng nhập)
                ========================================== */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-applications" element={<MyApplicationsPage />} />
              <Route
                path="/my-applications/:id"
                element={<ApplicationDetailPage />}
              />
              <Route path="/saved-jobs" element={<SavedJobsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/messages/:userId" element={<MessagesPage />} />
              <Route
                path="/projects/:id/manage"
                element={<ManageProjectPage />}
              />
              <Route path="/projects/create" element={<CreateProjectPage />} />
              <Route path="/projects/:id/edit" element={<EditProjectPage />} />
              <Route
                path="/my-project-applications"
                element={<MyProjectApplicationsPage />}
              />
            </Route>

            {/* ==========================================
                3. COMPANY ROUTES (Chỉ vai trò Company)
                ========================================== */}
            <Route element={<RoleRoute roles={["company"]} />}>
              <Route path="/company/profile" element={<CompanyProfilePage />} />
              <Route path="/company/jobs" element={<ManageJobsPage />} />
              <Route path="/company/jobs/new" element={<PostJobPage />} />
              <Route path="/company/jobs/:id/edit" element={<PostJobPage />} />
              <Route
                path="/company/applications"
                element={<ManageApplicationsPage />}
              />
              <Route
                path="/company/jobs/:jobId/applications"
                element={<ManageApplicationsPage />}
              />
            </Route>

            {/* ==========================================
                4. ADMIN ROUTES (Chỉ vai trò Admin)
                ========================================== */}
            <Route element={<RoleRoute roles={["admin"]} />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/companies" element={<AdminCompaniesPage />} />
              <Route path="/admin/jobs" element={<AdminJobsPage />} />
              <Route path="/admin/reports" element={<AdminReportsPage />} />
            </Route>

            {/* ==========================================
                5. CATCH ALL
                ========================================== */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
