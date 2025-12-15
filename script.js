console.log("Let's write some javascript");

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

async function main() {
  // Getting the list of all the songs
  let urls = await getSongs();
  console.log(urls);

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

  const songs = urls.map((url) => {
    // This will extract name of the songs from their urls
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
}

main();
