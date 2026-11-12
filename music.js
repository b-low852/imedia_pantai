(function () {
    const TIME_KEY = "xmasMusicTime";
    const ON_KEY = "xmasMusicOn";
    let userPaused = sessionStorage.getItem(ON_KEY) === "0";

    let audio = document.getElementById("backgroundMusic");
    if (!audio) {
        audio = document.createElement("audio");
        audio.id = "backgroundMusic";
        audio.loop = true;
        audio.setAttribute("playsinline", "");
        document.body.appendChild(audio);
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
