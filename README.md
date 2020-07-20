_This is a WIP chat bot for Twitch. I am still figuring out the kinks. Considering the content and the code in this repo to  unstable. If you would like a chatbot that works out of the box, try [open-sauced/beybot](https://github.com/open-sauced/beybot) instead._

![slaybot](https://user-images.githubusercontent.com/5713670/87865209-68f4c280-c927-11ea-85f6-adb28c811b1e.png)

This is a twitch bot built on the [ComfyJS](https://github.com/instafluff/ComfyJS) (a wrapper around [tmi.js](https://github.com/tmijs/tmi.js)).

# How can I implement this in my chat?

Before I jump into the code, I need to share some of the streaming basics.

## OBS Studio

[OBS Studio](https://obsproject.com/) is a free and open-source software for live-streaming and screen recording. This walk-through will show OBS Studio and consult your platform's documentation or community on how to add browser source plugins.

**Browser Source plugins**
When you set up an out of the box alert or chat system, like [Streamlabs](https://streamlabs.com/), they require you to add something called a Browser Source plugin. To do this, you add the URL pointing to the plugin, provided in the Streamlabs dashboard. This is the backbone of most streaming interactions on Twitch. Browser source plugins are HTML, CSS, and some JavaScript—so basically webpages.

If you are looking to code live on stream, you probably have these skills to make chat alerts.

## ComfyJS

Comfy.JS lets you integrate with Twitch chat for your Twitch channel SUPER EASILY in just a few lines of code. Here's a quick 3-min video on how to use it: (Click image to open video)

[![ComfyJS How-To Video](https://img.youtube.com/vi/oXpPwnUQCCk/hqdefault.jpg)](https://www.youtube.com/watch?v=oXpPwnUQCCk)

If you would like to see this chat command working live on the air here is a clip of me interacting with the basic `!yo` command.

![!yo in the wild](https://user-images.githubusercontent.com/20134767/86605284-58be0a00-bf5b-11ea-85a4-344a14672519.gif)

**Step 1: In your fork replace the Twitch channel name.**

In the [config.js](https://github.com/open-sauced/slaybot/blob/main/config.js#L2) of the beybot repo, you will need to replace my handle, `"bdougieYO"` with your Twitch handle.

The name is the thing you will need to change:

    const twitchTvHandle = "bdougieYO";

If you do not have a Twitch account but would like to test this out, you can test this using my chat. I live-stream myself contributing and triaging open-source projects every Tuesday and Friday.

[bdougie.live](https://bdougie.live/)

[![bdougie twitch account](https://user-images.githubusercontent.com/20134767/86605791-016c6980-bf5c-11ea-8250-2c03bb1f3318.png)](https://www.twitch.tv/bdougieyo)

**Step 2: Running the chatbot locally**
After forking this repo, you will need to clone it locally to connect to your own [OneGraph](https://www.onegraph.com/) app. 

- Log into OneGraph and select **Create new app**
- Add localhost:8080 to the **CORS Origins**
- Copy and replace the **app's id** and replace it in the ONEGRAPH_APP_ID.
- Run the serve using `snowpack dev`

_When viewing the live site, it will be blank. You can open the web console and see the commands printed there, but keep in mind that the page has intentionally left blank to hide and show the Beyonceé gifs._

Now that you have a URL, you can include this in your OBS browser source.

**Step 3: Add browser source plugin**

In OBS add a new source to the Scene of your choosing. OBS Studio has a few different source options, but choose Browser and proceed with adding browser source, using your deployed GitHub Pages URL (**username.github.io/beybot)**.

![](https://paper-attachments.dropbox.com/s_202334A481577855209C92DA29E80CC6349876B8BAA86FB00EF2859B2EC0BDD6_1593994390643_Screenshot+2020-07-05+17.12.55.png)

_One thing to keep in mind, OBS will be using a cached version of the site at the moment you add the browser plugin. If you make updates, you will need to clear the "Refresh cache of current page" button (I spent a lot of time not knowing that existed)._

![](https://paper-attachments.dropbox.com/s_202334A481577855209C92DA29E80CC6349876B8BAA86FB00EF2859B2EC0BDD6_1594017692929_Screenshot+2020-07-05+23.41.25.png)

**Step 4: Test in your chat by open your typing !yo in the chat.**

Ideally, you will test this in your Twitch chat, but if you made it this far without having your own my chat, feel free to stop by and test it out.

Go ahead and type !yo in the chat while OBS is open and weep tears of joy, because that was hopefully easy if it wasn't let me know in the comments below.

That is it. You can now extend this bot with new commands for you and your chat to interact.

## Examples in the wild

These chat interactions are basic, but if you want to see more examples of chat interactions, check out the following channels.

- [Change the baldbeardedbuilder's VScode theme.](https://www.twitch.tv/baldbeardedbuilder/clip/TangibleKathishFriesRuleFive?filter=clips&range=7d&sort=time)
- [Shave jlengstorf live on the air.](https://www.twitch.tv/jlengstorf/clip/JollyBlushingMacaroniCoolCat?filter=clips&range=30d&sort=time)
- [Noopkat's new subscriber alert.](https://www.twitch.tv/noopkat/clip/MoldyBitterTriangleWholeWheat?filter=clips&range=30d&sort=time)

I hope this is a good start in getting you towards making the most complex chatbot interactions.
