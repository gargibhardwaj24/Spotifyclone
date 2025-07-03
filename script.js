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

const progress = document.querySelector(".circle .progress");
if (progress && audioElement.duration) {
  const percent = (audioElement.currentTime / audioElement.duration) * 100;
  progress.style.width = `${percent}%`;
}
});
}
function playSong(songFileName) {
  currentSong.pause();
  currentSong.currentTime = 0;
  currentSong.src = `songs/${songFileName}`;
  document.querySelector(".songinfo").innerHTML = decodeURIComponent(songFileName.replace(".mp3", ""));
  document.getElementById("currentTime").textContent = "0:00";
  document.getElementById("duration").textContent = "0:00";
  setupTimeUpdates(currentSong);

  currentSong.play()
    .then(() => {
      playBtn.src = "svg/pause.svg";
      console.log("Now playing:", songFileName);
    })
    .catch(err => console.error("Playback failed:", err));
}


async function main() {
  const songs = await getSongs();
  const prevBtn = document.getElementById("prev");
  console.log("Songs found:", songs);

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
    if (songs[i]) {
      const songTitle = decodeURIComponent(songs[i].split(".mp3")[0]);
      btn.innerHTML = `
      <div class="song-thumb">
        <img src="${songImages[i]}" alt="Album cover">
        <div class="hover-play">
          <img src="svg/play.svg" alt="Play Icon">
        </div>
      </div>
      <span class="label">${songTitle}</span>
    `;
    

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
    if (!currentSong.src) return; // does nothing if no song loaded

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
   document.querySelector(".circle").addEventListener("click", (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    currentSong.currentTime = percent * currentSong.duration;
  });

// add an eventlistner
document.querySelector(".hamburger").addEventListener("click", ()=>{
  document.querySelector(".left").style.left = "0";
})
document.querySelector(".right").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "-100%";
})
// event listner to prev
prevBtn.addEventListener("click", () => {
  let currentFile = currentSong.src.split("/").pop();
  let currentIndex = songs.indexOf(currentFile);

  if (currentIndex > 0) {
    const prevSong = songs[currentIndex - 1];
    playSong(prevSong);
  } else {
    console.log("This is the first song in the list.");
  }
});


// add event listner to next
const nextBtn = document.getElementById("next");
nextBtn.addEventListener("click", () => {
  let currentFile = currentSong.src.split("/").pop(); 
  let currentIndex = songs.indexOf(currentFile);

  if (currentIndex < songs.length - 1) {
    const nextSong = songs[currentIndex + 1];
    playSong(nextSong);
  } else {
    console.log("No more songs in the list.");
  }
});

// add an event to volume 
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
  console.log("Setting volume to", e.target.value)
  currentSong.volume = parseInt(e.target.value)/100
})
let currentlyPlayingCard = null;

const cards = document.querySelectorAll(".card");
cards.forEach((card, i) => {
  const playDiv = card.querySelector(".play-button");
  if (songs[i]) {
    const cards = document.querySelectorAll(".card");
    const songTitle = decodeURIComponent(songs[i].replace(".mp3", ""));
    const h2 = card.querySelector("h2");
    if (h2) h2.textContent = songTitle;
    const [title, artist] = songTitle.split("- ");
if (h2) h2.textContent = title || songTitle;
const p = card.querySelector("p");
if (p) p.textContent = artist || "Unknown Artist";

    playDiv.addEventListener("click", () => {
      playSong(songs[i]);
    });
  } else {
    playDiv.addEventListener("click", () => {
      alert("No song assigned to this card.");
    });
  }
});


const element = document.querySelector('.cardContainer');
const toggleButton = document.querySelector('.showall');

element.classList.add('nowrap');
toggleButton.textContent = "Show all"; 

toggleButton.addEventListener('click', () => {
  element.classList.toggle('wrap');
  element.classList.toggle('nowrap');

  if (toggleButton.textContent === "Show all") {
    toggleButton.textContent = "Show less";
  } else {
    toggleButton.textContent = "Show all";
  }
});



}
main();
