import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    plugins: [heroui({
        "themes": {
            "light": {
                "colors": {
                    "default": {
                        "50": "#fafafa",
                        "100": "#f2f2f3",
                        "200": "#ebebec",
                        "300": "#e3e3e6",
                        "400": "#dcdcdf",
                        "500": "#d4d4d8",
                        "600": "#afafb2",
                        "700": "#8a8a8c",
                        "800": "#656567",
                        "900": "#404041",
                        "foreground": "#000",
                        "DEFAULT": "#d4d4d8"
                    },
                    "primary": {
                        "50": "#ffeef2",
                        "100": "#ffd7df",
                        "200": "#ffc0cc",
                        "300": "#ffa9b9",
                        "400": "#ff91a7",
                        "500": "#ff7a94",
                        "600": "#d2657a",
                        "700": "#a64f60",
                        "800": "#793a46",
                        "900": "#4d252c",
                        "foreground": "#000",
                        "DEFAULT": "#ff7a94"
                    },
                    "secondary": {
                        "50": "#eee4f8",
                        "100": "#d7bfef",
                        "200": "#bf99e5",
                        "300": "#a773db",
                        "400": "#904ed2",
                        "500": "#7828c8",
                        "600": "#6321a5",
                        "700": "#4e1a82",
                        "800": "#39135f",
                        "900": "#240c3c",
                        "foreground": "#fff",
                        "DEFAULT": "#7828c8"
                    },
                    "success": {
                        "50": "#e2f8ec",
                        "100": "#b9efd1",
                        "200": "#91e5b5",
                        "300": "#68dc9a",
                        "400": "#40d27f",
                        "500": "#17c964",
                        "600": "#13a653",
                        "700": "#0f8341",
                        "800": "#0b5f30",
                        "900": "#073c1e",
                        "foreground": "#000",
                        "DEFAULT": "#17c964"
                    },
                    "warning": {
                        "50": "#fef4e4",
                        "100": "#fce4bd",
                        "200": "#fad497",
                        "300": "#f9c571",
                        "400": "#f7b54a",
                        "500": "#f5a524",
                        "600": "#ca881e",
                        "700": "#9f6b17",
                        "800": "#744e11",
                        "900": "#4a320b",
                        "foreground": "#000",
                        "DEFAULT": "#f5a524"
                    },
                    "danger": {
                        "50": "#ffdfdf",
                        "100": "#ffb3b3",
                        "200": "#ff8686",
                        "300": "#ff5959",
                        "400": "#ff2d2d",
                        "500": "#ff0000",
                        "600": "#d20000",
                        "700": "#a60000",
                        "800": "#790000",
                        "900": "#4d0000",
                        "foreground": "#000",
                        "DEFAULT": "#ff0000"
                    },
                    "background": "#ffffff",
                    "foreground": {
                        "50": "#dfdfdf",
                        "100": "#b3b3b3",
                        "200": "#868686",
                        "300": "#595959",
                        "400": "#2d2d2d",
                        "500": "#000000",
                        "600": "#000000",
                        "700": "#000000",
                        "800": "#000000",
                        "900": "#000000",
                        "foreground": "#fff",
                        "DEFAULT": "#000000"
                    },
                    "content1": {
                        "DEFAULT": "#ffffff",
                        "foreground": "#000"
                    },
                    "content2": {
                        "DEFAULT": "#f4f4f5",
                        "foreground": "#000"
                    },
                    "content3": {
                        "DEFAULT": "#e4e4e7",
                        "foreground": "#000"
                    },
                    "content4": {
                        "DEFAULT": "#d4d4d8",
                        "foreground": "#000"
                    },
                    "focus": "#ff7a94",
                    "overlay": "#000000",
                    "divider": "#111111"
                }
            },
            "dark": {
                "colors": {
                    "default": {
                        "50": "#131315",
                        "100": "#1e1e21",
                        "200": "#29292e",
                        "300": "#34343a",
                        "400": "#3f3f46",
                        "500": "#616166",
                        "600": "#828287",
                        "700": "#a4a4a7",
                        "800": "#c5c5c8",
                        "900": "#e7e7e8",
                        "foreground": "#fff",
                        "DEFAULT": "#3f3f46"
                    },
                    "primary": {
                        "50": "#4d252c",
                        "100": "#793a46",
                        "200": "#a64f60",
                        "300": "#d2657a",
                        "400": "#ff7a94",
                        "500": "#ff91a7",
                        "600": "#ffa9b9",
                        "700": "#ffc0cc",
                        "800": "#ffd7df",
                        "900": "#ffeef2",
                        "foreground": "#000",
                        "DEFAULT": "#ff7a94"
                    },
                    "secondary": {
                        "50": "#240c3c",
                        "100": "#39135f",
                        "200": "#4e1a82",
                        "300": "#6321a5",
                        "400": "#7828c8",
                        "500": "#904ed2",
                        "600": "#a773db",
                        "700": "#bf99e5",
                        "800": "#d7bfef",
                        "900": "#eee4f8",
                        "foreground": "#fff",
                        "DEFAULT": "#7828c8"
                    },
                    "success": {
                        "50": "#073c1e",
                        "100": "#0b5f30",
                        "200": "#0f8341",
                        "300": "#13a653",
                        "400": "#17c964",
                        "500": "#40d27f",
                        "600": "#68dc9a",
                        "700": "#91e5b5",
                        "800": "#b9efd1",
                        "900": "#e2f8ec",
                        "foreground": "#000",
                        "DEFAULT": "#17c964"
                    },
                    "warning": {
                        "50": "#4a320b",
                        "100": "#744e11",
                        "200": "#9f6b17",
                        "300": "#ca881e",
                        "400": "#f5a524",
                        "500": "#f7b54a",
                        "600": "#f9c571",
                        "700": "#fad497",
                        "800": "#fce4bd",
                        "900": "#fef4e4",
                        "foreground": "#000",
                        "DEFAULT": "#f5a524"
                    },
                    "danger": {
                        "50": "#4d0000",
                        "100": "#790000",
                        "200": "#a60000",
                        "300": "#d20000",
                        "400": "#ff0000",
                        "500": "#ff2d2d",
                        "600": "#ff5959",
                        "700": "#ff8686",
                        "800": "#ffb3b3",
                        "900": "#ffdfdf",
                        "foreground": "#000",
                        "DEFAULT": "#ff0000"
                    },
                    "background": "#000000",
                    "foreground": {
                        "50": "#4d4d4d",
                        "100": "#797979",
                        "200": "#a6a6a6",
                        "300": "#d2d2d2",
                        "400": "#ffffff",
                        "500": "#ffffff",
                        "600": "#ffffff",
                        "700": "#ffffff",
                        "800": "#ffffff",
                        "900": "#ffffff",
                        "foreground": "#000",
                        "DEFAULT": "#ffffff"
                    },
                    "content1": {
                        "DEFAULT": "#18181b",
                        "foreground": "#fff"
                    },
                    "content2": {
                        "DEFAULT": "#27272a",
                        "foreground": "#fff"
                    },
                    "content3": {
                        "DEFAULT": "#3f3f46",
                        "foreground": "#fff"
                    },
                    "content4": {
                        "DEFAULT": "#52525b",
                        "foreground": "#fff"
                    },
                    "focus": "#ff7a94",
                    "overlay": "#ffffff",
                    "divider": "#ffffff"
                }
            }
        }

    }),
        // require("tailwindcss-animate")
    ],
};

export default config;