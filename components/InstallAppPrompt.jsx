"use client";

import { useEffect, useState } from "react";
import {
    Download,
    Share2,
    X,
} from "lucide-react";

export default function InstallAppPrompt() {
    const [show, setShow] = useState(false);
    const [installEvent, setInstallEvent] =
        useState(null);

    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        const standalone =
            window.matchMedia(
                "(display-mode: standalone)",
            ).matches ||
            window.navigator.standalone === true;

        if (standalone) {
            return;
        }

        const dismissed =
            localStorage.getItem(
                "toprange-install-dismissed",
            ) === "true";

        if (dismissed) {
            return;
        }

        const ua =
            window.navigator.userAgent.toLowerCase();

        const ios =
            /iphone|ipad|ipod/.test(ua);

        setIsIOS(ios);

        const handleInstallPrompt = (event) => {
            event.preventDefault();

            setInstallEvent(event);

            setShow(true);
        };

        window.addEventListener(
            "beforeinstallprompt",
            handleInstallPrompt,
        );

        if (ios) {
            const timer = setTimeout(() => {
                setShow(true);
            }, 1800);

            return () => {
                clearTimeout(timer);

                window.removeEventListener(
                    "beforeinstallprompt",
                    handleInstallPrompt,
                );
            };
        }

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleInstallPrompt,
            );
        };
    }, []);

    const installApp = async () => {
        if (!installEvent) {
            return;
        }

        installEvent.prompt();

        await installEvent.userChoice;

        setInstallEvent(null);

        setShow(false);
    };

    const closePrompt = () => {
        setShow(false);

        localStorage.setItem(
            "toprange-install-dismissed",
            "true",
        );
    };

    if (!show) {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[99999] mx-auto max-w-[420px]">
            <div className="rounded-[24px] border border-white/10 bg-[#101411] p-5 shadow-[0_18px_50px_rgba(0,0,0,.3)]">
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D8FF65] text-[#101411]">
                        {isIOS ? (
                            <Share2 className="h-5 w-5" />
                        ) : (
                            <Download className="h-5 w-5" />
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-semibold text-white">
                            Add Top Range to your phone
                        </p>

                        {isIOS ? (
                            <p className="mt-1 text-[12px] leading-5 text-white/60">
                                Tap Share, then select{" "}
                                <span className="font-semibold text-white">
                                    Add to Home Screen
                                </span>
                                .
                            </p>
                        ) : (
                            <p className="mt-1 text-[12px] leading-5 text-white/60">
                                Install Top Range for a faster
                                app-like experience.
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={closePrompt}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="mt-4">
                    {isIOS ? (
                        <div className="rounded-[16px] bg-white/[0.06] px-4 py-3 text-[12px] font-medium text-white/80">
                            Share → Add to Home Screen
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={installApp}
                            className="w-full rounded-full bg-[#D8FF65] px-5 py-3.5 text-[13px] font-semibold text-[#101411]"
                        >
                            Install App
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}