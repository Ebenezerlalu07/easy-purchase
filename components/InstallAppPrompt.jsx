"use client";

import { useEffect, useState } from "react";
import { Download, Share2, X, PlusSquare } from "lucide-react";

export default function InstallAppPrompt() {
    const [show, setShow] = useState(false);
    const [installEvent, setInstallEvent] = useState(null);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSGuide, setShowIOSGuide] = useState(false);

    useEffect(() => {
        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone === true;

        if (isStandalone) {
            return;
        }

        const dismissed =
            localStorage.getItem("toprange-install-dismissed") === "true";

        if (dismissed) {
            return;
        }

        const ua = window.navigator.userAgent.toLowerCase();

        const ios =
            /iphone|ipad|ipod/.test(ua) ||
            (navigator.platform === "MacIntel" &&
                navigator.maxTouchPoints > 1);

        setIsIOS(ios);

        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault();
            setInstallEvent(event);
            setShow(true);
        };

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt,
        );

        if (ios) {
            const timer = setTimeout(() => {
                setShow(true);
            }, 1800);

            return () => {
                clearTimeout(timer);

                window.removeEventListener(
                    "beforeinstallprompt",
                    handleBeforeInstallPrompt,
                );
            };
        }

        return () => {
            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt,
            );
        };
    }, []);

    const installApp = async () => {
        if (isIOS) {
            setShowIOSGuide(true);
            return;
        }

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
        <>
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
                                Add Easy Purchase to your phone
                            </p>

                            <p className="mt-1 text-[12px] leading-5 text-white/60">
                                {isIOS
                                    ? "Install Easy Purchase on your Home Screen for quick access."
                                    : "Install Easy Purchase for a faster app-like experience."}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={closePrompt}
                            aria-label="Close"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={installApp}
                        className="mt-4 w-full rounded-full bg-[#D8FF65] px-5 py-3.5 text-[13px] font-semibold text-[#101411]"
                    >
                        Install App
                    </button>
                </div>
            </div>

            {showIOSGuide && (
                <div className="fixed inset-0 z-[100000] flex items-end bg-black/50 px-4 pb-4">
                    <div className="mx-auto w-full max-w-[420px] rounded-[28px] bg-white p-5 text-[#101411] shadow-[0_20px_60px_rgba(0,0,0,.25)]">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[17px] font-semibold">
                                Install Easy Purchase
                            </h3>

                            <button
                                type="button"
                                onClick={() => setShowIOSGuide(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.06]"
                                aria-label="Close"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mt-5 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D8FF65]">
                                    <Share2 className="h-4 w-4" />
                                </div>

                                <div>
                                    <p className="text-[13px] font-semibold">
                                        1. Tap Share
                                    </p>

                                    <p className="mt-1 text-[12px] leading-5 text-[#666C65]">
                                        Tap the Share icon at the bottom of Safari.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D8FF65]">
                                    <PlusSquare className="h-4 w-4" />
                                </div>

                                <div>
                                    <p className="text-[13px] font-semibold">
                                        2. Add to Home Screen
                                    </p>

                                    <p className="mt-1 text-[12px] leading-5 text-[#666C65]">
                                        Scroll down and choose “Add to Home Screen”.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D8FF65] text-[12px] font-bold">
                                    3
                                </div>

                                <div>
                                    <p className="text-[13px] font-semibold">
                                        3. Tap Add
                                    </p>

                                    <p className="mt-1 text-[12px] leading-5 text-[#666C65]">
                                        Easy Purchase will appear on your iPhone Home Screen like an app.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowIOSGuide(false)}
                            className="mt-6 w-full rounded-full bg-[#101411] px-5 py-3.5 text-[13px] font-semibold text-white"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}