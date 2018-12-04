window.addEventListener("keydown", playSound);

const sounds = [];
const keys = Array.from(document.querySelectorAll("div[data-key]"));
const playButton = document.querySelector(".play");
const resetButton = document.querySelector(".reset");

playButton.addEventListener("click", playRecording);
resetButton.addEventListener("click", function() {
  sounds.length = 0;
});

keys.forEach(key => key.addEventListener("transitionend", removeTransition));

function playSound(e) {
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`);
  const player = document.querySelector(`div[data-key="${e.keyCode}"]`);

  if (!player || !audio) return;

  player.classList.add("playing");
  audio.currentTime = 0;
  audio.play();

  addToRecording(audio);
}

function removeTransition(e) {
  e.target.classList.remove("playing");
}

function addToRecording(sound) {
  sounds.push(sound);
  console.log(sounds);
}

function playRecording() {
  //check if we have recorded sounds
  if (sounds.length < 0) return;
  let start = 0;
  // sounds.forEach(sound => {
  //   console.log(sound);
  //   sound.play();
  // });

  let current = sounds[start];
  current.play();
  current.addEventListener("ended", function() {
    sounds[start + 1].play();
  });
}

function playNextSound(index) {}
