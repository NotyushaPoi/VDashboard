import { getAllStreamers } from "@/app/lib/utils";
import { Carousel } from "@/app/components/Carousel";
import Link from "next/link";

export const revalidate = 60; // 缓存60秒

export default async function Home() {
  const streamers = await getAllStreamers();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                VDashboard
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              欢迎来到主播展示平台！这里汇集了你喜爱主播的歌单、追番列表和直播信息。
            </p>
          </div>

          {/* Carousel */}
          <div className="mb-16">
            <Carousel streamers={streamers} />
          </div>

          {/* Streamers Grid */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
              🌟 推荐主播
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {streamers.map((streamer) => (
                <Link
                  key={streamer.id}
                  href={`/streamer/${streamer.id}`}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
                >
                  {/* Banner Placeholder */}
                  <div className="w-full h-40 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    <span className="text-white font-semibold text-center px-4">
                      {streamer.name}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    {/* Avatar Placeholder */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {streamer.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                          {streamer.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          粉丝: {streamer.fans}
                        </p>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {streamer.bio}
                    </p>

                    {/* Stats */}
                    <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <span>🎵 {streamer.playlists.length} 个歌单</span>
                      <span>📺 {streamer.animes.length} 个番剧</span>
                    </div>

                    {/* Button */}
                    <button className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow group-hover:from-purple-600 group-hover:to-pink-600">
                      查看详情
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 VDashboard. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
