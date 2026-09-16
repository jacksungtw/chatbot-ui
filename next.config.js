const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
})

const withPWA = require("next-pwa")({
  dest: "public",
  runtimeCaching: [
    {
      urlPattern: ({ url }) => url.pathname.startsWith("/api/dispatch/"),
      handler: "NetworkOnly"
    },
    ...require("next-pwa/cache")
  ]
})

module.exports = withBundleAnalyzer(
  withPWA({
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: "http",
          hostname: "localhost"
        },
        {
          protocol: "http",
          hostname: "127.0.0.1"
        },
        {
          protocol: "https",
          hostname: "**"
        }
      ]
    },
    experimental: {
      serverComponentsExternalPackages: [
        "sharp",
        "onnxruntime-node",
        "pdf-parse"
      ]
    },
    // 強制 disable webpack persistent cache，避免 Railway nixpacks 保留舊 chunk
    webpack: (config, { isServer }) => {
      config.cache = false
      return config
    }
  })
)
