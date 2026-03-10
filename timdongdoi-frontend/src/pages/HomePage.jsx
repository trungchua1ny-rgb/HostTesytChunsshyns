import MainLayout from "../components/layout/MainLayout";

export default function HomePage() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Tìm việc làm &{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            đồng đội
          </span>
        </h1>
        <p className="text-gray-500 text-xl mb-8">
          Kết nối hàng nghìn cơ hội việc làm và dự án startup
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href="/jobs"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-md"
          >
            Tìm việc ngay
          </a>
          <a
            href="/projects"
            className="px-6 py-3 border-2 border-blue-500 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition"
          >
            Tìm đồng đội
          </a>
        </div>
      </div>
    </MainLayout>
  );
}
