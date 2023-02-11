import MEDIA from "./media.js"; //the data file import

const APP = {
  audio: new Audio(), //the Audio Element that will play every track
  currentTrack: 0, //the integer representing the index in the MEDIA array
  init: () => {
    //called when DOMContentLoaded is triggered
    APP.loadCurrentTrack();
    APP.buildPlaylist();
    APP.addListeners();
  },
  addListeners: () => {
    //add event listeners for interface elements
    document
      .querySelector(".controls")
      .addEventListener("click", APP.playHandler);

    //add event listeners for APP.audio
    APP.audio.addEventListener("error", APP.audioError);
    APP.audio.addEventListener("ended", APP.ended);
    APP.audio.addEventListener("loadstart", APP.loadstart);
    APP.audio.addEventListener("loadedmetadata", APP.loadedmetadata);
    APP.audio.addEventListener("canplay", APP.canplay);
    APP.audio.addEventListener("durationchange", APP.durationchange);
    APP.audio.addEventListener("timeupdate", APP.timeupdate);
    APP.audio.addEventListener("play", APP.play);
    APP.audio.addEventListener("pause", APP.pause);
  },
  buildPlaylist: () => {
    //read the contents of MEDIA and create the playlist
    const playlist = document.querySelector(".playlist");

    playlist.innerHTML = MEDIA.map(
      (item) =>
        `<li class="track__item">
          <div class="track__thumb">
            <img src="./img/album-covers/${item.thumbnail}"
            alt="artist album art thumbnail"/>
          </div>
          <div class="track__details">
            <p class="track__title">${item.title}</p>
            <p class="track__artist">${item.artist}</p>
          </div>
          <div class="track__time">
          <time datetime="">00:00</time>
          </div>
        </li>`
    ).join("");
  },
  loadAlbumCover: () => {
    document
      .querySelector(".album_art__full img")
      .setAttribute(
        "src",
        `../img/album-covers/${MEDIA[APP.currentTrack].large}`
      );
  },
  toggleSelection: () => {
    document
      .querySelector(".playlist")
      .childNodes[APP.currentTrack].classList.toggle("selected");
  },
  loadCurrentTrack: () => {
    //use the currentTrack value to set the src of the APP.audio element
    APP.audio.src = `../media/${MEDIA[APP.currentTrack].track}`;
    APP.loadAlbumCover();
  },
  playHandler: (ev) => {
    if (
      ev.target.parentElement.id === "btnPlay" &&
      ev.target.textContent === "play_arrow"
    ) {
      ev.target.textContent = "pause";
      APP.toggleSelection();
      APP.play();
    } else {
      ev.target.textContent = "play_arrow";
      APP.toggleSelection();
      APP.pause();
    }
  },
  play: () => {
    //start the track loaded into APP.audio playing
    if (APP.audio.src) {
      APP.audio.play();
    } else {
      console.warn("You need to load a track first");
    }
  },
  pause: () => {
    //pause the track loaded into APP.audio playing
    APP.audio && APP.audio.pause();
  },
  durationchange(ev) {
    document.querySelector(".total-time").textContent = APP.convertTimeDisplay(
      APP.audio.duration
    );
  },
  timeupdate(ev) {
    document.querySelector(".current-time").textContent =
      APP.convertTimeDisplay(APP.audio.currentTime);
  },
  convertTimeDisplay: (seconds) => {
    //convert the seconds parameter to `00:00` style display
    let minutes = String(Math.floor(seconds / 60));
    let secs = String(Math.floor(seconds - minutes * 60));

    minutes = minutes.padStart(2, "0");
    secs = secs.padStart(2, "0");

    return `${minutes}:${secs}`;
  },
  audioError: () => {
    console.warn(APP.audio.src, "has an error and will not load.");
    document.querySelector(".playlist").childNodes[APP.currentTrack].innerHTML =
      "Unable to load audio file";
    document.querySelector(".album_art__full").innerHTML = "";
  },
};

document.addEventListener("DOMContentLoaded", APP.init);
