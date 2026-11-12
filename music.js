(function () {
    const TIME_KEY = "xmasMusicTime";
    const ON_KEY = "xmasMusicOn";
    let userPaused = sessionStorage.getItem(ON_KEY) === "0";

    let audio = document.getElementById("backgroundMusic");
    if (!audio) {
        const player = document.createElement("div");
        player.className = "music-player music-player-mini";
        player.innerHTML = `
            <button class="music-btn" id="musicToggle" type="button" aria-label="Toggle music">
                <img src="play.png" alt="Play music" class="play-icon">
                <span class="music-note n1">♪</span>
                <span class="music-note n2">♫</span>
                <span class="music-note n3">♪</span>
            </button>
            <span class="music-label" id="musicLabel">Music</span>
            <audio id="backgroundMusic" loop playsinline></audio>
        `;
        const style = document.createElement("style");
        style.textContent = `
            .music-player-mini {
                position: fixed;
                right: 12px;
                bottom: 12px;
                z-index: 1300;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
            }
            .music-player-mini .music-btn {
                position: relative;
                width: 110px;
                height: 130px;
                padding: 0;
                border: none;
                background: transparent;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .music-player-mini .play-icon {
                width: 110px;
                height: auto;
                display: block;
                filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.45));
                pointer-events: none;
            }
            .music-player-mini .music-label {
                color: #fff;
                font-size: 13px;
                font-weight: bold;
                text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
            }
            .music-player-mini .music-note {
                position: absolute;
                left: 8px;
                top: 28px;
                color: #fff;
                font-size: 20px;
                opacity: 0;
                pointer-events: none;
            }
            .music-player-mini .music-btn.playing .play-icon {
                animation: miniBob 1.2s ease-in-out infinite;
            }
            .music-player-mini .music-btn.playing .music-note {
                animation: miniNote 1.8s ease-out infinite;
            }
            @keyframes miniBob {
                0%, 100% { transform: translateY(0) rotate(-1deg); }
                50% { transform: translateY(-5px) rotate(1deg); }
            }
            @keyframes miniNote {
                0% { opacity: 0; transform: translate(0, 0); }
                20% { opacity: 1; }
                100% { opacity: 0; transform: translate(-24px, -48px); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(player);
        audio = player.querySelector("audio");
        player.querySelector("#musicToggle").addEventListener("click", () => window.toggleMusic());
    }

    audio.loop = true;
    audio.autoplay = !userPaused;
    if (userPaused) audio.removeAttribute("autoplay");
    audio.setAttribute("playsinline", "");
    audio.preload = "auto";
    if (userPaused) audio.pause();

    function setUi(playing) {
        const btn = document.getElementById("musicToggle");
        const label = document.getElementById("musicLabel");
        if (btn) btn.classList.toggle("playing", playing);
        if (label) label.textContent = playing ? "Playing" : "Music";
    }

    function restoreTime() {
        const saved = parseFloat(sessionStorage.getItem(TIME_KEY) || "0");
        if (saved > 0 && audio.duration && saved < audio.duration) {
            audio.currentTime = saved;
        }
    }

    function remember() {
        sessionStorage.setItem(TIME_KEY, String(audio.currentTime || 0));
        sessionStorage.setItem(ON_KEY, userPaused ? "0" : "1");
    }

    function tryPlay() {
        if (userPaused) return;
        const play = audio.play();
        if (!play) return;
        play.then(() => setUi(true)).catch(() => setUi(false));
    }

    function unlock() {
        if (userPaused || !audio.paused) return;
        const play = audio.play();
        if (!play) return;
        play.then(() => {
            setUi(true);
            sessionStorage.setItem(ON_KEY, "1");
            removeUnlock();
        }).catch(() => {});
    }

    function removeUnlock() {
        document.removeEventListener("pointerdown", onGesture, true);
        document.removeEventListener("touchstart", onGesture, true);
        document.removeEventListener("click", onGesture, true);
        document.removeEventListener("keydown", onGesture, true);
    }

    function onGesture(event) {
        if (event.target.closest && event.target.closest("#musicToggle")) return;
        unlock();
    }

    window.toggleMusic = function () {
        if (!audio.paused) {
            audio.pause();
            userPaused = true;
            setUi(false);
            remember();
            return;
        }
        userPaused = false;
        sessionStorage.setItem(ON_KEY, "1");
        tryPlay();
    };

    audio.addEventListener("loadedmetadata", restoreTime);
    audio.addEventListener("timeupdate", remember);
    audio.addEventListener("play", () => {
        if (userPaused) {
            audio.pause();
            setUi(false);
            return;
        }
        setUi(true);
    });
    audio.addEventListener("pause", () => {
        if (userPaused) setUi(false);
    });
    audio.src = "snowman.mp3";
    window.addEventListener("pagehide", remember);
    window.addEventListener("pageshow", tryPlay);
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) tryPlay();
    });

    document.addEventListener("pointerdown", onGesture, true);
    document.addEventListener("touchstart", onGesture, true);
    document.addEventListener("click", onGesture, true);
    document.addEventListener("keydown", onGesture, true);

    tryPlay();
    window.addEventListener("load", tryPlay);
})();
