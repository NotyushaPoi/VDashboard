import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-900 mb-4">页面未找到</p>
        <p className="text-gray-600 mb-8">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <Link
          href="/home"
          className="inline-block px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
        >
          返回首页
        </Link>
      </div>
    </main>
  );
}
