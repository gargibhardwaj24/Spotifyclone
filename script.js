async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        const href = element.href;

        // Check if it contains .mp3 and ends with /.preview
        if (href.includes(".mp3") && href.endsWith("/.preview")) {
            // Extract filename before the /.preview
            const fileWithPreview = href.split("/songs/")[1]; // e.g., "Song.mp3/.preview"
            const fileName = fileWithPreview.split("/")[0];   // e.g., "Song.mp3"
            songs.push(fileName);
        }
    }

    return songs;
}

async function main() {
  const songs = await getSongs();  
  console.log("Songs found:", songs);

  const buttons = document.querySelectorAll(".songList .songs");

  buttons.forEach((btn, i) => {
    if (songs[i]) {
      btn.textContent = `▶ ${decodeURIComponent(songs[i].split(".mp3")[0])}`;

      btn.addEventListener("click", () => {
        const audio = new Audio(`songs/${songs[i]}`);
        audio.play()
          .then(() => console.log("Playing:", songs[i]))
          .catch(err => console.error("Playback failed:", err));
      });
    } else {
      btn.textContent = "— no song —";
      btn.disabled = true;
    }
  });
}

main();


main();
