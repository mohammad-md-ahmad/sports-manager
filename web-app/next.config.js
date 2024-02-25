const isProd = process.env.NODE_ENV === 'production';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: false,
    output: 'export',
    basePath: '/admin-portal',
    assetPrefix: isProd ? 'https://liber.quad-bh.com/admin-portal/' : undefined,
    images: {
        loader: "custom",
        loaderFile: './ImageLoader.js'
    },

    // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
    // trailingSlash: true,

    // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
    // skipTrailingSlashRedirect: true,

    // Optional: Change the output directory `out` -> `dist`
    // distDir: 'dist',
}

module.exports = nextConfig