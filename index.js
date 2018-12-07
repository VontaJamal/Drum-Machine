(function init(window, document) {
  "use strict";

  /* Selectors */
  const sounds = [];
  const keys = Array.from(document.querySelectorAll("div[data-key]"));
  const playButton = document.querySelector(".play");
  const resetButton = document.querySelector(".reset");
  const recordButton = document.querySelector(".record");
  const loopButton = document.querySelector(".loop");
  const recordTime = document.querySelector(".recordTime");
  const playText = document.querySelector(".playText");
  const alertNode = document.querySelector(".alert");

  /* Variables */
  let isPlaying = false;
  let isRecording = false;
  let isLooping = false;
  let updateTime;
  let now;
  let last;
  let time;

  /* Functions */
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

      recordText.textContent = "Stop Recording:";
      recordButton.textContent = "🔴";
    } else {
      clearInterval(updateTime);
      recordText.textContent = "Start Recording:";
      recordButton.textContent = "🔵";
      recordTime.textContent = "0:00";
    }
  }

  function playRecording() {
    //check if we have recorded sounds
    if (sounds.length > 0) {
      isRecording = false;
      isPlaying = !isPlaying;

      let start = 0;
      let counter = 0;

      if (isPlaying) {
        updateTime = setInterval(function count() {
          counter++;
          formatCount(counter);
        }, 1000);
        playText.textContent = "Stop Playback:";

        let sound = sounds[start].audio;

        playSound(sound);
        let next = ++start;

        setTimeout(function() {
          playNextSound(next);
        }, sounds[next].time);
      } else {
        playText.textContent = "Playback:";
      }
    } else {
      alert();
    }
  }

  function clearRecording() {
    if (!isRecording && sounds.length == 0) {
      alert();
    }
    sounds.length = 0;
  }

  function alert() {
    alertNode.style.display = "block";

    setTimeout(function clearAlert() {
      alertNode.style.display = "none";
    }, 1000);
  }

  function stopPlaying() {
    clearInterval(updateTime);
    isPlaying = false;
    setTimeout(function updateText() {
      recordTime.innerHTML = "Recording Finished!";

      setTimeout(function resetTime() {
        recordTime.innerHTML = "0:00";
        playText.textContent = "Playback:";
      }, 1000);
    }, 1000);
  }

  function formatCount(seconds) {
    const recordTime = document.querySelector(".recordTime");

    if (seconds > 60) {
      let minutes = Math.floor(seconds / 60);
      seconds -= minutes * 60;

      seconds > 9
        ? (recordTime.textContent = `${minutes}:${seconds}`)
        : (recordTime.textContent = `${minutes}:0${seconds}`);
    } else {
      seconds > 9
        ? (recordTime.textContent = `0:${seconds}`)
        : (recordTime.textContent = `0:0${seconds}`);
    }
  }

  function playSound(e, time) {
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
      const sound = {
        audio,
        time
      };
      sounds.push(sound);
    }
  }

  function playNextSound(index) {
    if (isPlaying) {
      let sound = sounds[index].audio;
      playSound(sound);
      //Get the next sound to play

      let next = ++index;
      if (sounds[next]) {
        setTimeout(function() {
          playNextSound(index);
        }, sounds[next].time);
      } else {
        //We've reached the end check if we want to replay
        if (isLooping) {
          index = 0;
          playSound(sound);
          let next = ++index;

          setTimeout(function() {
            playNextSound(next);
          }, sounds[next].time);
        } else {
          stopPlaying();
        }
      }
    } else {
      stopPlaying();
    }
  }

  function randomColor() {
    let red, green, blue;
    red = Math.floor(Math.random() * 256);
    green = Math.floor(Math.random() * 256);
    blue = Math.floor(Math.random() * 256);
    return `rgb(${red},${green},${blue})`;
  }

  /* Events */
  window.addEventListener("keydown", function(e) {
    now = Date.now();
    if (last) {
      time = now - last;
    } else {
      time = 0;
    }

    last = now;
    playSound(e, time);
  });

  playButton.addEventListener("click", playRecording);
  resetButton.addEventListener("click", clearRecording);
  recordButton.addEventListener("click", record);
  loopButton.addEventListener("click", loop);
  keys.forEach(key => key.addEventListener("transitionend", removeTransition));
})(window, document);
