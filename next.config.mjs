/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Enable React strict mode for identifying potential issues
    swcMinify: true, // Use SWC for faster minification
  
    // Custom Webpack configuration
    webpack: (config, { dev, isServer }) => {
      // Example: Exclude certain modules from the client-side bundle
      if (!dev && !isServer) {
        config.resolve.fallback.fs = false;
      }
  
      // Further customizations can be added here if necessary
  
      return config;
    },
  
    // Environment variables
    env: {
      // Add environment variables if needed
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    },
  
    // Image domains configuration (if you're using images from external sources)
    images: {
      domains: ['example.com'], // Add any domains that you use for images
    },
  };
  
  export default nextConfig;
  