"use client";



import { useEffect, useState } from "react";

import {

    Download,

    Share2,

    X,

    PlusSquare,

    ArrowRight,

    Smartphone,

} from "lucide-react";



export default function InstallAppPrompt() {

    const [show, setShow] = useState(false);

    const [installEvent, setInstallEvent] = useState(null);

    const [isIOS, setIsIOS] = useState(false);

    const [showIOSGuide, setShowIOSGuide] = useState(false);

    const [showAndroidGuide, setShowAndroidGuide] = useState(false);



    useEffect(() => {
        const SESSION_KEY = "toprange-install-prompt-shown";

        /* =====================================================
           CHECK IF APP IS ALREADY INSTALLED
        ===================================================== */

        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone === true;

        if (isStandalone) {
            return;
        }

        /* =====================================================
           SHOW ONLY ON FIRST LOAD OF THIS BROWSER SESSION
        ===================================================== */

        const alreadyShown =
            sessionStorage.getItem(SESSION_KEY) === "true";

        if (alreadyShown) {
            return;
        }

        /* =====================================================
           DEVICE CHECK
        ===================================================== */

        const ua = window.navigator.userAgent.toLowerCase();

        const ios =
            /iphone|ipad|ipod/.test(ua) ||
            (navigator.platform === "MacIntel" &&
                navigator.maxTouchPoints > 1);

        setIsIOS(ios);

        /* =====================================================
           ANDROID / CHROME INSTALL EVENT
        ===================================================== */

        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault();
            setInstallEvent(event);
        };

        window.addEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt,
        );

        /* =====================================================
           FIRST LOAD POPUP
        ===================================================== */

        const timer = setTimeout(() => {
            sessionStorage.setItem(SESSION_KEY, "true");
            setShow(true);
        }, 1500);

        return () => {
            clearTimeout(timer);

            window.removeEventListener(
                "beforeinstallprompt",
                handleBeforeInstallPrompt,
            );
        };
    }, []);



    /* =====================================================

       INSTALL

    ===================================================== */



    const installApp = async () => {

        if (isIOS) {

            setShowIOSGuide(true);

            return;

        }



        if (installEvent) {

            try {

                installEvent.prompt();



                const choice = await installEvent.userChoice;



                if (choice?.outcome === "accepted") {

                    setShow(false);

                }



                setInstallEvent(null);

            } catch (error) {

                console.error("Install prompt failed:", error);



                setShowAndroidGuide(true);

            }



            return;

        }



        setShowAndroidGuide(true);

    };



    /* =====================================================

       CLOSE

    ===================================================== */



    const closePrompt = () => {

        setShow(false);

    };



    if (!show) {

        return null;

    }



    return (

        <>

            {/* =====================================================

          MAIN INSTALL CARD

      ===================================================== */}



            <div className="fixed bottom-3 left-3 right-3 z-[99999] mx-auto max-w-[430px] sm:bottom-5 sm:left-5 sm:right-5">

                <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[#101411] shadow-[0_24px_70px_rgba(0,0,0,.38)]">

                    <div className="p-4 sm:p-5">

                        <div className="flex items-start gap-3.5">

                            {/* Icon */}



                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-[#D8FF65] text-[#101411]">

                                {isIOS ? (

                                    <Share2 className="h-5 w-5" />

                                ) : (

                                    <Download className="h-5 w-5" />

                                )}

                            </div>



                            {/* Content */}



                            <div className="min-w-0 flex-1 pt-0.5">

                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#D8FF65]">

                                    Easy Purchase App

                                </p>



                                <h3 className="mt-1.5 text-[16px] font-semibold leading-5 tracking-[-0.02em] text-white">

                                    Add Easy Purchase

                                    <br />

                                    to your phone

                                </h3>



                                <p className="mt-2 max-w-[280px] text-[11px] leading-5 text-white/50">

                                    {isIOS

                                        ? "Add Easy Purchase to your Home Screen for faster access."

                                        : "Install Easy Purchase for a faster, app-like experience."}

                                </p>

                            </div>



                            {/* Close */}



                            <button

                                type="button"

                                onClick={closePrompt}

                                aria-label="Close install prompt"

                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/60 transition hover:bg-white hover:text-[#101411]"

                            >

                                <X className="h-4 w-4" />

                            </button>

                        </div>



                        {/* Install button */}



                        <button

                            type="button"

                            onClick={installApp}

                            className="group mt-5 flex h-[54px] w-full items-center justify-between rounded-full bg-[#D8FF65] pl-5 pr-1.5 text-[13px] font-semibold text-[#101411] transition hover:bg-white"

                        >

                            <span>

                                {isIOS ? "View Install Steps" : "Install App"}

                            </span>



                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#101411] text-white">

                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />

                            </span>

                        </button>



                        <p className="mt-3 text-center text-[9px] leading-4 text-white/30">

                            Quick access directly from your Home Screen

                        </p>

                    </div>

                </div>

            </div>



            {/* =====================================================

          IOS GUIDE

      ===================================================== */}



            {showIOSGuide && (

                <div className="fixed inset-0 z-[100000] flex items-end bg-[#07100D]/75 p-3 sm:items-center sm:justify-center sm:p-5">

                    <div className="mx-auto w-full max-w-[430px] overflow-hidden rounded-[28px] bg-[#F4F5EF] shadow-[0_30px_100px_rgba(0,0,0,.35)]">

                        {/* Header */}



                        <div className="bg-[#101411] p-5 text-white sm:p-6">

                            <div className="flex items-start justify-between gap-4">

                                <div>

                                    <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#D8FF65]">

                                        iPhone / iPad

                                    </p>



                                    <h3 className="mt-2 text-[22px] font-semibold tracking-[-0.03em]">

                                        Install Easy Purchase

                                    </h3>



                                    <p className="mt-2 text-[11px] leading-5 text-white/45">

                                        Add the website to your Home Screen in three

                                        simple steps.

                                    </p>

                                </div>



                                <button

                                    type="button"

                                    onClick={() => setShowIOSGuide(false)}

                                    aria-label="Close"

                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white"

                                >

                                    <X className="h-4 w-4" />

                                </button>

                            </div>

                        </div>



                        {/* Steps */}



                        <div className="p-5 sm:p-6">

                            <div className="space-y-3">

                                <InstallStep

                                    number="01"

                                    icon={<Share2 className="h-4 w-4" />}

                                    title="Tap Share"

                                    description="Tap the Share icon in Safari."

                                />



                                <InstallStep

                                    number="02"

                                    icon={<PlusSquare className="h-4 w-4" />}

                                    title="Add to Home Screen"

                                    description='Scroll through the menu and select "Add to Home Screen".'

                                />



                                <InstallStep

                                    number="03"

                                    title="Tap Add"

                                    description="Confirm by tapping Add. Easy Purchase will appear like a normal app."

                                />

                            </div>



                            <button

                                type="button"

                                onClick={() => {

                                    setShowIOSGuide(false);

                                    setShow(false);

                                }}

                                className="mt-6 flex h-[54px] w-full items-center justify-center rounded-full bg-[#101411] text-[13px] font-semibold text-white"

                            >

                                Got it

                            </button>

                        </div>

                    </div>

                </div>

            )}



            {/* =====================================================

          ANDROID / MANUAL GUIDE

      ===================================================== */}



            {showAndroidGuide && (

                <div className="fixed inset-0 z-[100000] flex items-end bg-[#07100D]/75 p-3 sm:items-center sm:justify-center sm:p-5">

                    <div className="mx-auto w-full max-w-[430px] overflow-hidden rounded-[28px] bg-[#F4F5EF] shadow-[0_30px_100px_rgba(0,0,0,.35)]">

                        {/* Header */}



                        <div className="bg-[#101411] p-5 text-white sm:p-6">

                            <div className="flex items-start justify-between gap-4">

                                <div>

                                    <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#D8FF65]">

                                        Android

                                    </p>



                                    <h3 className="mt-2 text-[22px] font-semibold tracking-[-0.03em]">

                                        Install Easy Purchase

                                    </h3>



                                    <p className="mt-2 text-[11px] leading-5 text-white/45">

                                        Your browser has not provided the automatic

                                        installation window.

                                    </p>

                                </div>



                                <button

                                    type="button"

                                    onClick={() => setShowAndroidGuide(false)}

                                    aria-label="Close"

                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white"

                                >

                                    <X className="h-4 w-4" />

                                </button>

                            </div>

                        </div>



                        {/* Steps */}



                        <div className="p-5 sm:p-6">

                            <div className="space-y-3">

                                <InstallStep

                                    number="01"

                                    title="Open browser menu"

                                    description="Tap the three-dot menu in Chrome."

                                />



                                <InstallStep

                                    number="02"

                                    icon={<Smartphone className="h-4 w-4" />}

                                    title="Install App"

                                    description='Choose "Install app" or "Add to Home screen".'

                                />



                                <InstallStep

                                    number="03"

                                    title="Confirm"

                                    description="Tap Install to add Easy Purchase to your phone."

                                />

                            </div>



                            <button

                                type="button"

                                onClick={() => {

                                    setShowAndroidGuide(false);

                                    setShow(false);

                                }}

                                className="mt-6 flex h-[54px] w-full items-center justify-center rounded-full bg-[#101411] text-[13px] font-semibold text-white"

                            >

                                Got it

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>

    );

}



/* =========================================================

   INSTALL STEP

\========================================================= */



function InstallStep({

    number,

    icon,

    title,

    description,

}) {

    return (

        <div className="flex items-start gap-3 rounded-[17px] border border-black/[0.06] bg-white p-3.5">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#D8FF65] text-[11px] font-bold text-[#101411]">

                {icon || number}

            </div>



            <div className="min-w-0 pt-0.5">

                <p className="text-[12px] font-semibold text-[#101411]">

                    {title}

                </p>



                <p className="mt-1 text-[11px] leading-5 text-[#666C65]">

                    {description}

                </p>

            </div>

        </div>

    );

}