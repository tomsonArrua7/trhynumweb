import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export async function GET() {
  try {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    let count = 0;
    if (redisUrl && redisToken && redisUrl.startsWith("https")) {
      try {
        const redis = new Redis({ url: redisUrl, token: redisToken });
        const cachedCount = await redis.get("download_count");
        if (cachedCount !== null) {
          count = Number(cachedCount);
        }
      } catch (redisErr) {
        console.error("Error reading download_count from Redis:", redisErr);
      }
    }
    return NextResponse.json({ success: true, count }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    console.error("Error in downloads GET API:", error);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    let count = 1;
    if (redisUrl && redisToken && redisUrl.startsWith("https")) {
      try {
        const redis = new Redis({ url: redisUrl, token: redisToken });
        count = await redis.incr("download_count");
      } catch (redisErr) {
        console.error("Error incrementing download_count in Redis:", redisErr);
      }
    }
    return NextResponse.json({ success: true, count }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    console.error("Error in downloads POST API:", error);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}
