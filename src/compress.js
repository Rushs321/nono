import sharp from 'sharp';
import { redirect } from './redirect.js';

export async function compressImg(request, reply, imgDataStream) {
    const { webp, grayscale, quality, originSize } = request.params;
    const imgFormat = webp ? 'webp' : 'jpeg';

    try {
        // Create the Sharp pipeline
        let transform = sharp()
            .grayscale(grayscale) // Apply grayscale conditionally
            .toFormat(imgFormat, {
                quality, // Use the provided quality
                progressive: true,
                optimizeScans: webp, // Optimize scans only for WebP
                chromaSubsampling: webp ? '4:4:4' : '4:2:0', // Conditional chroma subsampling
            });

        // Pipe the input stream through the Sharp pipeline
        const transformedStream = imgDataStream.pipe(transform);

        // Set appropriate headers before streaming the response
        reply.header('content-type', `image/${imgFormat}`);
        reply.header('x-original-size', originSize);

        // Stream the transformed data directly to the response
        transformedStream.pipe(reply.raw);

        // End the response when the streaming finishes
        transformedStream.on('end', () => {
            reply.raw.end();
        });

        // Handle errors in the stream
        transformedStream.on('error', (error) => {
            console.error('Streaming error:', error);
            return redirect(request, reply); // Fallback to redirect on error
        });
    } catch (error) {
        console.error('Compression error:', error);
        return redirect(request, reply);
    }
}
