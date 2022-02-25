module.exports = {
  webpack: (config, options) => {
    // Transpile rari-components, even though it is in node_modules
    config.module.rules.push({
      test: /\.tsx?/,
      include: [/node_modules\/rari-components/],
      use: "next-swc-loader",
    });

    return config;
  },
};
