import { pipeline } from 'stream';

export function bypass(request, reply, stream) {
  if (reply.sent) return; // Prevent multiple responses

  reply.header('x-proxy-bypass', 1);

  // Use pipeline to handle errors properly
  pipeline(
    stream,
    reply,
    (err) => {
      if (err) {
        console.error('Pipeline failed', err);
        reply.raw.end(); // Ensure the stream is properly closed on error
      }
    }
  );
}
