/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // 重定向旧的 /streamer/{id} 路由到新的 /{slug} 路由
      {
        source: "/streamer/1",
        destination: "/kirara",
        permanent: true, // 301 永久重定向
      },
      {
        source: "/streamer/2",
        destination: "/yvainne",
        permanent: true,
      },
      {
        source: "/streamer/3",
        destination: "/choco",
        permanent: true,
      },
      {
        source: "/streamer/4",
        destination: "/sakura",
        permanent: true,
      },
      {
        source: "/streamer/5",
        destination: "/qoo",
        permanent: true,
      },
      {
        source: "/streamer/6",
        destination: "/asaritsu",
        permanent: true,
      },
      // 重定向主页从 / 到 /home
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
