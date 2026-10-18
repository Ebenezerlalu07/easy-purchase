export default function manifest() {
    return {
        name: "Top Range Building Materials",
        short_name: "Top Range",
        description:
            "Building materials catalogue and quotation platform.",

        start_url: "/",
        scope: "/",
        display: "standalone",

        background_color: "#07100D",
        theme_color: "#07100D",

        icons: [
            {
                src: "/icons/icon-192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icons/icon-512.png",
                sizes: "512x512",
                type: "image/png",
            },
            {
                src: "/icons/icon-512-maskable.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
}