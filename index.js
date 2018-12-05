"use strict";

const sounds = [];
const keys = Array.from(document.querySelectorAll("div[data-key]"));
const playButton = document.querySelector(".play");
const resetButton = document.querySelector(".reset");
const recordButton = document.querySelector(".record");
let updateTime;

let isRecording = false;

window.addEventListener("keydown", playSound);
playButton.addEventListener("click", playRecording);
resetButton.addEventListener("click", clearRecording);
recordButton.addEventListener("click", record);
keys.forEach(key => key.addEventListener("transitionend", removeTransition));

function record() {
  const recordText = document.querySelector(".recordText");
  const recordTime = document.querySelector(".recordTime");
  let counter = 0;

  isRecording = !isRecording;

  if (isRecording) {
    clearRecording();
    updateTime = setInterval(function count() {
      counter++;
      formatCount(counter);
    }, 1000);

    recordText.innerHTML = "Stop Recording";
    recordButton.innerHTML = "🔴";
  } else {
    clearInterval(updateTime);
    recordText.innerHTML = "Start Recording";
    recordButton.innerHTML = "🔵";
    recordTime.innerHTML = "0:00";
  }
}

function playRecording() {
  //check if we have recorded sounds
  if (sounds.length > 0) {
    let start = 0;

    sounds[start].play();

    sounds[start].addEventListener("ended", function soundPlayer() {
      playNextSound(start + 1);

      sounds[start].removeEventListener("ended", soundPlayer);
    });
  }
}

function clearRecording() {
  sounds.length = 0;
}

function formatCount(seconds) {
  const recordTime = document.querySelector(".recordTime");

  if (seconds > 60) {
    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    seconds > 9
      ? (recordTime.innerHTML = `${minutes}:${seconds}`)
      : (recordTime.innerHTML = `${minutes}:0${seconds}`);
  } else {
    seconds > 9
      ? (recordTime.innerHTML = `0:${seconds}`)
      : (recordTime.innerHTML = `0:0${seconds}`);
  }
}

function removeTransition(e) {
  e.target.classList.remove("playing");
}

function playSound(e) {
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
  const player = document.querySelector(`div[data-key="${e.keyCode}"]`);

  if (!player || !audio) return;

  player.classList.add("playing");
  audio.currentTime = 0;
  audio.play();

  if (isRecording) {
    sounds.push(audio);
  }
}

function playNextSound(index) {
  //recording has finished
  if (!sounds[index]) {
    return;
  }

  sounds[index].play();

  sounds[index].addEventListener("ended", function soundPlayer() {
    playNextSound(index + 1);
    sounds[index].removeEventListener("ended", soundPlayer);
  });
}
