// ───────── Globals ─────────
let songs = [];
let currentSong = new Audio();
const playBtn = document.getElementById("play"); // play/pause button
const cardContainer = document.querySelector(".cardContainer");
const toggleButton = document.querySelector(".showall");

// ───────── Fetch Song List ─────────
async function getSongs() {
  try {
    const res = await fetch("/songs.json");
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching songs.json`);
    const arr = await res.json();
    if (!Array.isArray(arr)) throw new Error("Invalid songs.json: expected array");
    return arr;
  } catch (err) {
    console.error("Could not load song list:", err);
    return [];
  }
}

// ───────── Time Formatting & UI Updates ─────────
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function setupTimeUpdates(audioEl) {
  const currentTimeEl = document.getElementById("currentTime");
  const durationEl   = document.getElementById("duration");
  if (!currentTimeEl || !durationEl) {
    console.warn("Missing #currentTime or #duration elements.");
    return;
  }

  audioEl.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audioEl.duration);
  });

  audioEl.addEventListener("timeupdate", () => {
    currentTimeEl.textContent = formatTime(audioEl.currentTime);
    const progress = document.querySelector(".circle .progress");
    if (progress && audioEl.duration) {
      const pct = (audioEl.currentTime / audioEl.duration) * 100;
      progress.style.width = `${pct}%`;
    }
  });
}

// ───────── Play a Given Song ─────────
function playSong(filename) {
  // Reset & set source (URL‑encode spaces/special chars)
  currentSong.pause();
  currentSong.currentTime = 0;
  currentSong.src = `/songs/${encodeURIComponent(filename)}`;

  // Update info display
  const titleText = decodeURIComponent(filename.replace(/\.mp3$/, ""));
  document.querySelector(".songinfo").textContent = titleText;
  document.getElementById("currentTime").textContent = "0:00";
  document.getElementById("duration").textContent    = "0:00";

  setupTimeUpdates(currentSong);

  currentSong.play()
    .then(() => {
      playBtn.src = "svg/pause.svg";
      console.log("Now playing:", filename);

      // Highlight the playing card
      document.querySelectorAll(".card").forEach((card, i) => {
        card.classList.toggle("playing", songs[i] === filename);
      });
    })
    .catch(err => console.error("Playback failed:", err));
}

// ───────── Main App Initialization ─────────
async function main() {
  songs = await getSongs();
  console.log("Loaded songs:", songs);

  // QUICK-PICKS BUTTONS
  const buttons = document.querySelectorAll(".songList .songs");
  const songImages = [
    "https://i.scdn.co/image/ab67616d00001e0214691359e2723059bbec9cde",
    "https://i.scdn.co/image/ab67616d00001e020f48649d4f365018a9dee53b",
    "https://i.scdn.co/image/ab67616d00001e02da990e21d4815d6b2b2d58e8",
    "https://i.scdn.co/image/ab67616d00001e02c8e97cafeb2acb85b21a777e",
    "https://i.scdn.co/image/ab67616d00001e0283141000ee8ce3b893a0b425",
    "https://i.scdn.co/image/ab67616d00001e0205177674b12f7cf7fa33f1dc",
    "https://i.scdn.co/image/ab67616d00001e020a47bbe7141fdfe0eb2cdba7",
    "https://i.scdn.co/image/ab67616d00001e026fbb60d6a7e03ccb940a518e",
    "https://i.scdn.co/image/ab67616d00001e0297585d74e0b581a23593f613",
    "https://i.scdn.co/image/ab67616d00001e027480ebc1c684ccf400570a39"
  ];

  buttons.forEach((btn, i) => {
    if (!songs[i]) {
      btn.textContent = "— no song —";
      btn.disabled = true;
      return;
    }

    const raw = songs[i].replace(/\.mp3$/, "");
    const [title, artist = "Unknown"] = raw.split(" - ");
    btn.innerHTML = `
      <div class="song-thumb">
        <img src="${songImages[i]}" alt="Album cover">
        <div class="hover-play"><img src="svg/play.svg" alt="Play Icon"></div>
      </div>
      <div class="songTitle">
        <div class="label">${title}</div>
        <div class="artist">${artist}</div>
      </div>
    `;
    btn.addEventListener("click", () => playSong(songs[i]));
  });

  // PLAY/PAUSE TOGGLE
  playBtn.addEventListener("click", () => {
    if (!currentSong.src) return;
    if (currentSong.paused) {
      currentSong.play().then(() => { playBtn.src = "svg/pause.svg"; });
    } else {
      currentSong.pause();
      playBtn.src = "svg/play.svg";
    }
  });

  // SEEKBAR CLICK (jump to percentage)
  document.querySelector(".circle").addEventListener("click", e => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    currentSong.currentTime = pct * currentSong.duration;
  });

  // PREVIOUS & NEXT
  document.getElementById("prev").addEventListener("click", () => {
    const curr = decodeURIComponent(currentSong.src.split("/").pop());
    const idx  = songs.indexOf(curr);
    if (idx > 0) playSong(songs[idx - 1]);
  });
  document.getElementById("next").addEventListener("click", () => {
    const curr = decodeURIComponent(currentSong.src.split("/").pop());
    const idx  = songs.indexOf(curr);
    if (idx < songs.length - 1) playSong(songs[idx + 1]);
  });

  // VOLUME CONTROL
  const volInput = document.querySelector(".range input");
  if (volInput) {
    volInput.addEventListener("change", e => {
      currentSong.volume = Number(e.target.value) / 100;
    });
  }

  // SIDE NAV 
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  document.querySelector(".right").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  // CARD PLAY BUTTONS 
  document.querySelectorAll(".card").forEach((card, i) => {
  const playBtnInCard = card.querySelector(".play-button");

  if (songs[i]) {
    // derive title & artist
    const raw = songs[i].replace(/\.mp3$/, "");
    const [title, artist = "Unknown"] = raw.split(" - ");

    // find or create the <h2> for title
    let titleEl = card.querySelector("h2");
    if (!titleEl) {
      titleEl = document.createElement("h2");
      card.appendChild(titleEl);
    }
    titleEl.textContent = title;
    titleEl.style.fontWeight = "bold";

    // find or create the <p> for artist
    let artistEl = card.querySelector("p");
    if (!artistEl) {
      artistEl = document.createElement("p");
      card.appendChild(artistEl);
    }
    artistEl.textContent = artist;

    // wire up play
    playBtnInCard.addEventListener("click", () => playSong(songs[i]));
  } else {
    playBtnInCard.addEventListener("click", () => {
      alert("No song assigned to this card.");
    });
  }
});


  // SHOW ALL / SHOW LESS toggle 
  // const grid = document.querySelector(".cardContainer");
  // if (grid && toggle) {
  //   grid.classList.add("nowrap");
  //   toggle.textContent = "Show all";
  //   toggle.addEventListener("click", () => {
  //     grid.classList.toggle("wrap");
  //     grid.classList.toggle("nowrap");
  //     toggle.textContent = toggle.textContent === "Show all" ? "Show less" : "Show all";
  //   });
  // }


cardContainer.classList.add('nowrap');
toggleButton.textContent = "Show all"; 
toggleButton.addEventListener('click', () => {
  console.log("hello");
  cardContainer.classList.toggle('wrap');
  cardContainer.classList.toggle('nowrap');
  if (toggleButton.textContent === "Show all") {
    toggleButton.textContent = "Show less";
  } else {
    toggleButton.textContent = "Show all";
  }
});


}

main();
