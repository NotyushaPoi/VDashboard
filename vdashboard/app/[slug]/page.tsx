import {
  getStreamerById,
  getAllStreamers,
  slugToId,
  getStreamerThemeColors,
} from "@/app/lib/utils";
import { TabPanel } from "@/app/components/TabPanel";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface StreamerPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: StreamerPageProps) {
  const { slug } = await params;
  const id = slugToId(slug);

  if (!id) {
    return {
      title: "主播不存在",
    };
  }

  const streamer = await getStreamerById(id);

  if (!streamer) {
    return {
      title: "主播不存在",
    };
  }

  return {
    title: `${streamer.name} - Harumonie`,
    description: streamer.bio,
  };
}

export async function generateStaticParams() {
  const streamers = await getAllStreamers();
  return streamers.map((streamer) => ({
    slug: streamer.id === 1 ? "kirara" :
          streamer.id === 2 ? "yvainne" :
          streamer.id === 3 ? "choco" :
          streamer.id === 4 ? "sakura" :
          streamer.id === 5 ? "qoo" :
          "asaritsu",
  }));
}

export default async function StreamerPage({ params }: StreamerPageProps) {
  const { slug } = await params;
  const id = slugToId(slug);

  if (!id) {
    notFound();
  }

  const streamer = await getStreamerById(id);

  if (!streamer) {
    notFound();
  }

  const themeColors = getStreamerThemeColors(id);
  const biliBiliSpaceUrl = streamer.bilibiliSpaceUrl || `https://space.bilibili.com/${streamer.bilibiliId}`;
  const biliBiliLiveUrl = streamer.liveUrl || `https://live.bilibili.com/${streamer.bilibiliId}`;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Banner */}
      <div className="relative w-full h-80 md:h-96 flex items-center justify-center overflow-hidden bg-gray-200 dark:bg-gray-700">
        {streamer.banner ? (
          <Image
            src={streamer.banner}
            alt={`${streamer.name} banner`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: themeColors
                ? `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.secondary} 100%)`
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/0" />

        {/* Left Button - B站主页 */}
        <a
          href={biliBiliSpaceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-0 top-0 w-1/2 h-full flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors group cursor-pointer z-10"
          title="进入B站主页"
        >
          <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="text-4xl mb-2">👤</div>
            <p className="text-white font-bold">B站主页</p>
          </div>
        </a>

        {/* Center Content - Empty for now, banner speaks for itself */}

        {/* Right Button - 直播间 */}
        <a
          href={biliBiliLiveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors group cursor-pointer z-10"
          title="进入直播间"
        >
          <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="text-4xl mb-2">📡</div>
            <p className="text-white font-bold">进入直播</p>
          </div>
        </a>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with Info */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
          {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
                {streamer.avatar ? (
                  <Image
                    src={streamer.avatar}
                    alt={`${streamer.name} avatar`}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white text-4xl font-bold"
                    style={{
                      background: themeColors
                        ? `linear-gradient(135deg, ${themeColors.primary} 0%, ${themeColors.secondary} 100%)`
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  >
                    {streamer.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {streamer.name}
              </h2>
              <div className="flex gap-4 mb-4 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  UID: {streamer.bilibiliId}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {streamer.bio}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {streamer.description}
              </p>

              {/* Buttons with theme color */}
              <div className="flex gap-3 flex-wrap mb-6">
                <a
                  href={biliBiliSpaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-white font-semibold rounded-lg transition-colors text-sm hover:opacity-80"
                  style={{
                    backgroundColor: themeColors?.primary || "#3b82f6",
                  }}
                  title="访问 B 站主页"
                >
                  📺 B站主页
                </a>
                <a
                  href={biliBiliLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-white font-semibold rounded-lg transition-colors text-sm hover:opacity-80"
                  style={{
                    backgroundColor: themeColors?.secondary || "#a855f7",
                  }}
                  title="进入直播间"
                >
                  🎬 直播间
                </a>
                <a
                  href={streamer.cloudMusicUrl || "https://music.163.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm"
                  title="访问网易云音乐"
                >
                  🎵 网易云
                </a>
                <a
                  href={streamer.redUrl || "https://www.xiaohongshu.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-colors text-sm"
                  title="访问小红书"
                >
                  ❤️ 小红书
                </a>
                <Link
                  href="/home"
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  ← 返回首页
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-200 dark:border-gray-700 my-12" />

        {/* Tab Panel */}
        <TabPanel playlists={streamer.playlists || []} />
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-8 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900 mt-12">
        <div className="max-w-6xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>© 2026 Harumonie. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
