/* Config */
const twitchTvHandle = "bdougieYO";
const repoOwner = "open-sauced";
const repoName = "open-sauced";
const PAUSE_DURATION = 30 * 1000; // 30 seconds
const DISPLAY_DURATION = 10 * 1000; // 10 seconds

const queue = new Queue();
const container = document.createElement("div");
const img = new Image();

/* OneGraph websocket subscriptions */
const OneGraphSubscriptionPackage = window["onegraph-subscription-client"];
const OneGraphAuthPackage = window["onegraph-auth"];

const SubscriptionClient = OneGraphSubscriptionPackage.SubscriptionClient;
const OneGraphAuth = OneGraphAuthPackage.OneGraphAuth;

const ONEGRAPH_APP_ID = "e2ce0bcc-b5b6-42b7-a28e-3a6579d69ecd";
const auth = new OneGraphAuth({
  appId: ONEGRAPH_APP_ID,
});
const client = new SubscriptionClient(ONEGRAPH_APP_ID, {oneGraphAuth: auth});

window.appId = ONEGRAPH_APP_ID;
window.auth = auth;
window.client = client;

const checkLogin = async (auth, service, onLogin) => {
  try {
    console.log("Checking if already logged into GitHub...");
    let isLoggedIn = await auth.isLoggedIn("github");

    if (isLoggedIn) {
      return onLogin();
    }

    console.log("Not logged in, starting auth flow...");

    await auth.login("github");
    isLoggedIn = await auth.isLoggedIn("github");
    if (!isLoggedIn) {
      console.debug("Did not grant auth for GitHub");
      return;
    }
    onLogin();
  } catch (e) {
    console.error("Error checking login: ", e);
  }
};

const removeLoginButton = () => {
  const loginButton = document.querySelector("#github-login");
  if (loginButton) {
    loginButton.remove();
  }
}

// Loops and calls each function in a queue
function Queue() {
  let queue = [];
  let isLooping = false;
  let isPaused = false;

  this.loop = async () => {
    isLooping = true;

    const item = queue[0];
    queue.shift();
    await item();

    if (!queue.length || isPaused) {
      isLooping = false;
      return;
    }

    this.loop();
  };

  this.add = item => {
    if (isPaused) return;

    queue.push(item);

    if (!isLooping) this.loop();
  };

  this.clear = () => {
    queue = [];
  };

  this.pause = (duration = 0) => {
    isPaused = true;
    setTimeout(() => (isPaused = false), duration);
  };

  this.isLooping = isLooping;
}

;

/* Sound Effects */
const pewAudio = new Audio("horn.wav");
const magicChime = new Audio("Magic_Chime.mp3");

/* GIFs */
const beyGif = "https://media.giphy.com/media/VxkNDa92gcsRq/giphy.gif";
const welcomeGif = "https://media.giphy.com/media/l3V0doGbp2EDaLHJC/giphy.gif";
const pizzaGif = "https://media.giphy.com/media/3o6nUXaNE4wdhq8Foc/giphy.gif";

ComfyJS.Init(twitchTvHandle);
ComfyJS.onCommand = (user, command, message, flags, extra) => {
  console.log(`!${command} was typed in chat`);

  if (command == "yo") {
    queue.add(async () => {
      new gifAlert(user, beyGif, pewAudio, command);
      await setTimeout(removeGif, DISPLAY_DURATION);
    });
  }

  if (command == "welcome") {
    queue.add(async () => {
      new gifAlert(message, welcomeGif, magicChime, command);
      await setTimeout(removeGif, DISPLAY_DURATION);
    });
  }

  if (flags.broadcaster && command == "pizza") {
    queue.add(async () => {
      new gifAlert(message, pizzaGif, magicChime, command);
      await setTimeout(removeGif, DISPLAY_DURATION);
    });
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
  starred: " starred us, like we knew they would!",
};

function gifAlert(user, gif, audio, type) {
  removeGif(); // ensure that any previous gif is removed

  img.src = gif;

  const title = document.createElement("h1");
  title.innerHTML = user + generateTitle[type];
  title.classList.add("text-shadows");

  const content = document.getElementById("content");
  content.appendChild(title);

  container.appendChild(img);
  content.appendChild(container);
  audio.play();
}

function removeGif() {
  const contentElement = document.getElementById("content");
  if (contentElement.firstElementChild) {
    contentElement.firstElementChild.remove();
  }
}

const startGitHubSubscription = async (auth, client, repoOwner, repoName) => {
  client
    .request({
      query: `subscription OnStarEvent(
  $repoName: String!
  $repoOwner: String!
) {
  github {
    starEvent(
      input: { repoOwner: $repoOwner, repoName: $repoName }
    ) {
      action
      sender {
        login
      }
      repository {
        stargazers {
          totalCount
        }
      }
    }
  }
}`,
      variables: {
        repoOwner: repoOwner,
        repoName: repoName,
      },
      operationName: "OnStarEvent",
    })
    .subscribe(
      next => {
        const action = next.data.github.starEvent.action;
        const sender = next.data.github.starEvent.sender;
        const repo = next.data.github.starEvent.repository;
        const login = sender.login;
        const totalCount = repo.stargazers.totalCount;

        /* 'DELETED' means unstarred, 'CREATED' means starred */
        const newStar = action === "CREATED";

        if (!newStar) {
          const message = `${login} just unstarred ${repoOwner}/${repoName} - down to ${totalCount} stars!`;
          console.log(message);
          return;
        }

        const message = `${login} just starred ${repoOwner}/${repoName} - up to ${totalCount} stars!`;
        console.log(message);

        new gifAlert(login, pizzaGif, magicChime, "starred");
        setTimeout(removeGif, DISPLAY_DURATION);
      },
      error => console.error(error),
      () => console.log("done"),
    );
};

const setup = async () => {
  const loginButton = document.querySelector("#github-login");

  let start = () => {
    checkLogin(auth, "github", () => {
      loginButton.remove();
      console.log("Logged into GitHub, starting subscriptions...");
      startGitHubSubscription(auth, client, repoOwner, repoName);
    });
  };

  loginButton.addEventListener("click", start);
  // Run start in case we're already logged in
  start();
};

setup();
