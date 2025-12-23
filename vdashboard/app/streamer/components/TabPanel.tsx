"use client";

import { useState } from "react";
import { Playlist, Anime } from "@/app/lib/types";
import { CopyButton } from "@/app/components/CopyButton";
import { LyricsModal } from "@/app/components/LyricsModal";

interface TabPanelProps {
  playlists: Playlist[];
  animes: Anime[];
}

export function TabPanel({ playlists, animes }: TabPanelProps) {
  const [activeTab, setActiveTab] = useState<"playlists" | "animes">("playlists");
  const [selectedSong, setSelectedSong] = useState<{
    name: string;
    artist: string;
    lyrics: string;
  } | null>(null);

  const tabs = [
    { id: "playlists", label: `🎵 歌单 (${playlists.length})` },
    { id: "animes", label: `📺 追番 (${animes.length})` },
  ];

  return (
    <div className="w-full">
      {/* Tab Buttons */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Playlists Tab */}
      {activeTab === "playlists" && (
        <div className="space-y-6">
          {playlists.map((playlist, index) => (
            <div key={index}>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {playlist.name}
              </h3>
              <div className="space-y-3">
                {playlist.songs.map((song, songIndex) => (
                  <div
                    key={songIndex}
                    className="flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <a
                        href={song.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 dark:text-white font-semibold hover:text-purple-600 dark:hover:text-purple-400 break-words"
                      >
                        {song.name}
                      </a>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {song.artist} · {song.genre}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() =>
                          setSelectedSong({
                            name: song.name,
                            artist: song.artist,
                            lyrics: song.lyrics,
                          })
                        }
                        className="px-3 py-1 rounded text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        title="显示歌词"
                      >
                        歌词
                      </button>
                      <CopyButton text={song.name} label="复制" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Animes Tab */}
      {activeTab === "animes" && (
        <div className="space-y-3">
          {animes.map((anime, index) => (
            <a
              key={index}
              href={anime.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 break-words">
                  {anime.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {anime.episodes} 话 · 状态: {anime.status}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <CopyButton text={anime.name} label="复制" />
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Lyrics Modal */}
      {selectedSong && (
        <LyricsModal
          songName={selectedSong.name}
          artist={selectedSong.artist}
          lyrics={selectedSong.lyrics}
          isOpen={!!selectedSong}
          onClose={() => setSelectedSong(null)}
        />
      )}
    </div>
  );
}
