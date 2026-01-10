import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import Ajv from 'ajv';

// 定义数据类型
interface ThemeColors {
  primary: string;
  secondary: string;
}

interface Streamer {
  id: number;
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  banner: string;
  bilibiliId: string;
  bilibiliSpaceUrl: string;
  liveUrl: string;
  cloudMusicUrl: string;
  redUrl: string;
  themeColors: ThemeColors;
  description: string;
}

interface Song {
  id: string;
  name: string;
  artist: string;
  genre: string;
  tag: string;
  language: string;
  album: string;
  lyrics: string;
  url: string;
}

interface Playlist {
  name: string;
  songs: string[] | Song[];
}

interface PlaylistWithIds {
  name: string;
  songs: string[];
}

interface PlaylistWithSongs {
  name: string;
  songs: Song[];
}

interface StreamerWithPlaylists extends Streamer {
  playlists: PlaylistWithSongs[];
}

interface Video {
  id: number;
  title: string;
  cover: string;
  videoUrl: string;
  description?: string;
}

// 定义 JSON Schema 用于验证
const streamerSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    slug: { type: 'string' },
    bio: { type: 'string' },
    avatar: { type: 'string' },
    banner: { type: 'string' },
    bilibiliId: { type: 'string' },
    bilibiliSpaceUrl: { type: 'string' },
    liveUrl: { type: 'string' },
    cloudMusicUrl: { type: 'string' },
    redUrl: { type: 'string' },
    themeColors: {
      type: 'object',
      properties: {
        primary: { type: 'string' },
        secondary: { type: 'string' },
      },
      required: ['primary', 'secondary'],
    },
    description: { type: 'string' },
    playlists: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          songs: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                artist: { type: 'string' },
                genre: { type: 'string' },
                tag: { type: 'string' },
                language: { type: 'string' },
                album: { type: 'string' },
                lyrics: { type: 'string' },
              },
              required: ['id', 'name', 'artist'],
            },
          },
        },
        required: ['name', 'songs'],
      },
    },
  },
  required: ['id', 'name', 'slug', 'bio', 'avatar', 'banner', 'themeColors', 'playlists'],
};

const songSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    artist: { type: 'string' },
    genre: { type: 'string' },
    tag: { type: 'string' },
    language: { type: 'string' },
    album: { type: 'string' },
    lyrics: { type: 'string' },
    url: { type: 'string' },
  },
  required: ['id', 'name', 'artist', 'genre', 'tag', 'language', 'album', 'lyrics'],
};

const videoSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    title: { type: 'string' },
    cover: { type: 'string' },
    videoUrl: { type: 'string' },
    description: { type: 'string' },
  },
  required: ['id', 'title', 'cover', 'videoUrl'],
};

// 初始化验证器
const ajv = new Ajv();
const validateStreamer = ajv.compile(streamerSchema);
const validateSong = ajv.compile(songSchema);
const validateVideo = ajv.compile(videoSchema);

// 辅助函数
function loadYaml(filePath: string): any {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return yaml.load(content);
  } catch (error) {
    console.error(`Failed to load YAML from ${filePath}:`, error);
    throw error;
  }
}

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeJson(filePath: string, data: any): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// 主构建函数
async function buildData() {
  console.log('🔨 开始构建数据...\n');

  const dataDir = path.join(__dirname, '../data');
  const publicDataDir = path.join(__dirname, '../public/data');
  const streamerDir = path.join(dataDir, 'streamers');
  const songsDir = path.join(dataDir, 'songs');
  const playlistsDir = path.join(dataDir, 'playlists');

  // 确保输出目录存在
  ensureDir(publicDataDir);
  ensureDir(path.join(publicDataDir, 'streamers'));

  // 加载所有歌曲
  console.log('📦 加载歌曲数据...');
  const allSongsFile = path.join(songsDir, 'all.yaml');
  const allSongsData = loadYaml(allSongsFile) as { songs: Song[] };
  const songMap = new Map<string, Song>();
  
  allSongsData.songs.forEach((song: Song) => {
    songMap.set(song.id, song);
  });
  
  const kiraraFile = path.join(songsDir, 'kirara.yaml');
  const kiraraData = loadYaml(kiraraFile) as { songs: Song[] };
  kiraraData.songs.forEach((song: Song) => {
    songMap.set(song.id, song);
  });
  console.log(`✅ 已加载 ${songMap.size} 首歌曲\n`);

  // 构建主播数据
  console.log('🎤 构建主播信息...');
  const streamersIndex = [];
  const streamers = ['kirara', 'yvainne', 'choco', 'sakura', 'qoo', 'asaritsu'];

  for (const slug of streamers) {
    // 加载主播信息
    const streamerFile = path.join(streamerDir, `${slug}.yaml`);
    const streamerData = loadYaml(streamerFile) as Streamer;

    // 加载歌单
    const playlistFile = path.join(playlistsDir, `${slug}.yaml`);
    const playlistData = loadYaml(playlistFile) as { playlists: PlaylistWithIds[] };

    // 解析歌单中的歌曲
    const playlists: PlaylistWithSongs[] = playlistData.playlists.map((playlist: PlaylistWithIds) => ({
      name: playlist.name,
      songs: playlist.songs
        .map((songId: string) => songMap.get(songId))
        .filter((song: Song | undefined): song is Song => song !== undefined),
    }));

    // 合并数据
    const streamerWithPlaylists: StreamerWithPlaylists = {
      ...streamerData,
      playlists,
    };

    // 验证数据
    if (!validateStreamer(streamerWithPlaylists)) {
      console.error(`❌ 主播 ${slug} 验证失败:`, validateStreamer.errors);
      process.exit(1);
    }

    // 写入主播详细 JSON
    const outputFile = path.join(publicDataDir, 'streamers', `${slug}.json`);
    writeJson(outputFile, streamerWithPlaylists);
    console.log(`  ✅ ${streamerData.name} (${slug})`);

    // 添加到索引
    streamersIndex.push({
      id: streamerData.id,
      name: streamerData.name,
      slug: streamerData.slug,
      bio: streamerData.bio,
      avatar: streamerData.avatar,
      themeColors: streamerData.themeColors,
      file: `streamers/${slug}.json`,
      playlistCount: playlists.length,
      songCount: playlists.reduce((sum: number, p: PlaylistWithSongs) => sum + p.songs.length, 0),
    });
  }

  // 写入主播索引
  const indexFile = path.join(publicDataDir, 'streamers.json');
  writeJson(indexFile, { streamers: streamersIndex });
  console.log(`\n✅ 主播索引已生成: ${indexFile}\n`);

  // 加载视频数据
  console.log('🎬 加载视频数据...');
  const videosFile = path.join(dataDir, 'videos.yaml');
  const videosData = loadYaml(videosFile) as { videos: Video[] };
  
  // 验证每个视频
  videosData.videos.forEach((video: Video, index: number) => {
    if (!validateVideo(video)) {
      console.error(`❌ 视频 ${index + 1} 验证失败:`, validateVideo.errors);
      process.exit(1);
    }
  });
  
  // 写入视频 JSON
  const videosOutputFile = path.join(publicDataDir, 'videos.json');
  writeJson(videosOutputFile, videosData.videos);
  console.log(`✅ 已加载 ${videosData.videos.length} 个视频`);
  console.log(`✅ 视频数据已生成: ${videosOutputFile}\n`);

  console.log('✨ 数据构建完成！');
  console.log(`📁 输出目录: ${publicDataDir}`);
}

// 执行
buildData().catch((error) => {
  console.error('❌ 构建失败:', error);
  process.exit(1);
});
