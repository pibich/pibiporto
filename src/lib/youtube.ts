// Latest uploads for the homepage YouTube section, pulled automatically from
// the channel's public RSS feed — no API key or quota required. The feed
// response is cached in the Next.js Data Cache and refreshed hourly, so a new
// upload appears on the site within ~1h without any manual step.

const CHANNEL_ID = "UCRsd7MpeZnIWrZH5Lgogo4Q"; // @pibichori
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export type YouTubeVideo = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  published: string;
};

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));
}

function parseFeed(xml: string): YouTubeVideo[] {
  const videos: YouTubeVideo[] = [];
  // Each video is one <entry> block; the channel's own entry has no videoId.
  for (const entry of xml.split("<entry>").slice(1)) {
    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    if (!id) continue;
    const title = entry.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? "";
    videos.push({
      id,
      title: decodeEntities(title),
      url: `https://www.youtube.com/watch?v=${id}`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      published,
    });
  }
  return videos;
}

/** The channel's latest uploads, newest first. Empty array on any failure. */
export async function getLatestVideos(limit = 3): Promise<YouTubeVideo[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`YouTube feed HTTP ${res.status}`);
    const xml = await res.text();
    return parseFeed(xml).slice(0, limit);
  } catch (e) {
    console.error("getLatestVideos:", (e as Error).message);
    return [];
  }
}
