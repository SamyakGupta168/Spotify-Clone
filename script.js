async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];

  for (let i = 0; i < as.length; i++) {
    let element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
    }
  }

  return songs;
}

async function main() {
  // Get the list of all the songs
  let urls = await getSongs();
  console.log(urls);

  const songs = urls.map((url) => {
    // Get the part after the last '/'
    let name = url.split("/").pop();

    // Decode %20 → spaces, etc.
    name = decodeURIComponent(name);

    return name;
  });

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li> ${song} </li>`;
  }

  // Playing the first song
  const audio = new Audio(songs[3]);
  //   audio.play();
}

main();
