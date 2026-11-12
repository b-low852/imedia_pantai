(function () {
    const style = document.createElement("style");
    style.textContent = `
        .touch-star, .touch-glow {
            position: fixed;
            z-index: 4000;
            pointer-events: none;
        }
        .touch-star {
            width: 22px;
            height: 22px;
            margin-left: -11px;
            margin-top: -11px;
            font-size: 20px;
            line-height: 1;
            text-align: center;
            filter: drop-shadow(0 0 6px #fff) drop-shadow(0 0 12px #ffe066);
            animation: touchStar 720ms ease-out forwards;
        }
        .touch-glow {
            width: 84px;
            height: 84px;
            margin-left: -42px;
            margin-top: -42px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 250, 210, 0.9) 0%, rgba(255, 214, 90, 0.45) 38%, rgba(255, 214, 90, 0) 72%);
            animation: touchGlow 520ms ease-out forwards;
        }
        @keyframes touchStar {
            0% { transform: scale(0.2) rotate(0deg); opacity: 1; }
            35% { transform: scale(1.35) rotate(18deg); opacity: 1; }
            100% { transform: scale(0.35) translateY(-22px) rotate(45deg); opacity: 0; }
        }
        @keyframes touchGlow {
            0% { transform: scale(0.4); opacity: 0.95; }
            100% { transform: scale(1.35); opacity: 0; }
        }
        .scroll-hint {
            position: fixed;
            left: 50%;
            bottom: 18px;
            z-index: 3500;
            width: 48px;
            height: 48px;
            margin: 0;
            padding: 0 0 4px;
            border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.75);
            background: rgba(0, 0, 0, 0.5);
            color: #fff6c2;
            font-size: 30px;
            line-height: 1;
            display: none;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transform: translateX(-50%);
            box-shadow: 0 0 14px rgba(255, 214, 90, 0.55);
            animation: hintBounce 1.15s ease-in-out infinite;
        }
        .scroll-hint.is-visible {
            display: flex;
        }
        @keyframes hintBounce {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(8px); }
        }
    `;
    document.head.appendChild(style);

    let lastStar = 0;
    let lastX = 0;
    let lastY = 0;
    let lastTouch = 0;
    const glyphs = ["⭐", "✨", "✦"];

    function spawn(x, y, big) {
        const star = document.createElement("div");
        star.className = "touch-star";
        star.textContent = big ? "✨" : glyphs[Math.floor(Math.random() * glyphs.length)];
        star.style.left = x + "px";
        star.style.top = y + "px";
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 760);
    }

    function glow(x, y) {
        let spot = document.getElementById("touchGlow");
        if (!spot) {
            spot = document.createElement("div");
            spot.id = "touchGlow";
            spot.className = "touch-glow";
            document.body.appendChild(spot);
        }
        spot.style.left = x + "px";
        spot.style.top = y + "px";
        spot.style.animation = "none";
        void spot.offsetWidth;
        spot.style.animation = "touchGlow 520ms ease-out forwards";
    }

    function follow(x, y, burst) {
        lastX = x;
        lastY = y;
        lastTouch = Date.now();
        glow(x, y);
        const now = Date.now();
        if (!burst && now - lastStar < 50) return;
        lastStar = now;
        spawn(x, y, burst);
    }

    document.addEventListener("touchstart", (event) => {
        const touch = event.touches[0];
        if (touch) follow(touch.clientX, touch.clientY, true);
    }, { passive: true });

    document.addEventListener("touchmove", (event) => {
        const touch = event.touches[0];
        if (touch) follow(touch.clientX, touch.clientY, false);
    }, { passive: true });

    document.addEventListener("mousedown", (event) => {
        if (Date.now() - lastTouch < 500) return;
        follow(event.clientX, event.clientY, true);
    });

    document.addEventListener("mousemove", (event) => {
        if (Date.now() - lastTouch < 500) return;
        follow(event.clientX, event.clientY, false);
    });

    window.addEventListener("scroll", () => {
        if (Date.now() - lastTouch > 450) return;
        follow(lastX, lastY, false);
    }, { passive: true });

    const hint = document.createElement("button");
    hint.className = "scroll-hint";
    hint.type = "button";
    hint.setAttribute("aria-label", "Scroll down");
    hint.textContent = "⌄";
    document.body.appendChild(hint);

    function scrollBox() {
        const modal = document.querySelector(".modal");
        if (modal && getComputedStyle(modal).display !== "none") {
            const inner = modal.querySelector(".modal-content");
            if (inner && inner.scrollHeight > inner.clientHeight + 24) return inner;
        }
        return document.scrollingElement || document.documentElement;
    }

    function updateHint() {
        const box = scrollBox();
        const top = box === document.scrollingElement || box === document.documentElement
            ? window.scrollY
            : box.scrollTop;
        const hidden = box.scrollHeight - box.clientHeight - top;
        hint.classList.toggle("is-visible", hidden > 28);
    }

    hint.addEventListener("click", () => {
        const box = scrollBox();
        const distance = Math.round((box.clientHeight || window.innerHeight) * 0.72);
        if (box === document.scrollingElement || box === document.documentElement) {
            window.scrollBy({ top: distance, behavior: "smooth" });
        } else {
            box.scrollBy({ top: distance, behavior: "smooth" });
        }
    });

    window.addEventListener("scroll", updateHint, { passive: true });
    window.addEventListener("resize", updateHint);
    document.addEventListener("scroll", updateHint, true);
    window.addEventListener("load", updateHint);
    setInterval(updateHint, 500);
    updateHint();
})();
