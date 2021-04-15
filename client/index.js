/* Config from URL */
const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);

/* Config */
/* example: http://localhost:3000/?twitch=bdougieyo&owner=bdougie&repo=git-twitch */
const twitchTvHandle = searchParams.has("twitch") ? searchParams.get("twitch") : "bdougieYO";
const repoOwner = searchParams.has("owner") ? searchParams.get("owner") : "bdougie";
const repoName = searchParams.has("repo") ? searchParams.get("repo") : "bdougie/git-twitch";
const PAUSE_DURATION = 30 * 1000; // 30 seconds
const DISPLAY_DURATION = 5 * 500; // 5 seconds

/* DOM */
const container = document.querySelector(".gif");
const img = new Image();
const queue = new Queue();

/* GIFs */
const beyGif = "https://media.giphy.com/media/VxkNDa92gcsRq/giphy.gif";
const welcomeGif = "https://media.giphy.com/media/l3V0doGbp2EDaLHJC/giphy.gif";
const pizzaGif = "https://media.giphy.com/media/3o6nUXaNE4wdhq8Foc/giphy.gif";
const bdougie = "/images/bdougie1.gif";
const heart = "/images/heart.gif";

/* Sound Effects */
const pewAudio = new Audio("audio/horn.wav");
const magicChime = new Audio("audio/Magic_Chime.mp3");
const flexPhrase = new Audio("audio/flex.mp3");

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
    new gifAlert(user, welcomeGif, magicChime, command);
  }
  // Ok, ready!
  if(command == "music") {
    new gifAlert(user, beyGif, pewAudio, command);
    // Please don't stop the music
    fetch("https://serve.onegraph.com/graphql?app_id=cdf2ebe1-3ad3-408a-81c0-1ed675d76411", {body: '{"doc_id": "e5e25f29-7862-4f23-8f53-8fb4373a0672"}', method: "POST"})

    const EVADE_THE_DMCA_BAN_LENGTH = 2500;
    setTimeout(() => {
      // Well, stop it after 2.5 seconds...
      // Pause the player
      pauseSpotify();
    }, EVADE_THE_DMCA_BAN_LENGTH)
  }

  if (command == "flex") {
    new gifAlert(user, bdougie, flexPhrase, command);
  }
  
  if (command == "security") {
    var msg = new SpeechSynthesisUtterance('Somebody call security');
    window.speechSynthesis.speak(msg);
  }

  if ((flags.broadcaster || flags.mod || flags.subscriber) && command == "say") {
    var msg = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(msg);
  }

  if ((flags.broadcaster || flags.mod || flags.subscriber) && command == "pizza") {
    new gifAlert(user, pizzaGif, magicChime, command);
  }

  if ((flags.broadcaster || flags.mod) && command == "pause") {
    // Clear GIF queue and pause for PAUSE_DURATION
    queue.clear();
    queue.pause(PAUSE_DURATION);
  }
};

ComfyJS.onChat = (user, message, flags, self, extra) => {
  console.log(user + ":", message);
};

// change these commands for personalization of your channel.
const generateTitle = {
  pizza: " needed a pizza party!",
  music: " stopped the music!",
  starred: ` starred ${repoName}!`,
  welcome: " needs a welcome!",
  yo: " is hype!",
};

// Need to fix the CSS here
function gifAlert(user, gif, audio, type,) {
  queue.add(async () => {
    audio.play();
    container.innerHTML = presentedGif(user, type, gif);
    container.style.opacity = 1;

    await wait(DISPLAY_DURATION);

    if (!queue.isLooping) {
      container.style.opacity = 0;
    }
  });
}

// This is because the starred event comes from a websocket and not a command
const presentedGif = (user, type, gif) => type == 'starred' ? 
    `
      <h1 class="mona-big text-shadows">${user + generateTitle[type]}</h1>
      <img src="${heart}" />
    ` :

    `
      <h1 class="text-shadows">${user + generateTitle[type]}</h1>
      <img src="${gif}" />
    `;
