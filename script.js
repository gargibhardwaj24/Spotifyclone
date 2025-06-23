let currentSong = new Audio();
const playBtn = document.getElementById("play"); // this is your play/pause button

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];

  for (let index = 0; index < as.length; index++) {
    const href = as[index].href;

    if (href.includes(".mp3") && href.endsWith("/.preview")) {
      const fileWithPreview = href.split("/songs/")[1];
      const fileName = fileWithPreview.split("/")[0];
      songs.push(fileName);
    }
  }

  return songs;
}
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function setupTimeUpdates(audioElement) {
  const currentTimeEl = document.getElementById("currentTime");
  const durationEl = document.getElementById("duration");

  if (!currentTimeEl || !durationEl) {
    console.warn("Missing #currentTime or #duration in HTML.");
    return;
  }

  audioElement.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audioElement.duration);
  });

  audioElement.addEventListener("timeupdate", () => {
    currentTimeEl.textContent = formatTime(audioElement.currentTime);
  });
}

async function main() {
  const songs = await getSongs();
  console.log("Songs found:", songs);

  const buttons = document.querySelectorAll(".songList .songs");

  buttons.forEach((btn, i) => {
    if (songs[i]) {
      btn.textContent = `▶ ${decodeURIComponent(songs[i].split(".mp3")[0])}`;

      btn.addEventListener("click", () => {
        currentSong.pause();
        currentSong.currentTime = 0;
        currentSong.src = `songs/${songs[i]}`;
        document.querySelector(".songinfo").innerHTML = decodeURIComponent(songs[i].replace(".mp3", ""));
        document.getElementById("currentTime").textContent = "0:00";
        document.getElementById("duration").textContent = "0:00";


        setupTimeUpdates(currentSong);

        currentSong.play()
          .then(() => {
            playBtn.src = "svg/pause.svg";
            //  updateTimeUI(); 
            console.log("Now playing:", songs[i]);
          })
          .catch(err => console.error("Playback failed:", err));

      });
    } else {
      btn.textContent = "— no song —";
      btn.disabled = true;
    }


  });

  // const playBtn = document.getElementById("play");

  playBtn.addEventListener("click", () => {
    if (!currentSong.src) return; // do nothing if no song loaded

    if (currentSong.paused) {
      currentSong.play()
        .then(() => {
          playBtn.src = "svg/pause.svg";
        })
        .catch(err => console.error("Error playing audio:", err));
    } else {
      currentSong.pause();
      playBtn.src = "svg/play.svg";
    }
  });
}

main();
