import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/(.*)", // Match all routes
        locale: false, // Disable automatic locale detection
        headers: [
          {
            key: "Cache-Control", // Заголовок для кешування
            value: "public, max-age=300, must-revalidate", // кешуємо на 5 хвилин, потім браузер має перевірити оновлення
          },
        ],
      },
    ];
  },
};

export default nextConfig;
