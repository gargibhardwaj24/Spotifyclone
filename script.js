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
}

main();
// async function main() {
//   const songs = await getSongs();
//   const prevBtn = document.getElementById("prev");
//   console.log("Songs found:", songs);

//   const buttons = document.querySelectorAll(".cardContainer .card");

//   buttons.forEach((btn, i) => {
//     if (songs[i]) {
//       // btn.textContent = `▶ ${decodeURIComponent(songs[i].split(".mp3")[0])}`;

//       btn.addEventListener("click", () => {
//         currentSong.pause();
//         currentSong.currentTime = 0;
//         currentSong.src = `songs/${songs[i]}`;
//         document.querySelector(".songinfo").innerHTML = decodeURIComponent(songs[i].replace(".mp3", ""));
//         document.getElementById("currentTime").textContent = "0:00";
//         document.getElementById("duration").textContent = "0:00";


//         setupTimeUpdates(currentSong);

//         currentSong.play()
//           .then(() => {
//             playBtn.src = "svg/pause.svg";
//             //  updateTimeUI(); 
//             console.log("Now playing:", songs[i]);
  
//           })
//           .catch(err => console.error("Playback failed:", err));
                       

//       });
//     } else {
//       btn.textContent = "— no song —";
//       btn.disabled = true;
//     }


//   });

//   // const playBtn = document.getElementById("play");

//   playBtn.addEventListener("click", () => {
//     if (!currentSong.src) return; // does nothing if no song loaded

//     if (currentSong.paused) {
//       currentSong.play()
//         .then(() => {
//           playBtn.src = "svg/pause.svg";
//         })
//         .catch(err => console.error("Error playing audio:", err));
//     } else {
//       currentSong.pause();
//       playBtn.src = "svg/play.svg";
//     }
//   });
//    document.querySelector(".circle").addEventListener("click", (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const percent = (e.clientX - rect.left) / rect.width;
//     currentSong.currentTime = percent * currentSong.duration;
//   });

// // add an eventlistner
// document.querySelector(".hamburger").addEventListener("click", ()=>{
//   document.querySelector(".left").style.left = "0";
// })
// document.querySelector(".right").addEventListener("click",()=>{
//     document.querySelector(".left").style.left = "-100%";
// })
// // event listner to prev
// prevBtn.addEventListener("click", () => {
//   let currentFile = currentSong.src.split("/").pop();
//   let currentIndex = songs.indexOf(currentFile);

//   if (currentIndex > 0) {
//     const prevSong = songs[currentIndex - 1];
//     playSong(prevSong);
//   } else {
//     console.log("This is the first song in the list.");
//   }
// });


// // add event listner to next
// const nextBtn = document.getElementById("next");
// nextBtn.addEventListener("click", () => {
//   let currentFile = currentSong.src.split("/").pop(); 
//   let currentIndex = songs.indexOf(currentFile);

//   if (currentIndex < songs.length - 1) {
//     const nextSong = songs[currentIndex + 1];
//     playSong(nextSong);
//   } else {
//     console.log("No more songs in the list.");
//   }
// });

// // add an event to volume 
// document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
//   console.log("Setting volume to", e.target.value)
//   currentSong.volume = parseInt(e.target.value)/100
// })
// }

// main();
