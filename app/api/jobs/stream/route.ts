import { NextResponse } from "next/server";

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const write = (data: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      write({
        type: "connected",
        timestamp: new Date().toISOString()
      });

      const interval = setInterval(() => {
        write({
          type: "heartbeat",
          timestamp: new Date().toISOString()
        });
      }, 10_000);

      return () => clearInterval(interval);
    }
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}
