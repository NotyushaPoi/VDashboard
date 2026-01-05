export interface Song {
  name: string;
  artist: string;
  genre: string;
  lyrics: string;
  url: string;
  tag?: string;
  language?: string;
  album?: string;
}

export interface Playlist {
  name: string;
  songs: Song[];
}

export interface Anime {
  name: string;
  episodes: number;
  status: "在看" | "已完成" | "计划看";
  url: string;
}

export interface Streamer {
  id: number;
  name: string;
  bio: string;
  avatar: string;
  banner: string;
  slug?: string; // URL 友好的主播标识
  themeColors?: {
    primary: string; // 主色，例如 #FCBD91
    secondary: string; // 副色，例如 #FFAAA8
  };
  // 完整数据（详情页面用）
  bilibiliId?: string;
  liveUrl?: string;
  bilibiliSpaceUrl?: string;
  description?: string;
  cloudMusicUrl?: string;
  redUrl?: string;
  playlists?: Playlist[];
  // 索引数据（主页用）
  file?: string;
  playlistCount?: number;
  songCount?: number;
}

export interface Video {
  id: number;
  title: string;
  cover: string;
  videoUrl: string;
  description?: string;
}

export interface StreamersData {
  streamers: Streamer[];
  videos?: Video[];
}

