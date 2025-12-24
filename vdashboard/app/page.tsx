import { Carousel } from "@/app/components/Carousel";
import Link from "next/link";
import { getStreamersData } from "@/app/lib/utils";

interface VideoDisplayProps {
  videos: Array<{
    title: string;
    cover: string;
    videoUrl: string;
  }>;
}

function VideoDisplay({ videos }: VideoDisplayProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <a
        href={videos[0]?.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block w-full aspect-video rounded-2xl overflow-hidden shadow-lg group"
      >
        <div className="absolute inset-0 bg-linear-to-br from-purple-400 via-pink-400 to-purple-500 flex items-center justify-center">
          <img
            src={videos[0]?.cover}
            alt={videos[0]?.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="absolute left-4 bottom-4 bg-black/70 text-white text-base px-4 py-2 rounded-lg shadow">
          {videos[0]?.title}
        </div>
      </a>
    </div>
  );
}

export const revalidate = 60;

export default async function Home() {
  const { streamers, videos } = await getStreamersData();

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section with 投稿视频轮播 */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                🌿春和音-Harumonie🌿
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              我们的歌声，是献给世界的一整个春天。
            </p>
          </div>

          {/* 投稿视频图片展示 */}
          {videos && videos.length > 0 && (
            <div className="mb-16">
              <VideoDisplay videos={videos} />
            </div>
          )}

          {/* 成员一览 */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
              🌟 成员一览
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {streamers.map((streamer) => (
                <Link
                  key={streamer.id}
                  href={`/streamer/${streamer.id}`}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
                >
                  {/* Banner Placeholder */}
                  <div className="w-full h-40 bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    <span className="text-white font-semibold text-center px-4">
                      {streamer.name}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    {/* Avatar Placeholder */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-300 to-pink-300 flex items-center justify-center text-white font-bold shrink-0">
                        {streamer.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                          {streamer.name}
                        </h3>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {streamer.bio}
                    </p>

                    {/* Stats */}
                    <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <span>🎵 {streamer.playlists.length} 个歌单</span>
                    </div>

                    {/* Button */}
                    <button className="w-full py-2 px-4 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow group-hover:from-purple-600 group-hover:to-pink-600">
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
          <p>© 2025 VDashboard. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
