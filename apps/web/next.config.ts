import type { NextConfig } from "next";
import path from "path";
import fs from "fs";

const nextConfig: NextConfig = {
  transpilePackages: ["@readalong/reader-core", "@readalong/tts-core", "@readalong/ui"],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      const candidates = [
        path.join(process.cwd(), "node_modules", "kokoro-js", "dist", "kokoro.web.js"),
        path.join(process.cwd(), "../../node_modules", "kokoro-js", "dist", "kokoro.web.js"),
        path.join(process.cwd(), "../../node_modules", ".pnpm", "kokoro-js@1.2.1", "node_modules", "kokoro-js", "dist", "kokoro.web.js"),
      ];
      for (const p of candidates) {
        if (fs.existsSync(p)) {
          config.resolve = config.resolve ?? {};
          config.resolve.alias = { ...config.resolve.alias, "kokoro-js": p };
          break;
        }
      }
    }
    return config;
  },
};

export default nextConfig;
