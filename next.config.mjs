/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        // CSR bailoutの警告を無視
        missingSuspenseWithCSRBailout: false
    }
};

export default nextConfig;
