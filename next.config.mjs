/** @type {import('next').NextConfig} */
const nextConfig = {
    // Add your custom Next.js configurations here
    // Example configurations:
    reactStrictMode: true, // Enables React's Strict Mode
    swcMinify: true,       // Enables SWC-based minification
    async headers() {
      return [
        {
          source: '/api/:path*',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*', // Adjust this value based on your CORS needs
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  