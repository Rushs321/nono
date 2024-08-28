import sharp from 'sharp';
import { redirect } from './redirect.js';

// Function to handle image compression and respond with the compressed image
export async function compressImg(request, reply, stream) {
  const { webp, grayscale, quality, originSize } = request.params;
  const imgFormat = webp ? 'webp' : 'jpeg';

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

    // Pipe the input stream into sharp, and pipe the result into the response
    stream.pipe(sharpInstance)
      .on('error', (error) => {
        console.error('Sharp processing error:', error);
        reply.raw.end(); // Ensure the response is ended properly on error
      })
      .pipe(reply)
      .on('finish', () => {
        console.log('Image compression and response completed successfully.');
      });
    
    // Set response headers before streaming starts
    reply.header('content-type', `image/${imgFormat}`);
    reply.header('x-original-size', originSize);
    
    // Add additional headers if needed
  } catch (error) {
    console.error('Compression error:', error);
    return redirect(request, reply); // Redirect on compression failure
  }
}
