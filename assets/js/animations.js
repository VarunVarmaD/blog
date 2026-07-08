document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // 0. Inject Analog SVG Filter
    const filterHTML = `
    <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
      <filter id="wobble" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>`;
    document.body.insertAdjacentHTML('afterbegin', filterHTML);

    // 1. Initial Page Load (Staggered Reveal - slightly more organic bounce)
    const tl = gsap.timeline();
    gsap.set("body", { opacity: 1 });

    tl.from("header", { y: -20, opacity: 0, duration: 0.8, ease: "back.out(1.2)" })
      .from("main > *", { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.2)" }, "-=0.4")
      .from("footer", { y: 10, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.4");

    // 2. Nav Hover Scribbles (Applied Wobble)
    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach(link => {
        const svgHTML = `<svg class="nav-scribble" viewBox="0 0 100 10" preserveAspectRatio="none" style="position:absolute; bottom:-8px; left:0; width:100%; height:8px; filter:url(#wobble);"><path d="M0,5 Q30,2 50,5 T100,5" stroke="var(--accent-color)" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`;
        link.insertAdjacentHTML('beforeend', svgHTML);
        
        const path = link.querySelector("path");
        const length = path.getTotalLength();
        
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

        link.addEventListener("mouseenter", () => {
            gsap.to(path, { strokeDashoffset: 0, duration: 0.25, ease: "steps(8)" });
        });
        
        link.addEventListener("mouseleave", () => {
            gsap.to(path, { strokeDashoffset: length, duration: 0.25, ease: "power2.in" });
        });
    });

    // 3. Tactile Hovers on Cards and Buttons (Added slight spring)
    const tactileElements = document.querySelectorAll(".pinned-note, .stack-card, .btn");
    tactileElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            gsap.to(el, { 
                y: -5, 
                scale: 1.02, 
                boxShadow: "5px 15px 25px rgba(0, 0, 0, 0.15)",
                duration: 0.4, 
                ease: "back.out(1.5)",
                zIndex: 20
            });
        });
        
        el.addEventListener("mouseleave", () => {
            gsap.to(el, { 
                y: 0, 
                scale: 1, 
                boxShadow: el.classList.contains("btn") ? "none" : "2px 5px 15px rgba(0, 0, 0, 0.2)",
                duration: 0.4, 
                ease: "power2.out",
                zIndex: "auto"
            });
        });
    });

    // 4. ScrollTrigger for Posts and Stack Cards
    const posts = document.querySelectorAll(".post-list li, .stack-card");
    posts.forEach((post) => {
        gsap.from(post, {
            scrollTrigger: {
                trigger: post,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.2)"
        });
    });

    // 5. Sketching the Desk Borders (Wobble + Stop Motion Easing)
    const sketchElements = document.querySelectorAll(".btn-outline, .pinned-note");
    sketchElements.forEach(el => {
        const strokeColor = el.classList.contains("btn-outline") ? "var(--text-color)" : "rgba(0,0,0,0.3)";
        const rx = el.classList.contains("btn-outline") ? 8 : 2; 
        
        // Added filter:url(#wobble) to the SVG to make the lines organic and irregular
        const svgHTML = `<svg class="sketch-border" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; overflow:visible; z-index:0; filter:url(#wobble);"><rect x="0" y="0" width="100%" height="100%" fill="none" stroke="${strokeColor}" stroke-width="2" rx="${rx}" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" vector-effect="non-scaling-stroke"></rect></svg>`;
        el.insertAdjacentHTML('beforeend', svgHTML);
        
        const rect = el.querySelector(".sketch-border rect");
        
        if (el.classList.contains("pinned-note")) {
            gsap.to(rect, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                },
                strokeDashoffset: 0,
                duration: 0.9,
                ease: "steps(12)", // Stop-motion frame rate
                delay: 0.2
            });
        } else {
            tl.to(rect, {
                strokeDashoffset: 0,
                duration: 0.6,
                ease: "steps(10)" // Stop-motion frame rate
            }, "-=0.2");
        }
    });
});
