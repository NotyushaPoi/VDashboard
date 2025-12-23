export interface Song {
  name: string;
  artist: string;
  genre: string;
  lyrics: string;
  url: string;
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
  playlists: Playlist[];
  animes: Anime[];
}

export interface StreamersData {
  streamers: Streamer[];
}
