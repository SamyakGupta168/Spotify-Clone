let currentSong = new Audio();

function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  // console.log(div);
  let as = div.getElementsByTagName("a");
  // console.log(as);
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    if (as[i].href.endsWith(".mp3")) {
      songs.push(as[i].href);
    }
  }

  // console.log(songs);
  return songs;
}

const playMusic = (url, songName) => {
  // console.log(url, songName);
  (currentSong.src = url), songName;
  currentSong.play();
  play.src = "pause.svg";
  document.querySelector(".songinfo").innerHTML = songName;
};

async function main() {
  // Getting the list of all the songs
  let urls = await getSongs();
  console.log(urls);

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

  // This will extract name of the songs from their urls
  const songs = urls.map((url) => {
    // Step 1: Split the URL by '/' and take the last part (file name)
    // Example: "Aaj%20Ki%20Raat%20Stree%202%20128%20Kbps.mp3"
    const fileName = url.split("/").pop();

    // Step 2: Decode URL-encoded characters
    // %20 → space, %26 → &, etc.
    const decodedName = decodeURIComponent(fileName);

    // Step 3: Remove the ".mp3" extension from the file name
    const songName = decodedName.replace(".mp3", "");

    // Step 4: Return the clean song name
    return songName;
  });

  // This will show all the songs in the playlist
  for (let song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `
              <li>
                <img class="invert" src="music.svg" alt="music" />
                <div class="info">
                  <div>${song}</div>
                  <div>Samyak</div>
                </div>

                <div class="playnow">
                  <span>Play Now</span>
                  <img class="invert" src="play.svg" alt="play" />
                </div>
              </li>`;
  }

  // Attach event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e, index) => {
    e.addEventListener("click", (evt) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(
        urls[index],
        e.querySelector(".info").firstElementChild.innerHTML
      );
    });
  });
}

// Attach event listener to play, next and previous buttons
play.addEventListener("click", (e) => {
  if (currentSong.paused) {
    currentSong.play();
    play.src = "pause.svg";
  } else {
    currentSong.pause();
    play.src = "play.svg";
  }
});

// Listen for timeupdate event
currentSong.addEventListener("timeupdate", (e) => {
  console.log(currentSong.currentTime, currentSong.duration);
  document.querySelector(".songtime").innerHTML = `${formatTime(
    currentSong.currentTime
  )}/${formatTime(currentSong.duration)}`;

  document.querySelector(".circle").style.left = `${
    (currentSong.currentTime / currentSong.duration) * 100
  }%`;
});

// Adding an event listener to seekbar
document.querySelector(".seekbar").addEventListener("click", (e) => {
  let fraction = e.offsetX / e.target.getBoundingClientRect().width;
  document.querySelector(".circle").style.left = `${fraction * 100}%`;
  currentSong.currentTime = currentSong.duration * fraction;
});

// Adding an event listener for hamburger
document.querySelector(".hamburger").addEventListener("click", (e) => {
  document.querySelector(".left").style.left = "0";
});

// Adding event listener to close icon of left
document.querySelector(".close").addEventListener("click", (e) => {
  document.querySelector(".left").style.left = "-120%";
});

main();
