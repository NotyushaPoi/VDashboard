"use client";

import { useEffect } from "react";

interface LyricsModalProps {
  song?: {
    name: string;
    artist: string;
    lyrics: string;
  };
  songName?: string;
  artist?: string;
  lyrics?: string;
  isOpen?: boolean;
  onClose: () => void;
}

export function LyricsModal({
  song,
  songName: propSongName,
  artist: propArtist,
  lyrics: propLyrics,
  isOpen,
  onClose,
}: LyricsModalProps) {
  // 支持两种方式：song 对象或单个属性
  const name = song?.name || propSongName || "";
  const artist = song?.artist || propArtist || "";
  const lyrics = song?.lyrics || propLyrics || "";
  
  // 如果传递了 song 对象，自动显示（不需要 isOpen）
  const shouldShow = song ? true : isOpen;

  useEffect(() => {
    if (shouldShow) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [shouldShow]);

  if (!shouldShow) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{artist}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close lyrics"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Lyrics Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-mono text-sm leading-relaxed">
            {lyrics || "暂无歌词..."}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            关闭
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(lyrics);
              alert("歌词已复制到剪贴板");
            }}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            复制歌词
          </button>
        </div>
      </div>
    </div>
  );
}
