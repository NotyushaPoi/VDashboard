import { StreamersData, Streamer } from "./types";
import path from "path";
import fs from "fs/promises";

let streamerCache: StreamersData | null = null;

async function loadStreamersFromFile(): Promise<StreamersData> {
  try {
    const filePath = path.join(process.cwd(), "public/data/streamers.json");
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Failed to load streamers from file:", error);
    throw new Error("Unable to load streamers data");
  }
}

export async function getStreamersData(): Promise<StreamersData> {
  if (streamerCache) {
    return streamerCache;
  }

  const data = await loadStreamersFromFile();
  streamerCache = data;
  return data;
}

export async function getStreamerById(id: number): Promise<Streamer | null> {
  const data = await getStreamersData();
  return data.streamers.find((s) => s.id === id) || null;
}

export async function getAllStreamers(): Promise<Streamer[]> {
  const data = await getStreamersData();
  return data.streamers;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
