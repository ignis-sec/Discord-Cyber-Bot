# Discord-Cyber-Bot
Discord bot for our cyber security discord channel

# Caution
This bot is created as a mini-ctf, and has an intentional vulnerability. Please do not use this bot if you are looking for a good discord.js project.



## File structure

- index.js handles the initial login to the discord servers, and client construction. It also contains the top level handlers for the discord events.
- commands.json contains commands that bot will handle.
- status.json contains list of flavor text to randomly chose from.
- Views folder contains an experiemental control panel (likely will be removed)
- controlPanel.js contains backend hooks for the control panel (likely will be removed)
- package* files are created by node.js to handle dependencies.

## Missing config.json

```
{ 
  "token"  : "tokenString",
  "prefix" : "$"
}
```
Replace the tokenString with what was provided to you by discord.
