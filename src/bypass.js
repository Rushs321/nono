export function bypass(request, reply, stream) {
    if (reply.sent) return;
    reply.header('x-proxy-bypass', 1);

    // Pipe the input stream directly to the reply stream
    stream.pipe(reply.raw);

    // End the response when the streaming finishes
    stream.on('end', () => {
        reply.raw.end();
    });

    // Handle any errors in the stream
    stream.on('error', (error) => {
        console.error('Bypass streaming error:', error);
        reply.code(500).send('Error occurred during bypass streaming');
    });
}
