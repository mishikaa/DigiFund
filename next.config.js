/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['https://images.unsplash.com', 'https://fuchsia-advisory-narwhal-365.mypinata.cloud/', 'fuchsia-advisory-narwhal-365.mypinata.cloud']
    },
    compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  }

}

module.exports = nextConfig
