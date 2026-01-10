import { Carousel } from "@/app/components/Carousel";
import Link from "next/link";
import Image from "next/image";
import { getStreamersData, idToSlug } from "@/app/lib/utils";

export const revalidate = 60;

export default async function Home() {
  const { streamers, videos } = await getStreamersData();

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section with Carousel */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                春和音-Harumonie
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              我们的歌声，是献给世界的一整个春天。
            </p>
          </div>

          {/* Carousel */}
          {videos && videos.length > 0 && (
            <div className="mb-16">
              <Carousel videos={videos} />
            </div>
          )}

          {/* Members Grid */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
              🌟 成员一览
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {streamers.map((streamer) => {
                const slug = idToSlug(streamer.id);
                return (
                  <Link
                    key={streamer.id}
                    href={`/${slug}`}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
                  >
                    {/* Banner */}
                    <div className="w-full h-40 relative overflow-hidden bg-gray-200 dark:bg-gray-700">
                      {streamer.banner && (
                        <Image
                          src={streamer.banner}
                          alt={`${streamer.name} banner`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>

                    {/* Card Content */}
                    <div className="p-4">
                      {/* Avatar */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 rounded-full flex-shrink-0 relative bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          {streamer.avatar ? (
                            <Image
                              src={streamer.avatar}
                              alt={`${streamer.name} avatar`}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div 
                              className="w-full h-full flex items-center justify-center text-white font-bold"
                              style={{
                                background: `linear-gradient(135deg, ${streamer.themeColors?.primary || '#8B5CF6'}, ${streamer.themeColors?.secondary || '#EC4899'})`
                              }}
                            >
                              {streamer.name.charAt(0)}
                            </div>
                          )}
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
                        <span>🎵 {streamer.playlistCount ?? 0} 个歌单</span>
                        <span>🎶 {streamer.songCount ?? 0} 首歌曲</span>
                      </div>

                      {/* Button */}
                      <button 
                        className="w-full py-2 px-4 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
                        style={{
                          background: `linear-gradient(to right, ${streamer.themeColors?.primary || '#8B5CF6'}, ${streamer.themeColors?.secondary || '#EC4899'})`
                        }}
                      >
                        查看详情
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>© 2026 Harumonie. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
