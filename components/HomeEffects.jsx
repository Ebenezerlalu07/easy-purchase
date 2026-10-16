"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomeEffects() {
    const router = useRouter();

    useEffect(() => {
        let disposed = false;
        let wordTimer = null;
        let gsapContext = null;
        const cleanups = [];

        const listen = (target, event, handler, options) => {
            if (!target) return;
            target.addEventListener(event, handler, options);
            cleanups.push(() => target.removeEventListener(event, handler, options));
        };

        const initDropdowns = () => {
            const heroDropdowns = document.querySelectorAll("[data-dropdown]");
            const heroQuickFilters = document.querySelectorAll("[data-quick-filter]");
            const heroCategoryInput = document.getElementById("categoryFilter");
            const heroBrandInput = document.getElementById("brandFilter");
            const heroProductSearch = document.getElementById("productSearch");
            const heroSearchBtn = document.getElementById("heroSearchButton");

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
                    const buttonValue = button.getAttribute("data-quick-filter") || "";
                    button.classList.toggle("active", buttonValue === value);
                });
            };

            const updateCategoryDropdown = (value) => {
                const categoryDropdown = document.querySelector(
                    '[data-dropdown-type="category"]',
                );
                if (!categoryDropdown) return;

                const categoryLabel = categoryDropdown.querySelector(
                    "[data-dropdown-label]",
                );
                const options = categoryDropdown.querySelectorAll(
                    ".custom-select-option",
                );

                options.forEach((option) => {
                    const optionValue = option.getAttribute("data-value") || "";
                    const isActive = optionValue === value;
                    option.classList.toggle("active", isActive);

                    if (isActive && categoryLabel) {
                        const title = option.querySelector(".option-copy strong");
                        if (title) categoryLabel.textContent = title.textContent.trim();
                    }
                });
            };

            heroDropdowns.forEach((dropdown) => {
                const trigger = dropdown.querySelector("[data-dropdown-trigger]");
                const label = dropdown.querySelector("[data-dropdown-label]");
                const hiddenInput = dropdown.querySelector('input[type="hidden"]');
                const options = dropdown.querySelectorAll(".custom-select-option");

                if (!trigger) return;

                listen(trigger, "click", (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    const currentlyOpen = dropdown.classList.contains("open");
                    closeHeroDropdowns(dropdown);
                    dropdown.classList.toggle("open", !currentlyOpen);
                    trigger.setAttribute("aria-expanded", String(!currentlyOpen));
                });

                options.forEach((option) => {
                    listen(option, "click", (event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        const value = option.getAttribute("data-value") || "";
                        options.forEach((item) => item.classList.remove("active"));
                        option.classList.add("active");

                        const title = option.querySelector(".option-copy strong");
                        if (title && label) label.textContent = title.textContent.trim();
                        if (hiddenInput) hiddenInput.value = value;

                        if (dropdown.getAttribute("data-dropdown-type") === "category") {
                            updateHeroQuickFilter(value);
                        }

                        dropdown.classList.remove("open");
                        trigger.setAttribute("aria-expanded", "false");
                    });
                });
            });

            heroQuickFilters.forEach((button) => {
                listen(button, "click", (event) => {
                    event.preventDefault();
                    const value = button.getAttribute("data-quick-filter") || "";
                    updateHeroQuickFilter(value);
                    if (heroCategoryInput) heroCategoryInput.value = value;
                    updateCategoryDropdown(value);
                });
            });

            listen(document, "click", (event) => {
                if (!event.target.closest("[data-dropdown]")) closeHeroDropdowns();
            });

            listen(document, "keydown", (event) => {
                if (event.key === "Escape") closeHeroDropdowns();
            });

            const runHeroProductSearch = () => {
                const searchValue = heroProductSearch?.value.trim() || "";
                const categoryValue = heroCategoryInput?.value || "";
                const brandValue = heroBrandInput?.value || "";
                const params = new URLSearchParams();

                if (searchValue) params.set("search", searchValue);
                if (categoryValue) params.set("category", categoryValue);
                if (brandValue) params.set("brand", brandValue);

                const query = params.toString();
                router.push(query ? `/products?${query}` : "/products");
            };

            listen(heroSearchBtn, "click", runHeroProductSearch);
            listen(heroProductSearch, "keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    runHeroProductSearch();
                }
            });
        };

        const init = async () => {
            initDropdowns();

            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
            ).matches;

            const [{ gsap }, scrollTriggerModule] = await Promise.all([
                import("gsap"),
                import("gsap/ScrollTrigger"),
            ]);

            if (disposed) return;

            const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
            gsap.registerPlugin(ScrollTrigger);

            /* =====================================================
               HERO WORD SLIDER
               Stable on font load, resize, tab restore and route remount.
            ====================================================== */

            const wordSlider = document.getElementById("wordSlider");

            if (wordSlider) {
                const wordRows = Array.from(
                    wordSlider.querySelectorAll(".hero-word-row"),
                );

                const firstText = wordRows[0]?.textContent?.trim() || "";
                const lastText =
                    wordRows[wordRows.length - 1]?.textContent?.trim() || "";

                const hasLoopClone =
                    wordRows.length > 1 &&
                    firstText &&
                    firstText === lastText;

                const realWordCount = hasLoopClone
                    ? wordRows.length - 1
                    : wordRows.length;

                let currentWord = 0;
                let wordTween = null;
                let resizeFrame = null;

                const getWordStep = () => {
                    const firstRow = wordRows[0];

                    if (!firstRow) return 0;

                    return firstRow.getBoundingClientRect().height;
                };

                const setWordPosition = (index = currentWord) => {
                    const step = getWordStep();

                    if (!step) return;

                    gsap.set(wordSlider, {
                        y: -(index * step),
                        opacity: 1,
                        visibility: "visible",
                    });
                };

                const resetWordSlider = () => {
                    currentWord = 0;
                    wordTween?.kill();
                    gsap.killTweensOf(wordSlider);

                    gsap.set(wordSlider, {
                        y: 0,
                        opacity: 1,
                        visibility: "visible",
                    });
                };

                resetWordSlider();

                const syncWordSlider = () => {
                    if (resizeFrame) {
                        cancelAnimationFrame(resizeFrame);
                    }

                    resizeFrame = requestAnimationFrame(() => {
                        if (disposed) return;

                        wordTween?.kill();

                        if (currentWord >= realWordCount) {
                            currentWord = 0;
                        }

                        setWordPosition(currentWord);
                    });
                };

                if (!reduceMotion && realWordCount > 1) {
                    wordTimer = window.setInterval(() => {
                        if (disposed || document.hidden) return;

                        const step = getWordStep();
                        if (!step) return;

                        currentWord += 1;

                        if (!hasLoopClone && currentWord >= realWordCount) {
                            currentWord = 0;
                        }

                        wordTween?.kill();

                        wordTween = gsap.to(wordSlider, {
                            y: -(currentWord * step),
                            duration: 0.72,
                            ease: "power3.inOut",
                            overwrite: "auto",
                            onComplete: () => {
                                if (
                                    hasLoopClone &&
                                    currentWord === realWordCount
                                ) {
                                    currentWord = 0;
                                    gsap.set(wordSlider, { y: 0 });
                                }
                            },
                        });
                    }, 2500);
                }

                const handleVisibilityChange = () => {
                    if (document.visibilityState === "visible") {
                        syncWordSlider();
                    }
                };

                listen(window, "resize", syncWordSlider, {
                    passive: true,
                });

                listen(
                    document,
                    "visibilitychange",
                    handleVisibilityChange,
                );

                let wordResizeObserver = null;

                if (
                    typeof ResizeObserver !== "undefined" &&
                    wordRows[0]
                ) {
                    wordResizeObserver = new ResizeObserver(
                        syncWordSlider,
                    );

                    wordResizeObserver.observe(wordRows[0]);
                }

                if (document.fonts?.ready) {
                    document.fonts.ready.then(() => {
                        if (!disposed) {
                            syncWordSlider();
                        }
                    });
                }

                cleanups.push(() => {
                    if (resizeFrame) {
                        cancelAnimationFrame(resizeFrame);
                    }

                    wordTween?.kill();
                    wordResizeObserver?.disconnect();
                    gsap.killTweensOf(wordSlider);
                });
            }

            if (reduceMotion) {
                document
                    .querySelectorAll(
                        "[data-reveal], [data-reveal-left], [data-reveal-right], [data-footer-v3]",
                    )
                    .forEach((element) => {
                        element.style.opacity = "1";
                        element.style.transform = "none";
                    });

                document
                    .querySelectorAll(".reveal-line-inner")
                    .forEach((element) => {
                        element.style.transform = "none";
                    });

                document
                    .querySelectorAll("[data-image-reveal]")
                    .forEach((element) => {
                        element.style.clipPath =
                            "inset(0% 0% 0% 0% round 32px)";

                        const image = element.querySelector("img");

                        if (image) {
                            image.style.transform = "none";
                        }
                    });

                document
                    .querySelectorAll("[data-counter]")
                    .forEach((counter) => {
                        const end = Number(counter.dataset.counter);

                        if (Number.isFinite(end)) {
                            counter.textContent =
                                Math.round(end).toLocaleString("en-US");
                        }
                    });

                return;
            }

            gsapContext = gsap.context(() => {
                const progress = document.getElementById("scrollProgress");
                if (progress) {
                    gsap.to(progress, {
                        scaleX: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: document.documentElement,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 0.2,
                        },
                    });
                }

                /* =====================================================
                   HERO INTRO
                   Keep the hero visible by default. We animate transforms,
                   not visibility, so an interrupted effect cannot leave it hidden.
                ====================================================== */

                const heroIntro = document.querySelector(".hero-intro");
                const heroTitle = document.querySelector(".hero-title");
                const heroCopy = document.querySelector(".hero-copy");
                const heroActions = document.querySelector(".hero-actions");
                const heroCard = document.querySelector(".hero-card");
                const heroSearch = document.querySelector(".hero-search");
                const heroStatItems = document.querySelectorAll(
                    ".hero-stats > div",
                );

                const visibleHeroElements = [
                    heroIntro,
                    heroTitle,
                    heroCopy,
                    heroActions,
                    heroCard,
                    heroSearch,
                ].filter(Boolean);

                gsap.set(visibleHeroElements, {
                    opacity: 1,
                    visibility: "visible",
                });

                if (heroStatItems.length) {
                    gsap.set(heroStatItems, {
                        opacity: 1,
                        visibility: "visible",
                    });
                }

                const heroTimeline = gsap.timeline({
                    defaults: { ease: "power4.out" },
                });

                if (heroIntro) {
                    heroTimeline.fromTo(
                        heroIntro,
                        { y: 18 },
                        {
                            y: 0,
                            duration: 0.7,
                            clearProps: "transform",
                        },
                    );
                }

                if (heroTitle) {
                    heroTimeline.fromTo(
                        heroTitle,
                        { y: 54 },
                        {
                            y: 0,
                            duration: 1,
                            clearProps: "transform",
                        },
                        "-=.35",
                    );
                }

                if (heroCopy) {
                    heroTimeline.fromTo(
                        heroCopy,
                        { y: 26 },
                        {
                            y: 0,
                            duration: 0.75,
                            clearProps: "transform",
                        },
                        "-=.55",
                    );
                }

                if (heroActions) {
                    heroTimeline.fromTo(
                        heroActions,
                        { y: 22 },
                        {
                            y: 0,
                            duration: 0.72,
                            clearProps: "transform",
                        },
                        "-=.5",
                    );
                }

                if (heroCard) {
                    heroTimeline.fromTo(
                        heroCard,
                        { x: 45, scale: 0.97 },
                        {
                            x: 0,
                            scale: 1,
                            duration: 0.9,
                            clearProps: "transform",
                        },
                        "-=.7",
                    );
                }

                if (heroSearch) {
                    heroTimeline.fromTo(
                        heroSearch,
                        { y: 24 },
                        {
                            y: 0,
                            duration: 0.75,
                            clearProps: "transform",
                        },
                        "-=.55",
                    );
                }

                if (heroStatItems.length) {
                    heroTimeline.fromTo(
                        heroStatItems,
                        { y: 12 },
                        {
                            y: 0,
                            stagger: 0.07,
                            duration: 0.5,
                            clearProps: "transform",
                        },
                        "-=.4",
                    );
                }

                gsap.fromTo(
                    ".hero-bg",
                    { scale: 1 },
                    {
                        scale: 1.12,
                        yPercent: 7,
                        ease: "none",
                        scrollTrigger: {
                            trigger: "#home",
                            start: "top top",
                            end: "bottom top",
                            scrub: 1.1,
                        },
                    },
                );

                gsap.to(".hero-title", {
                    yPercent: -8,
                    ease: "none",
                    scrollTrigger: {
                        trigger: "#home",
                        start: "45% top",
                        end: "bottom top",
                        scrub: true,
                    },
                });

                gsap.utils.toArray("[data-reveal]").forEach((element) => {
                    gsap.to(element, {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power4.out",
                        scrollTrigger: { trigger: element, start: "top 88%", once: true },
                    });
                });

                gsap.utils.toArray("[data-reveal-left]").forEach((element) => {
                    gsap.to(element, {
                        opacity: 1,
                        x: 0,
                        duration: 1.15,
                        ease: "power4.out",
                        scrollTrigger: { trigger: element, start: "top 86%", once: true },
                    });
                });

                gsap.utils.toArray("[data-reveal-right]").forEach((element) => {
                    gsap.to(element, {
                        opacity: 1,
                        x: 0,
                        duration: 1.15,
                        ease: "power4.out",
                        scrollTrigger: { trigger: element, start: "top 86%", once: true },
                    });
                });

                gsap.utils.toArray("[data-stagger]").forEach((container) => {
                    gsap.from(Array.from(container.children), {
                        opacity: 0,
                        y: 55,
                        scale: 0.975,
                        duration: 0.9,
                        stagger: 0.09,
                        ease: "power4.out",
                        scrollTrigger: { trigger: container, start: "top 88%", once: true },
                    });
                });

                gsap.utils.toArray(".reveal-line-inner").forEach((line) => {
                    gsap.to(line, {
                        y: 0,
                        duration: 1.15,
                        ease: "power4.out",
                        scrollTrigger: { trigger: line, start: "top 90%", once: true },
                    });
                });

                gsap.utils.toArray("[data-image-reveal]").forEach((container) => {
                    const image = container.querySelector("img");
                    const timeline = gsap.timeline({
                        scrollTrigger: { trigger: container, start: "top 90%", once: true },
                    });

                    timeline.to(container, {
                        clipPath: "inset(0% 0% 0% 0% round 32px)",
                        duration: 1.25,
                        ease: "power4.inOut",
                    });

                    if (image) {
                        timeline.to(
                            image,
                            { scale: 1, duration: 1.45, ease: "power4.out" },
                            "-=1",
                        );
                    }
                });

                gsap.utils.toArray("[data-parallax]").forEach((image) => {
                    gsap.fromTo(
                        image,
                        { yPercent: -5 },
                        {
                            yPercent: 5,
                            ease: "none",
                            scrollTrigger: {
                                trigger: image.parentElement,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 1.2,
                            },
                        },
                    );
                });

                gsap.utils.toArray("[data-float]").forEach((element) => {
                    gsap.fromTo(
                        element,
                        { y: 10 },
                        {
                            y: -18,
                            ease: "none",
                            scrollTrigger: {
                                trigger: element.parentElement,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 1.4,
                            },
                        },
                    );
                });

                const storySteps = document.querySelectorAll(".story-step");
                const storyImages = document.querySelectorAll(".story-image");
                const storyNumber = document.getElementById("storyNumber");
                const storyLabel = document.getElementById("storyLabel");

                const setStory = (index) => {
                    storySteps.forEach((step, stepIndex) => {
                        step.classList.toggle("active", stepIndex === index);
                    });

                    storyImages.forEach((image, imageIndex) => {
                        gsap.to(image, {
                            opacity: imageIndex === index ? 1 : 0,
                            scale: imageIndex === index ? 1 : 1.08,
                            duration: imageIndex === index ? 0.9 : 0.65,
                            ease: imageIndex === index ? "power3.out" : "power2.out",
                            overwrite: true,
                        });
                    });

                    if (storyNumber) {
                        storyNumber.textContent = String(index + 1).padStart(2, "0");
                    }
                    if (storyLabel && storySteps[index]) {
                        storyLabel.textContent = storySteps[index].dataset.label || "";
                    }
                };

                const storyMM = gsap.matchMedia();
                storyMM.add("(min-width: 1024px)", () => {
                    storySteps.forEach((step, index) => {
                        ScrollTrigger.create({
                            trigger: step,
                            start: "top 56%",
                            end: "bottom 44%",
                            onEnter: () => setStory(index),
                            onEnterBack: () => setStory(index),
                        });
                    });
                });
                cleanups.push(() => storyMM.revert());

                const horizontalMM = gsap.matchMedia();
                horizontalMM.add("(min-width: 768px)", () => {
                    const section = document.getElementById("materialShowcase");
                    const track = section?.querySelector(".horizontal-track");
                    if (!section || !track) return undefined;

                    const distance = () =>
                        Math.max(0, track.scrollWidth - window.innerWidth + 80);

                    const tween = gsap.to(track, { x: () => -distance(), ease: "none" });

                    ScrollTrigger.create({
                        trigger: section,
                        start: "top top",
                        end: () => `+=${Math.max(distance() + 500, 900)}`,
                        animation: tween,
                        pin: true,
                        scrub: 1,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    });

                    return () => tween.kill();
                });
                cleanups.push(() => horizontalMM.revert());

                /* =====================================================
                   COUNTERS
                   Hero counters share one trigger. Counters elsewhere animate
                   only when their own block becomes visible.
                ====================================================== */

                const animateCounter = (
                    counter,
                    trigger,
                    delay = 0,
                ) => {
                    const end = Number(counter.dataset.counter);
                    if (!Number.isFinite(end)) return;

                    const state = { value: 0 };
                    const finalValue = Math.round(end).toLocaleString("en-US");

                    gsap.fromTo(
                        state,
                        { value: 0 },
                        {
                            value: end,
                            duration: 1.6,
                            delay,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger,
                                start: "top 92%",
                                once: true,
                            },
                            onStart: () => {
                                counter.textContent = "0";
                            },
                            onUpdate: () => {
                                counter.textContent = Math.floor(
                                    state.value,
                                ).toLocaleString("en-US");
                            },
                            onComplete: () => {
                                counter.textContent = finalValue;
                            },
                        },
                    );
                };

                const heroStats = document.querySelector(".hero-stats");

                if (heroStats) {
                    const heroCounters = Array.from(
                        heroStats.querySelectorAll("[data-counter]"),
                    );

                    heroCounters.forEach((counter, index) => {
                        animateCounter(
                            counter,
                            heroStats,
                            index * 0.06,
                        );
                    });
                }

                const allCounters = Array.from(
                    document.querySelectorAll("[data-counter]"),
                );

                const otherCounters = allCounters.filter(
                    (counter) => !heroStats?.contains(counter),
                );

                otherCounters.forEach((counter) => {
                    const trigger =
                        counter.closest(".counter-block") || counter;

                    animateCounter(counter, trigger);
                });

                const processLine = document.getElementById("processLine");
                if (processLine) {
                    gsap.from(processLine, {
                        scaleY: 0,
                        transformOrigin: "top center",
                        ease: "none",
                        scrollTrigger: {
                            trigger: processLine.parentElement,
                            start: "top 72%",
                            end: "bottom 58%",
                            scrub: 1,
                        },
                    });
                }

                const navbar = document.getElementById("mainNavbar");
                const header = document.getElementById("siteHeader");
                let lastScroll = window.scrollY;

                if (navbar && header) {
                    ScrollTrigger.create({
                        start: 80,
                        end: "max",
                        onUpdate: (self) => {
                            const current = self.scroll();

                            if (current > 80) {
                                navbar.classList.add("bg-[#0B100D]/90");
                                navbar.classList.remove("bg-black/20");
                            } else {
                                navbar.classList.remove("bg-[#0B100D]/90");
                                navbar.classList.add("bg-black/20");
                            }

                            const mobileMenuOpen = document
                                .getElementById("mobileMenu")
                                ?.classList.contains("active");

                            gsap.to(header, {
                                yPercent:
                                    current > lastScroll && current > 350 && !mobileMenuOpen
                                        ? -125
                                        : 0,
                                duration: 0.32,
                                ease: "power2.out",
                                overwrite: true,
                            });

                            lastScroll = current;
                        },
                    });
                }

                if (window.matchMedia("(pointer: fine)").matches) {
                    document.querySelectorAll("[data-magnetic]").forEach((element) => {
                        const move = (event) => {
                            const rect = element.getBoundingClientRect();
                            const x = event.clientX - rect.left - rect.width / 2;
                            const y = event.clientY - rect.top - rect.height / 2;
                            gsap.to(element, {
                                x: x * 0.12,
                                y: y * 0.12,
                                duration: 0.3,
                                ease: "power2.out",
                            });
                        };
                        const leave = () => {
                            gsap.to(element, {
                                x: 0,
                                y: 0,
                                duration: 0.55,
                                ease: "elastic.out(1,.35)",
                            });
                        };
                        listen(element, "mousemove", move);
                        listen(element, "mouseleave", leave);
                    });

                    document.querySelectorAll("[data-tilt]").forEach((card) => {
                        const move = (event) => {
                            const rect = card.getBoundingClientRect();
                            const x = (event.clientX - rect.left) / rect.width;
                            const y = (event.clientY - rect.top) / rect.height;
                            gsap.to(card, {
                                rotateX: (0.5 - y) * 4,
                                rotateY: (x - 0.5) * 4,
                                transformPerspective: 900,
                                duration: 0.35,
                                ease: "power2.out",
                            });
                        };
                        const leave = () => {
                            gsap.to(card, {
                                rotateX: 0,
                                rotateY: 0,
                                duration: 0.6,
                                ease: "power3.out",
                            });
                        };
                        listen(card, "mousemove", move);
                        listen(card, "mouseleave", leave);
                    });
                }

                gsap.utils.toArray("[data-footer-v3]").forEach((element) => {
                    gsap.to(element, {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power4.out",
                        scrollTrigger: { trigger: element, start: "top 92%", once: true },
                    });
                });

                const footerUnderline = document.querySelector(".footer-v3-underline path");
                if (footerUnderline) {
                    gsap.to(footerUnderline, {
                        strokeDashoffset: 0,
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: footerUnderline,
                            start: "top 92%",
                            once: true,
                        },
                    });
                }

                const footerWord = document.getElementById("footerV3Word");
                if (footerWord) {
                    gsap.fromTo(
                        footerWord,
                        { xPercent: -4 },
                        {
                            xPercent: 2,
                            ease: "none",
                            scrollTrigger: {
                                trigger: footerWord,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 1,
                            },
                        },
                    );
                }
            });

            const refreshScrollTrigger = () => {
                if (!disposed) {
                    ScrollTrigger.refresh();
                }
            };

            requestAnimationFrame(refreshScrollTrigger);

            if (document.fonts?.ready) {
                document.fonts.ready.then(refreshScrollTrigger);
            }

            if (document.readyState !== "complete") {
                listen(window, "load", refreshScrollTrigger, {
                    once: true,
                });
            }
        };

        init();

        return () => {
            disposed = true;
            if (wordTimer) window.clearInterval(wordTimer);
            cleanups.splice(0).forEach((cleanup) => cleanup());
            gsapContext?.revert();
        };
    }, [router]);

    return null;
}


