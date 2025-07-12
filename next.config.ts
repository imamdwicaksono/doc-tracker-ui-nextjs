/** @type {import('next').NextConfig} */
const allowedOrigin = process.env.ALLOWED_ORIGIN;

let remotePatterns: Array<{ protocol: string; hostname: string; pathname: string }> = [];
let headers: Array<{
  source: string;
  headers: Array<{ key: string; value: string }>;
}> = [];
let rewrites: Array<{ source: string; destination: string }> = [];

if (allowedOrigin) {
  const url = new URL(allowedOrigin);
  const hostname = url.hostname;
  const protocol = url.protocol.replace(":", "");

  remotePatterns = [
    {
      protocol,
      hostname,
      pathname: '/evidence/**',
    },
  ];

  headers = [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Credentials', value: 'true' },
        { key: 'Access-Control-Allow-Origin', value: allowedOrigin },
        { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
        {
          key: 'Access-Control-Allow-Headers',
          value:
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
        },
      ],
    },
  ];

  rewrites = [
      {
        source: '/api/:path*',
        destination: `${allowedOrigin}/api/:path*`,
      },
      {
        source: '/evidence/:path*',
        destination: `${allowedOrigin}/evidence/:path*`,
      },
    ];
}

const nextConfig = {
  images: {
    remotePatterns,
  },
  async headers() {
    return headers;
  },
  async rewrites() {
    return rewrites;
  },
};

module.exports = nextConfig;
