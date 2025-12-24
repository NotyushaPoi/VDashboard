export interface Song {
  name: string;
  artist: string;
  genre: string;
  lyrics: string;
  url: string;
  tag?: string;        // 新增：标签/分类
  language?: string;   // 新增：语言/语种
  album?: string;      // 新增：专辑
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
  bilibiliId: string;
  liveUrl: string;
  avatar: string;
  banner: string;
  bio: string;
  description: string;
  fans: string;
  carouselUrl?: string;  // 新增：轮播点击链接
  cloudMusicUrl?: string; // 新增：网易云音乐主页链接
  redUrl?: string;       // 新增：小红书主页链接
  playlists: Playlist[];
  animes: Anime[];
}


export interface Video {
  title: string;
  cover: string;
  videoUrl: string;
  author: {
    name: string;
    avatar: string;
  };
  description?: string;
}

export interface StreamersData {
  streamers: Streamer[];
  videos?: Video[];
}
