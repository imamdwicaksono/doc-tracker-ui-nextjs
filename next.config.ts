/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // {
      //   protocol: 'https',
      //   hostname: 'api.docutrack.mmsgroup.test',
      //   pathname: '/evidence/**',
      // },
    ],
  },
  // async headers() {
  //   return [
  //     {
  //       // ✅ Header untuk seluruh API route (bukan untuk rewrite destination)
  //       source: '/api/:path*',
  //       headers: [
  //         { key: 'Access-Control-Allow-Credentials', value: 'true' },
  //         { key: 'Access-Control-Allow-Origin', value: 'https://docutrack.mmsgroup.test' }, // ✅ ganti jadi frontend origin
  //         { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
  //         {
  //           key: 'Access-Control-Allow-Headers',
  //           value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
  //         },
  //       ],
  //     },
  //   ];
  // },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'https://api.docutrack.mmsgroup.test/api/:path*',
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
