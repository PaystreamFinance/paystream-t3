/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
/** @type {import("next").NextConfig} */
const config = {
  webpack: (config) => {
    config.plugins.push(new NodePolyfillPlugin());
    return config;
  },
};

export default config;
