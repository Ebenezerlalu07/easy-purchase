export default function manifest() {
    return {
        name: "Easy Purchase",
        short_name: "Easy Purchase",

        description:
            "Quality construction materials, reliable supply and quotation solutions.",

        start_url: "/",
        scope: "/",
        display: "standalone",

        background_color: "#07100D",
        theme_color: "#07100D",

        orientation: "portrait",

        icons: [
            {
                src: "/icons/icon.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}