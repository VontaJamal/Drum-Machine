"use strict";

const sounds = [];
const keys = Array.from(document.querySelectorAll("div[data-key]"));
const playButton = document.querySelector(".play");
const resetButton = document.querySelector(".reset");
const recordButton = document.querySelector(".record");
const loopButton = document.querySelector(".loop");
const recordTime = document.querySelector(".recordTime");
let isRecording = false;
let isLooping = false;
let updateTime;

window.addEventListener("keydown", playSound);
playButton.addEventListener("click", playRecording);
resetButton.addEventListener("click", clearRecording);
recordButton.addEventListener("click", record);
loopButton.addEventListener("click", loop);

keys.forEach(key => key.addEventListener("transitionend", removeTransition));

function removeTransition(e) {
  e.target.classList.remove("playing");
  e.target.style.color = "#fdfdfd";
  e.target.style.borderColor = "#fdfdfd";
}

function loop() {
  isLooping = !isLooping;
  loopButton.classList.add("looping");

  if (!isLooping) {
    loopButton.classList.remove("looping");
  }
}

function record() {
  const recordText = document.querySelector(".recordText");
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
    isRecording = false;
    let start = 0;
    let counter = 0;

    updateTime = setInterval(function count() {
      counter++;
      formatCount(counter);
    }, 1000);

    playSound(sounds[start]);

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

function playSound(e) {
  let audio, player;

  if (e) {
    audio = document.querySelector(`audio[data-key="${e.keyCode}"]`) || e;
    player =
      document.querySelector(`div[data-key="${e.keyCode}"]`) ||
      document.querySelector(`div[data-key="${e.dataset.key}"]`);
  }

  if (!player || !audio) return;
  let color = randomColor();

  player.classList.add("playing");
  player.style.color = color;
  player.style.borderColor = color;
  audio.currentTime = 0;
  audio.play();

  if (isRecording) {
    sounds.push(audio);
  }
}

function playNextSound(index) {
  //recording has finished
  if (!sounds[index]) {
    if (isLooping) {
      index = 0;
    } else {
      clearInterval(updateTime);
      setTimeout(function resetTime() {
        recordTime.innerHTML = "Recording Finished!";

        setTimeout(function resetTime() {
          recordTime.innerHTML = "0:00";
        }, 1000);
      }, 1000);

      return;
    }
  }

  playSound(sounds[index]);

  sounds[index].addEventListener("ended", function soundPlayer() {
    playNextSound(index + 1);
    sounds[index].removeEventListener("ended", soundPlayer);
  });
}

function randomColor() {
  let red, green, blue;

  red = Math.floor(Math.random() * 256);
  green = Math.floor(Math.random() * 256);
  blue = Math.floor(Math.random() * 256);

  return `rgb(${red},${green},${blue})`;
}
