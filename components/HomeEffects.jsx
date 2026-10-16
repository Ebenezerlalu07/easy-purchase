"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomeEffects() {
    const router = useRouter();

    useEffect(() => {
        let disposed = false;
        let gsapContext = null;
        let wordTimer = null;
        const cleanups = [];

        const listen = (target, event, handler, options) => {
            if (!target) return;
            target.addEventListener(event, handler, options);
            cleanups.push(() =>
                target.removeEventListener(event, handler, options)
            );
        };

        /* =========================================================
           DROPDOWNS / SEARCH
           Lightweight and safe on all devices.
        ========================================================= */

        const initDropdowns = () => {
            const heroDropdowns =
                document.querySelectorAll("[data-dropdown]");

            const heroQuickFilters =
                document.querySelectorAll("[data-quick-filter]");

            const heroCategoryInput =
                document.getElementById("categoryFilter");

            const heroBrandInput =
                document.getElementById("brandFilter");

            const heroProductSearch =
                document.getElementById("productSearch");

            const heroSearchBtn =
                document.getElementById("heroSearchButton");

            const closeHeroDropdowns = (except = null) => {
                heroDropdowns.forEach((dropdown) => {
                    if (dropdown === except) return;

                    dropdown.classList.remove("open");

                    dropdown
                        .querySelector("[data-dropdown-trigger]")
                        ?.setAttribute("aria-expanded", "false");
                });
            };

            const updateHeroQuickFilter = (value) => {
                heroQuickFilters.forEach((button) => {
                    const buttonValue =
                        button.getAttribute("data-quick-filter") || "";

                    button.classList.toggle(
                        "active",
                        buttonValue === value
                    );
                });
            };

            const updateCategoryDropdown = (value) => {
                const categoryDropdown = document.querySelector(
                    '[data-dropdown-type="category"]'
                );

                if (!categoryDropdown) return;

                const categoryLabel =
                    categoryDropdown.querySelector(
                        "[data-dropdown-label]"
                    );

                const options =
                    categoryDropdown.querySelectorAll(
                        ".custom-select-option"
                    );

                options.forEach((option) => {
                    const optionValue =
                        option.getAttribute("data-value") || "";

                    const isActive =
                        optionValue === value;

                    option.classList.toggle(
                        "active",
                        isActive
                    );

                    if (isActive && categoryLabel) {
                        const title =
                            option.querySelector(
                                ".option-copy strong"
                            );

                        if (title) {
                            categoryLabel.textContent =
                                title.textContent.trim();
                        }
                    }
                });
            };

            heroDropdowns.forEach((dropdown) => {
                const trigger =
                    dropdown.querySelector(
                        "[data-dropdown-trigger]"
                    );

                const label =
                    dropdown.querySelector(
                        "[data-dropdown-label]"
                    );

                const hiddenInput =
                    dropdown.querySelector(
                        'input[type="hidden"]'
                    );

                const options =
                    dropdown.querySelectorAll(
                        ".custom-select-option"
                    );

                if (!trigger) return;

                listen(trigger, "click", (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    const currentlyOpen =
                        dropdown.classList.contains("open");

                    closeHeroDropdowns(dropdown);

                    dropdown.classList.toggle(
                        "open",
                        !currentlyOpen
                    );

                    trigger.setAttribute(
                        "aria-expanded",
                        String(!currentlyOpen)
                    );
                });

                options.forEach((option) => {
                    listen(option, "click", (event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        const value =
                            option.getAttribute("data-value") || "";

                        options.forEach((item) =>
                            item.classList.remove("active")
                        );

                        option.classList.add("active");

                        const title =
                            option.querySelector(
                                ".option-copy strong"
                            );

                        if (title && label) {
                            label.textContent =
                                title.textContent.trim();
                        }

                        if (hiddenInput) {
                            hiddenInput.value = value;
                        }

                        if (
                            dropdown.getAttribute(
                                "data-dropdown-type"
                            ) === "category"
                        ) {
                            updateHeroQuickFilter(value);
                        }

                        dropdown.classList.remove("open");

                        trigger.setAttribute(
                            "aria-expanded",
                            "false"
                        );
                    });
                });
            });

            heroQuickFilters.forEach((button) => {
                listen(button, "click", (event) => {
                    event.preventDefault();

                    const value =
                        button.getAttribute(
                            "data-quick-filter"
                        ) || "";

                    updateHeroQuickFilter(value);

                    if (heroCategoryInput) {
                        heroCategoryInput.value = value;
                    }

                    updateCategoryDropdown(value);
                });
            });

            listen(document, "click", (event) => {
                if (
                    !event.target.closest(
                        "[data-dropdown]"
                    )
                ) {
                    closeHeroDropdowns();
                }
            });

            listen(document, "keydown", (event) => {
                if (event.key === "Escape") {
                    closeHeroDropdowns();
                }
            });

            const runHeroProductSearch = () => {
                const searchValue =
                    heroProductSearch?.value.trim() || "";

                const categoryValue =
                    heroCategoryInput?.value || "";

                const brandValue =
                    heroBrandInput?.value || "";

                const params =
                    new URLSearchParams();

                if (searchValue) {
                    params.set("search", searchValue);
                }

                if (categoryValue) {
                    params.set(
                        "category",
                        categoryValue
                    );
                }

                if (brandValue) {
                    params.set("brand", brandValue);
                }

                const query =
                    params.toString();

                router.push(
                    query
                        ? `/?${query}`
                        : "/"
                );
            };

            listen(
                heroSearchBtn,
                "click",
                runHeroProductSearch
            );

            listen(
                heroProductSearch,
                "keydown",
                (event) => {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        runHeroProductSearch();
                    }
                }
            );
        };

        /* =========================================================
           MOBILE / IPHONE STATIC MODE
           No GSAP, no ScrollTrigger, no scrub/pin/parallax,
           no navbar scroll animation.
        ========================================================= */

        const showStaticContent = () => {
            document
                .querySelectorAll(
                    [
                        "[data-reveal]",
                        "[data-reveal-left]",
                        "[data-reveal-right]",
                        "[data-footer-v3]",
                        ".hero-intro",
                        ".hero-title",
                        ".hero-copy",
                        ".hero-actions",
                        ".hero-card",
                        ".hero-search",
                        ".hero-stats > div",
                    ].join(",")
                )
                .forEach((element) => {
                    element.style.opacity = "1";
                    element.style.visibility = "visible";
                    element.style.transform = "none";
                    element.style.willChange = "auto";
                });

            document
                .querySelectorAll(
                    ".reveal-line-inner"
                )
                .forEach((element) => {
                    element.style.transform = "none";
                    element.style.willChange = "auto";
                });

            document
                .querySelectorAll(
                    "[data-image-reveal]"
                )
                .forEach((element) => {
                    element.style.clipPath = "none";
                    element.style.willChange = "auto";

                    const image =
                        element.querySelector("img");

                    if (image) {
                        image.style.transform = "none";
                        image.style.willChange = "auto";
                    }
                });

            document
                .querySelectorAll(
                    "[data-parallax], [data-float], [data-magnetic], [data-tilt]"
                )
                .forEach((element) => {
                    element.style.transform = "none";
                    element.style.willChange = "auto";
                });

            document
                .querySelectorAll(
                    "[data-counter]"
                )
                .forEach((counter) => {
                    const end =
                        Number(counter.dataset.counter);

                    if (Number.isFinite(end)) {
                        counter.textContent =
                            Math.round(end).toLocaleString(
                                "en-US"
                            );
                    }
                });

            const wordSlider =
                document.getElementById(
                    "wordSlider"
                );

            if (wordSlider) {
                wordSlider.style.transform =
                    "translateY(0)";
                wordSlider.style.opacity = "1";
                wordSlider.style.visibility =
                    "visible";
                wordSlider.style.willChange =
                    "auto";
            }

            const progress =
                document.getElementById(
                    "scrollProgress"
                );

            if (progress) {
                progress.style.display = "none";
            }

            // Keep navbar completely static.
            const header =
                document.getElementById(
                    "siteHeader"
                );

            const navbar =
                document.getElementById(
                    "mainNavbar"
                );

            if (header) {
                header.style.transform = "none";
                header.style.willChange = "auto";
            }

            if (navbar) {
                navbar.style.transform = "none";
                navbar.style.willChange = "auto";
            }
        };

        /* =========================================================
           DESKTOP ANIMATIONS ONLY
        ========================================================= */

        const initDesktopAnimations =
            async () => {
                const [{ gsap }, scrollTriggerModule] =
                    await Promise.all([
                        import("gsap"),
                        import("gsap/ScrollTrigger"),
                    ]);

                if (disposed) return;

                const ScrollTrigger =
                    scrollTriggerModule.ScrollTrigger;

                gsap.registerPlugin(
                    ScrollTrigger
                );

                gsapContext = gsap.context(() => {
                    /* -----------------------------------------
                       Scroll progress
                    ----------------------------------------- */

                    const progress =
                        document.getElementById(
                            "scrollProgress"
                        );

                    if (progress) {
                        gsap.to(progress, {
                            scaleX: 1,
                            ease: "none",
                            scrollTrigger: {
                                trigger:
                                    document.documentElement,
                                start: "top top",
                                end: "bottom bottom",
                                scrub: 0.25,
                            },
                        });
                    }

                    /* -----------------------------------------
                       Hero intro
                    ----------------------------------------- */

                    const heroElements = [
                        document.querySelector(
                            ".hero-intro"
                        ),
                        document.querySelector(
                            ".hero-title"
                        ),
                        document.querySelector(
                            ".hero-copy"
                        ),
                        document.querySelector(
                            ".hero-actions"
                        ),
                        document.querySelector(
                            ".hero-card"
                        ),
                        document.querySelector(
                            ".hero-search"
                        ),
                    ].filter(Boolean);

                    gsap.set(heroElements, {
                        opacity: 1,
                        visibility: "visible",
                    });

                    const heroStats =
                        document.querySelectorAll(
                            ".hero-stats > div"
                        );

                    if (heroStats.length) {
                        gsap.set(heroStats, {
                            opacity: 1,
                            visibility: "visible",
                        });
                    }

                    const heroTimeline =
                        gsap.timeline({
                            defaults: {
                                ease: "power3.out",
                            },
                        });

                    heroElements.forEach(
                        (element, index) => {
                            heroTimeline.fromTo(
                                element,
                                {
                                    y:
                                        index === 1
                                            ? 42
                                            : 18,
                                },
                                {
                                    y: 0,
                                    duration: 0.7,
                                    clearProps: "transform",
                                },
                                index === 0
                                    ? 0
                                    : "-=0.5"
                            );
                        }
                    );

                    if (heroStats.length) {
                        heroTimeline.fromTo(
                            heroStats,
                            {
                                y: 10,
                            },
                            {
                                y: 0,
                                duration: 0.45,
                                stagger: 0.06,
                                clearProps: "transform",
                            },
                            "-=0.3"
                        );
                    }

                    /* -----------------------------------------
                       Word slider
                    ----------------------------------------- */

                    const wordSlider =
                        document.getElementById(
                            "wordSlider"
                        );

                    if (wordSlider) {
                        const wordRows = Array.from(
                            wordSlider.querySelectorAll(
                                ".hero-word-row"
                            )
                        );

                        const firstText =
                            wordRows[0]
                                ?.textContent?.trim() || "";

                        const lastText =
                            wordRows[
                                wordRows.length - 1
                            ]?.textContent?.trim() || "";

                        const hasLoopClone =
                            wordRows.length > 1 &&
                            firstText &&
                            firstText === lastText;

                        const realWordCount =
                            hasLoopClone
                                ? wordRows.length - 1
                                : wordRows.length;

                        let currentWord = 0;

                        const getWordStep = () => {
                            return (
                                wordRows[0]
                                    ?.getBoundingClientRect()
                                    .height || 0
                            );
                        };

                        if (realWordCount > 1) {
                            wordTimer =
                                window.setInterval(() => {
                                    if (
                                        disposed ||
                                        document.hidden
                                    ) {
                                        return;
                                    }

                                    const step =
                                        getWordStep();

                                    if (!step) return;

                                    currentWord += 1;

                                    gsap.to(wordSlider, {
                                        y:
                                            -currentWord *
                                            step,
                                        duration: 0.65,
                                        ease: "power3.inOut",
                                        overwrite: "auto",
                                        onComplete: () => {
                                            if (
                                                hasLoopClone &&
                                                currentWord ===
                                                realWordCount
                                            ) {
                                                currentWord = 0;
                                                gsap.set(
                                                    wordSlider,
                                                    { y: 0 }
                                                );
                                            } else if (
                                                !hasLoopClone &&
                                                currentWord >=
                                                realWordCount
                                            ) {
                                                currentWord = 0;
                                                gsap.set(
                                                    wordSlider,
                                                    { y: 0 }
                                                );
                                            }
                                        },
                                    });
                                }, 2800);
                        }
                    }

                    /* -----------------------------------------
                       Simple reveal animations
                    ----------------------------------------- */

                    const revealConfigs = [
                        {
                            selector:
                                "[data-reveal]",
                            from: { y: 36 },
                        },
                        {
                            selector:
                                "[data-reveal-left]",
                            from: { x: -40 },
                        },
                        {
                            selector:
                                "[data-reveal-right]",
                            from: { x: 40 },
                        },
                    ];

                    revealConfigs.forEach(
                        ({ selector, from }) => {
                            gsap.utils
                                .toArray(selector)
                                .forEach((element) => {
                                    gsap.fromTo(
                                        element,
                                        {
                                            opacity: 0,
                                            ...from,
                                        },
                                        {
                                            opacity: 1,
                                            x: 0,
                                            y: 0,
                                            duration: 0.8,
                                            ease: "power3.out",
                                            scrollTrigger: {
                                                trigger: element,
                                                start: "top 90%",
                                                once: true,
                                            },
                                        }
                                    );
                                });
                        }
                    );

                    /* -----------------------------------------
                       Stagger
                    ----------------------------------------- */

                    gsap.utils
                        .toArray("[data-stagger]")
                        .forEach((container) => {
                            gsap.from(
                                Array.from(
                                    container.children
                                ),
                                {
                                    opacity: 0,
                                    y: 35,
                                    duration: 0.7,
                                    stagger: 0.07,
                                    ease: "power3.out",
                                    scrollTrigger: {
                                        trigger: container,
                                        start: "top 90%",
                                        once: true,
                                    },
                                }
                            );
                        });

                    /* -----------------------------------------
                       Image reveal
                    ----------------------------------------- */

                    gsap.utils
                        .toArray(
                            "[data-image-reveal]"
                        )
                        .forEach((container) => {
                            const image =
                                container.querySelector(
                                    "img"
                                );

                            const timeline =
                                gsap.timeline({
                                    scrollTrigger: {
                                        trigger: container,
                                        start: "top 92%",
                                        once: true,
                                    },
                                });

                            timeline.to(container, {
                                clipPath:
                                    "inset(0% 0% 0% 0% round 32px)",
                                duration: 0.9,
                                ease: "power3.inOut",
                            });

                            if (image) {
                                timeline.to(
                                    image,
                                    {
                                        scale: 1,
                                        duration: 1,
                                        ease: "power3.out",
                                    },
                                    "-=0.7"
                                );
                            }
                        });

                    /* -----------------------------------------
                       Counters
                    ----------------------------------------- */

                    gsap.utils
                        .toArray("[data-counter]")
                        .forEach((counter) => {
                            const end =
                                Number(
                                    counter.dataset.counter
                                );

                            if (
                                !Number.isFinite(end)
                            ) {
                                return;
                            }

                            const state = {
                                value: 0,
                            };

                            gsap.fromTo(
                                state,
                                {
                                    value: 0,
                                },
                                {
                                    value: end,
                                    duration: 1.2,
                                    ease: "power3.out",
                                    scrollTrigger: {
                                        trigger: counter,
                                        start: "top 92%",
                                        once: true,
                                    },
                                    onUpdate: () => {
                                        counter.textContent =
                                            Math.floor(
                                                state.value
                                            ).toLocaleString(
                                                "en-US"
                                            );
                                    },
                                    onComplete: () => {
                                        counter.textContent =
                                            Math.round(
                                                end
                                            ).toLocaleString(
                                                "en-US"
                                            );
                                    },
                                }
                            );
                        });

                    /* -----------------------------------------
                       Desktop-only horizontal showcase
                    ----------------------------------------- */

                    const horizontalMM =
                        gsap.matchMedia();

                    horizontalMM.add(
                        "(min-width: 1024px)",
                        () => {
                            const section =
                                document.getElementById(
                                    "materialShowcase"
                                );

                            const track =
                                section?.querySelector(
                                    ".horizontal-track"
                                );

                            if (
                                !section ||
                                !track
                            ) {
                                return undefined;
                            }

                            const distance = () =>
                                Math.max(
                                    0,
                                    track.scrollWidth -
                                    window.innerWidth +
                                    80
                                );

                            const tween =
                                gsap.to(track, {
                                    x: () =>
                                        -distance(),
                                    ease: "none",
                                });

                            ScrollTrigger.create({
                                trigger: section,
                                start: "top top",
                                end: () =>
                                    `+=${Math.max(
                                        distance() + 400,
                                        800
                                    )}`,
                                animation: tween,
                                pin: true,
                                scrub: 1,
                                invalidateOnRefresh:
                                    true,
                            });

                            return () =>
                                tween.kill();
                        }
                    );

                    cleanups.push(() =>
                        horizontalMM.revert()
                    );

                    /* -----------------------------------------
                       Footer reveal only
                       Removed footer scrub animation.
                    ----------------------------------------- */

                    gsap.utils
                        .toArray(
                            "[data-footer-v3]"
                        )
                        .forEach((element) => {
                            gsap.fromTo(
                                element,
                                {
                                    opacity: 0,
                                    y: 24,
                                },
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.75,
                                    ease: "power3.out",
                                    scrollTrigger: {
                                        trigger: element,
                                        start: "top 94%",
                                        once: true,
                                    },
                                }
                            );
                        });

                    /* -----------------------------------------
                       IMPORTANT:
                       No navbar ScrollTrigger.
                       No header hide/show animation.
                       No background class switching.
                       No hero parallax.
                       No floating scrub.
                       No magnetic/tilt effects.
                    ----------------------------------------- */
                });

                requestAnimationFrame(() => {
                    if (!disposed) {
                        ScrollTrigger.refresh();
                    }
                });
            };

        /* =========================================================
           INIT
        ========================================================= */

        initDropdowns();

        const reduceMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

        const isMobile =
            window.matchMedia(
                "(max-width: 767px)"
            ).matches;

        const isTouch =
            window.matchMedia(
                "(pointer: coarse)"
            ).matches;

        /*
         * iPhone / mobile:
         * do not even download GSAP.
         */
        if (
            reduceMotion ||
            isMobile ||
            isTouch
        ) {
            showStaticContent();
        } else {
            initDesktopAnimations();
        }

        return () => {
            disposed = true;

            if (wordTimer) {
                window.clearInterval(
                    wordTimer
                );
            }

            cleanups
                .splice(0)
                .forEach((cleanup) =>
                    cleanup()
                );

            gsapContext?.revert();
        };
    }, [router]);

    return null;
}
