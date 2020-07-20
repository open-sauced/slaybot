const queue = new Queue();

/* OneGraph websocket subscriptions */
const OneGraphSubscriptionPackage = window["onegraph-subscription-client"];
const OneGraphAuthPackage = window["onegraph-auth"];

const SubscriptionClient = OneGraphSubscriptionPackage.SubscriptionClient;
const OneGraphAuth = OneGraphAuthPackage.OneGraphAuth;

const ONEGRAPH_APP_ID = "1c60a33a-c861-4219-9c46-cad179a2cafc";
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
};

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
