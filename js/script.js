let currentSong = new Audio();
let urls = [];
let songs = [];
let currFolder;

function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

// getSongs function will extract all the songs from the given folder and will display their songs in the songlist
async function getSongs(folder) {
  urls.length = 0;
  songs.length = 0;
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/songs/${currFolder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  for (let i = 0; i < as.length; i++) {
    if (as[i].href.endsWith(".mp3")) {
      urls.push(as[i].href);
    }
  }

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

  // This will extract name of the songs from their urls
  songs = urls.map((url) => {
    const fileName = url.split("/").pop();
    const decodedName = decodeURIComponent(fileName);
    const songName = decodedName.replace(".mp3", "");
    return songName;
  });

  songUL.innerHTML = ""; // Removing previous songs present in the song list
  // This will show all the songs in the playlist
  for (let song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `
              <li>
                <img class="invert" src="assets/music.svg" alt="music" />
                <div class="info">
                  <div>${song}</div>
                  <div>Samyak</div>
                </div>

                <div class="playnow">
                  <span>Play Now</span>
                  <img class="invert" src="assets/play.svg" alt="play" />
                </div>
              </li>`;
  }

  // Attach event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e, index) => {
    e.addEventListener("click", (evt) => {
      playMusic(
        urls[index],
        e.querySelector(".info").firstElementChild.innerHTML
      );
    });
  });
}

const playMusic = (url, songName) => {
  (currentSong.src = url), songName;
  currentSong.play();
  play.src = "assets/pause.svg";
  document.querySelector(".songinfo").innerHTML = songName;
};

// This function will display all the albums on the page
async function displayAlbums() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  for (let e of anchors) {
    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").pop();
      // Getting the metadata of the folder
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="${folder}" class="card">
              <div class="play">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="48"
                  height="48"
                  fill="none"
                >
                  <!-- Green Circle Background -->
                  <circle cx="12" cy="12" r="12" fill="#1ed760" />

                  <!-- Centered Black Play Button -->
                  <polygon points="10,8 10,16 16,12" fill="black" />
                </svg>
              </div>
              <img
                src="/songs/${folder}/cover.jpg"
                alt="image"
              />
              <h2>${response.title}</h2>
              <p>${response.discription}</p>
            </div>`;
    }
  }

  // Load the playlist whenever card is clicked
  Array.from(document.querySelectorAll(".card")).forEach((card) => {
    card.addEventListener("click", async (e) => {
      await getSongs(`${card.dataset.folder}`);
    });
  });
}

async function main() {
  // Getting the list of all the songs
  await getSongs(); // By default ncs folder songs will be displayed

  // Displaying all the albums on the page
  await displayAlbums();
}

// Attach event listener to play, next and previous buttons
play.addEventListener("click", (e) => {
  if (currentSong.paused) {
    currentSong.play();
    play.src = "assets/pause.svg";
  } else {
    currentSong.pause();
    play.src = "assets/play.svg";
  }
});

// Listen for timeupdate event
currentSong.addEventListener("timeupdate", (e) => {
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

// Adding event listener to previous
previous.addEventListener("click", (e) => {
  console.log("Previous clicked");
  let index = 1;
  for (let i = 0; i < urls.length; i++) {
    if (urls[i] == currentSong.src) {
      index = i;
      break;
    }
  }

  if (index == 0) {
    playMusic(urls[urls.length - 1], songs[urls.length - 1]);
  } else {
    playMusic(urls[index - 1], songs[index - 1]);
  }
});

// Adding event listener to next
next.addEventListener("click", (e) => {
  console.log("Next clicked");
  let index = -1;
  for (let i = 0; i < urls.length; i++) {
    if (urls[i] == currentSong.src) {
      index = i;
      break;
    }
  }

  if (index == urls.length - 1) {
    playMusic(urls[0], songs[0]);
  } else {
    playMusic(urls[index + 1], songs[index + 1]);
  }
});

// Adding event listener to volume
document.querySelector(".range input").addEventListener("change", (e) => {
  currentSong.volume = parseInt(e.target.value) / 100;
});

// Adding an event listener to mute the track
document.querySelector(".volume img").addEventListener("click" , (e) => {
  if(e.target.src.includes("assets/volume.svg")) {
    e.target.src = e.target.src.replace("assets/volume.svg", "assets/mute.svg");
    currentSong.volume = 0;
    document.querySelector(".range input").value = 0;
  } else  {
    e.target.src = e.target.src.replace("assets/mute.svg", "assets/volume.svg");
    currentSong.volume = 0.10;
    document.querySelector(".range input").value = 10;
  }
})

main();
