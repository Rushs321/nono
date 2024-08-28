import sharp from 'sharp';
import { PassThrough } from 'stream';
import { redirect } from './redirect.js';

// Function to handle image compression and respond with the compressed image
export async function compressImg(request, reply, stream) {
  const { webp, grayscale, quality, originSize } = request.params;
  const imgFormat = webp ? 'webp' : 'jpeg';

  // Create a PassThrough stream to handle the compressed image data
  const passThrough = new PassThrough();

  try {
    // Create a Sharp instance and configure it for streaming
    let sharpInstance = sharp()
      .grayscale(grayscale) // Apply grayscale conditionally
      .toFormat(imgFormat, {
        quality, // Use the provided quality
        progressive: true,
        optimizeScans: webp, // Optimize scans only for WebP
        chromaSubsampling: webp ? '4:4:4' : '4:2:0', // Conditional chroma subsampling
      });

    // Pipe the incoming stream into sharp and then into the PassThrough stream
    stream.pipe(sharpInstance).pipe(passThrough);

    // Set response headers
    reply.header('content-type', `image/${imgFormat}`);
    reply.header('x-original-size', originSize);
    
    // Handle errors from sharp processing
    sharpInstance.on('error', (error) => {
      console.error('Sharp processing error:', error);
      reply.raw.end(); // Ensure the response is ended properly on error
    });

    // Pipe the PassThrough stream to the response
    passThrough.pipe(reply.raw);
    
  } catch (error) {
    console.error('Compression error:', error);
    return redirect(request, reply); // Redirect on compression failure
  }
}
