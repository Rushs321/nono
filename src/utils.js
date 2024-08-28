// Utility to generate a random IP address
export function generateRandomIP() {
  return `${randomOctet()}.${randomOctet()}.${randomOctet()}.${randomOctet()}`;
}

// Helper function to generate a random octet (0-255)
function randomOctet() {
  return Math.floor(Math.random() * 256);
}

// A predefined list of user agents for random selection
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
  // Add more user agents to increase randomness and cover more devices
  'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.105 Mobile Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; AS; rv:11.0) like Gecko',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
  // More user agents can be added as needed
];

// Utility to select a random User-Agent from the predefined list
export function randomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}
