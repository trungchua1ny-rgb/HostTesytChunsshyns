import Navbar from "./Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
          © 2025 TimĐồngĐội. Kết nối tài năng - Xây dựng tương lai.
        </div>
      </footer>
    </div>
  );
}
