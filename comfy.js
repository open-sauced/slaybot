// Resolve promise after duration
const wait = async duration => {
  return new Promise(resolve => setTimeout(resolve, duration));
};

ComfyJS.Init(twitchTvHandle);
ComfyJS.onCommand = (user, command, message, flags, extra) => {
  console.log(`!${command} was typed in chat`);

  if (command == "yo") {
    new gifAlert(user, beyGif, pewAudio, command);
  }

  if (command == "welcome") {
    new gifAlert(message, welcomeGif, magicChime, command);
  }

  if (flags.broadcaster && command == "pizza") {
    new gifAlert(message, pizzaGif, magicChime, command);
  }

  if (flags.broadcaster && command == "pause") {
    // Clear GIF queue and pause for PAUSE_DURATION
    queue.clear();
    queue.pause(PAUSE_DURATION);
  }
};

ComfyJS.onChat = (user, message, flags, self, extra) => {
  console.log(user + ":", message);
};

const generateTitle = {
  yo: " is hype!",
  welcome: " needs a welcome!",
  pizza: " needed a pizza party!",
  starred: ` starred ${repoName}, like we knew they would!`,
};

function gifAlert(user, gif, audio, type) {
  queue.add(async () => {
    audio.play();
    container.innerHTML = `
      <h1 class="text-shadows">${user + generateTitle[type]}</h1>
      <img src="${gif}" />
    `;
    container.style.opacity = 1;

    await wait(DISPLAY_DURATION);

    if (!queue.isLooping) {
      container.style.opacity = 0;
    }

  });
}
