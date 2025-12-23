import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          页面未找到
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          抱歉，你访问的主播不存在或页面已删除。
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg transition-shadow"
        >
          返回首页
        </Link>
      </div>
    </main>
  );
}
