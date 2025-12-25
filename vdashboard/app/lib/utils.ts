import { StreamersData, Streamer } from "./types";
import path from "path";
import fs from "fs/promises";

// 缓存索引数据（轻量级）
let indexCache: StreamersData | null = null;

// 缓存已加载的完整主播数据
const streamerDetailCache: Map<number, Streamer> = new Map();

/**
 * 加载轻量级索引文件
 * 包含所有主播的基本信息，用于主页快速加载
 */
async function loadIndexFromFile(): Promise<StreamersData> {
  try {
    const filePath = path.join(process.cwd(), "public/data/streamers.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Failed to load streamers index:", error);
    throw new Error("Unable to load streamers index");
  }
}

/**
 * 加载单个主播的完整数据（包含所有歌单和歌曲）
 * 仅在需要时调用，实现懒加载
 */
async function loadStreamerDetailFromFile(
  id: number
): Promise<Streamer | null> {
  try {
    const indexData = await loadIndexFromFile();
    const indexEntry = indexData.streamers.find((s) => s.id === id);

    if (!indexEntry || !indexEntry.file) {
      return null;
    }

    // 从索引中获取文件路径
    const filePath = path.join(process.cwd(), "public/data", indexEntry.file);
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Failed to load streamer ${id} details:`, error);
    return null;
  }
}

/**
 * 加载独立的视频数据
 * 从 public/data/videos.json 读取
 */
async function loadVideosFromFile(): Promise<any[]> {
  try {
    const filePath = path.join(process.cwd(), "public/data/videos.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Failed to load videos:", error);
    return [];
  }
}

/**
 * 获取轻量级索引数据（主页用）
 * 返回所有主播的基本信息，不包含歌单详情
 */
export async function getStreamersIndex(): Promise<StreamersData> {
  if (indexCache) {
    return indexCache;
  }

  const data = await loadIndexFromFile();
  indexCache = data;
  return data;
}

/**
 * 获取完整的数据（包含 streamers 和 videos）
 * 用于主页展示轮播和网格
 */
export async function getStreamersData(): Promise<StreamersData> {
  const indexData = await getStreamersIndex();
  const videos = await loadVideosFromFile();
  return {
    streamers: indexData.streamers,
    videos: videos,
  };
}

/**
 * 获取单个主播的完整数据（包含所有歌单）
 * 用于详情页面 - 支持缓存以避免重复加载
 */
export async function getStreamerById(id: number): Promise<Streamer | null> {
  // 检查缓存
  if (streamerDetailCache.has(id)) {
    return streamerDetailCache.get(id) || null;
  }

  // 从文件加载
  const streamer = await loadStreamerDetailFromFile(id);

  if (streamer) {
    streamerDetailCache.set(id, streamer);
  }

  return streamer;
}

/**
 * 获取所有主播的索引信息（不包含详细歌单）
 * 用于生成静态路由参数
 */
export async function getAllStreamers(): Promise<Streamer[]> {
  const data = await getStreamersIndex();
  return data.streamers as Streamer[];
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
