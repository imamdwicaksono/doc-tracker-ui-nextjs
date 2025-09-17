/** @type {import('next').NextConfig} */
const allowedOrigin = process.env.ALLOWED_ORIGIN;

let remotePatterns: { protocol: string; hostname: string; port: string; pathname: string }[] = [];
let headers: { source: string; headers: { key: string; value: string }[] }[] = [];
let rewrites: { source: string; destination: string }[] = [];

if (allowedOrigin) {
  const url = new URL(allowedOrigin);
  const hostname = url.hostname;
  const protocol = url.protocol.replace(":", "");
  const port = url.port || (protocol === "https" ? "443" : "80");

  // remotePatterns untuk image
  remotePatterns = [
    {
      protocol,
      hostname,
      port, // ⬅ penting kalau pakai port custom
      pathname: "/evidence/**",
    },
  ];

  // headers untuk CORS
  headers = [
    {
      source: "/api/:path*",
      headers: [
        { key: "Access-Control-Allow-Credentials", value: "true" },
        { key: "Access-Control-Allow-Origin", value: allowedOrigin },
        { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
        {
          key: "Access-Control-Allow-Headers",
          value:
            "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
        },
      ],
    },
  ];

  // rewrites untuk proxy
  rewrites = [
    {
      source: "/api/:path*",
      destination: `${protocol}://${hostname}:${port}/api/:path*`, // ⬅ tambahkan port
    },
    {
      source: "/evidence/:path*",
      destination: `${protocol}://${hostname}:${port}/evidence/:path*`, // ⬅ tambahkan port
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
