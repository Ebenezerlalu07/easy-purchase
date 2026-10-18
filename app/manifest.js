export default function manifest() {
    return {
        name: "Easy Purchase",
        short_name: "Easy Purchase",

        start_url: "/",
        scope: "/",
        display: "standalone",

        background_color: "#07100D",
        theme_color: "#07100D",

        icons: [
            {
                src: "/icons/App logo.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icons/App logo.png",
                sizes: "512x512",
                type: "image/png",
            },

        ],
    };
}