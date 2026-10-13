/** @type {import('next').NextConfig} */
const nextConfig = {
  // PDFKit must be loaded as a real Node.js package so its built-in AFM font
  // files (for example Helvetica.afm) are resolved from node_modules at runtime.
  serverExternalPackages: ["pdfkit"],
};

export default nextConfig;
