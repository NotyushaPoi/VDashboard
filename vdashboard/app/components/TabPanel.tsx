"use client";

import { useState, useMemo } from "react";
import { Playlist } from "@/app/lib/types";
import { CopyButton } from "@/app/components/CopyButton";
import { LyricsModal } from "@/app/components/LyricsModal";

interface TabPanelProps {
  playlists: Playlist[];
}

export function TabPanel({ playlists }: TabPanelProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedSong, setSelectedSong] = useState<{
    name: string;
    artist: string;
    lyrics: string;
  } | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [filterLanguage, setFilterLanguage] = useState<string | null>(null);
  const [filterArtist, setFilterArtist] = useState<string | null>(null);
  const [filterAlbum, setFilterAlbum] = useState<string | null>(null);

  const currentPlaylist = playlists[selectedTab] || playlists[0];

  // 收集当前歌单的所有歌曲
  const allSongs = useMemo(() => {
    return currentPlaylist.songs;
  }, [currentPlaylist]);

  // 收集过滤选项
  const tags = useMemo(() => {
    return [...new Set(allSongs.map((s) => s.tag).filter(Boolean))];
  }, [allSongs]);

  const languages = useMemo(() => {
    return [...new Set(allSongs.map((s) => s.language).filter(Boolean))];
  }, [allSongs]);

  const artists = useMemo(() => {
    return [...new Set(allSongs.map((s) => s.artist).filter(Boolean))];
  }, [allSongs]);

  const albums = useMemo(() => {
    return [...new Set(allSongs.map((s) => s.album).filter(Boolean))];
  }, [allSongs]);

  // 过滤歌曲
  const filteredSongs = useMemo(() => {
    return allSongs.filter((song) => {
      const matchesSearch =
        searchQuery === "" || song.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = filterTag === null || song.tag === filterTag;
      const matchesLanguage = filterLanguage === null || song.language === filterLanguage;
      const matchesArtist = filterArtist === null || song.artist === filterArtist;
      const matchesAlbum = filterAlbum === null || song.album === filterAlbum;

      return matchesSearch && matchesTag && matchesLanguage && matchesArtist && matchesAlbum;
    });
  }, [allSongs, searchQuery, filterTag, filterLanguage, filterArtist, filterAlbum]);

  if (playlists.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">暂无歌单</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-2 flex-wrap">
          {playlists.map((playlist, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedTab(index);
                setSearchQuery("");
                setFilterTag(null);
                setFilterLanguage(null);
                setFilterArtist(null);
                setFilterAlbum(null);
              }}
              className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                index === selectedTab
                  ? "border-purple-500 text-purple-600 dark:text-purple-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              📀 {playlist.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {/* Search and Filter Section */}
        <div className="mb-6">
          <div className="mb-6">
            <input
              type="text"
              placeholder="搜索歌曲名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tag 筛选 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                标签
              </label>
              <select
                value={filterTag || ""}
                onChange={(e) => setFilterTag(e.target.value || null)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">全部标签</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* 语言筛选 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                语言
              </label>
              <select
                value={filterLanguage || ""}
                onChange={(e) => setFilterLanguage(e.target.value || null)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">全部语言</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* 歌手筛选 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                歌手
              </label>
              <select
                value={filterArtist || ""}
                onChange={(e) => setFilterArtist(e.target.value || null)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">全部歌手</option>
                {artists.map((artist) => (
                  <option key={artist} value={artist}>
                    {artist}
                  </option>
                ))}
              </select>
            </div>

            {/* 专辑筛选 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                专辑
              </label>
              <select
                value={filterAlbum || ""}
                onChange={(e) => setFilterAlbum(e.target.value || null)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">全部专辑</option>
                {albums.map((album) => (
                  <option key={album} value={album}>
                    {album}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 结果计数 */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            找到 {filteredSongs.length} 首歌曲
          </div>
        </div>

        {/* Songs List */}
        {filteredSongs.length > 0 ? (
          <div className="space-y-3">
            {filteredSongs.map((song, songIndex) => (
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
                    {song.artist} · {song.genre} · {song.language}
                  </p>
                  {song.tag && (
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      标签: {song.tag} {song.album && `| 专辑: ${song.album}`}
                    </p>
                  )}
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
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                  >
                    歌词
                  </button>
                  <CopyButton 
                    text={song.name} 
                    label={selectedTab === 0 ? "复制点歌口令" : "复制"}
                    isJukeboxCommand={selectedTab === 0}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              没有找到匹配的歌曲 😅
            </p>
          </div>
        )}
      </div>

      {/* Lyrics Modal */}
      {selectedSong && (
        <LyricsModal
          song={selectedSong}
          onClose={() => setSelectedSong(null)}
        />
      )}
    </div>
  );
}
