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

    let restored = false;

    function restoreTime() {
        const saved = parseFloat(sessionStorage.getItem(TIME_KEY) || "0");
        if (audio.readyState >= 1 && saved > 0.25 && audio.duration && saved < audio.duration - 0.25) {
            if (Math.abs((audio.currentTime || 0) - saved) > 0.35) {
                audio.currentTime = saved;
            }
        }
        restored = audio.readyState >= 1;
    }

    function remember() {
        if (!restored) return;
        const time = audio.currentTime || 0;
        const saved = parseFloat(sessionStorage.getItem(TIME_KEY) || "0");
        if (time < 0.35 && saved > 1) return;
        sessionStorage.setItem(TIME_KEY, String(time));
        sessionStorage.setItem(ON_KEY, userPaused ? "0" : "1");
    }

    function tryPlay() {
        if (userPaused || !restored) return;
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

    function resumeFromSaved() {
        restoreTime();
        tryPlay();
    }

    audio.addEventListener("loadedmetadata", resumeFromSaved);
    audio.addEventListener("timeupdate", remember);
    audio.addEventListener("play", () => {
        if (!restored) restoreTime();
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

    const wanted = new URL("snowman.mp3", window.location.href).href;
    if (audio.currentSrc !== wanted) {
        audio.src = "snowman.mp3";
    } else {
        resumeFromSaved();
    }

    document.addEventListener("click", (event) => {
        const link = event.target.closest && event.target.closest("a[href]");
        if (link) remember();
    }, true);
    window.addEventListener("pagehide", remember);
    window.addEventListener("pageshow", tryPlay);
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) remember();
        else tryPlay();
    });

    document.addEventListener("pointerdown", onGesture, true);
    document.addEventListener("touchstart", onGesture, true);
    document.addEventListener("click", onGesture, true);
    document.addEventListener("keydown", onGesture, true);
})();
