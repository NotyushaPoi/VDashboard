import { getStreamerById, getAllStreamers } from "@/app/lib/utils";
import { TabPanel } from "@/app/streamer/components/TabPanel";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface StreamerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: StreamerPageProps) {
  const { id } = await params;
  const streamer = await getStreamerById(parseInt(id));

  if (!streamer) {
    return {
      title: "主播不存在",
    };
  }

  return {
    title: `${streamer.name} - VDashboard`,
    description: streamer.bio,
  };
}

export async function generateStaticParams() {
  const streamers = await getAllStreamers();
  return streamers.map((streamer) => ({
    id: streamer.id.toString(),
  }));
}

export default async function StreamerPage({ params }: StreamerPageProps) {
  const { id } = await params;
  const streamer = await getStreamerById(parseInt(id));

  if (!streamer) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Banner */}
      <div className="relative w-full h-80 md:h-96 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden">
        {/* Banner Content Placeholder */}
        <div className="absolute inset-0 bg-black/0" />
        <a
          href={streamer.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 text-white text-center"
        >
          <div className="text-6xl font-bold mb-4">🎬</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{streamer.name}</h1>
          <p className="text-lg text-white/90 mb-6">点击进入直播间</p>
          <button className="px-8 py-3 bg-white text-purple-600 font-bold rounded-lg hover:shadow-lg transition-shadow">
            进入直播 →
          </button>
        </a>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with Info */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center text-white text-4xl font-bold">
                {streamer.name.charAt(0)}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {streamer.name}
              </h2>
              <div className="flex gap-4 mb-4 text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  👥 粉丝: {streamer.fans}
                </span>
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

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                <a
                  href={streamer.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg transition-shadow"
                >
                  🎬 进入直播间
                </a>
                <Link
                  href="/"
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
        <TabPanel playlists={streamer.playlists} animes={streamer.animes} />
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-8 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900 mt-12">
        <div className="max-w-6xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 VDashboard. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
