// Dynamic IP bot
// Version: 1.0
// Author: Sonny6155

// This Discord bot to compares the external IP of the host to their previous IP every 10 seconds.
// The IP will be posted if a change is detected.



var Discord = require("discord.js");
var http = require('http'); // Allows IP check

var DynamicIPBot = new Discord.Client();

// Customisable settings
var token = "Insert bot token here"; // Required
let prefix = "!";
let checkRate = 10000;

// Globals
var newIP;
var previousIP;
var checkClock;
var isRunning;



DynamicIPBot.on("ready", () =>
{
    console.log("Ready");
});

// Listen for messages
DynamicIPBot.on("message", msg =>
{
  if (!msg.content.startsWith(prefix)) return; // End immediately if prefix is not found
  if(msg.author.bot) return; // Prevent bot loops

  // Lists commands
  if (msg.content.startsWith(prefix + "help"))
  {
    listCommands(msg.author);
  }

  // Ping test
  if (msg.content.startsWith(prefix + "ping"))
  {
    msg.channel.sendMessage("Pong!");
  }

  if (msg.content.startsWith(prefix + "currentIP")) // Does not update new IP
  {
    http.get('http://bot.whatismyipaddress.com', function(res)
    {
      res.setEncoding('utf8');
      res.on('data', function(chunk)
      {
        msg.channel.sendMessage(chunk);
      });
    });
  }

  if (msg.content.startsWith(prefix + "start"))
  {
    if(isRunning)
    {
      msg.channel.sendMessage("Error: The IP check is already running!");
    }
    else
    {
      isRunning = true;
      var checkClock = setInterval(function()
      {
        checkIP(msg.channel);
      }, checkRate);
      console.log("IP clock started");
      checkIP(msg.channel); // Check once immediately
    }
  }

  if (msg.content.startsWith(prefix + "stop"))
  {
    clearInterval(checkClock);
    isRunning = false;
    console.log("IP clock stopped");
  }
});



function checkIP(channel)
{
  http.get('http://bot.whatismyipaddress.com', function(res) // Fetches IP from whatismyipaddress API
  {
      res.setEncoding('utf8');
      res.on('data', function(chunk)
      {
          newIP = chunk;
        	if(newIP !== previousIP) // Compares IP
        	{
        		console.log("IP change detected");
        		console.log("New IP: " + newIP);
        		channel.sendMessage("New IP: " + newIP);
        	}
        	previousIP = newIP;
      });
  });
}

function listCommands(author)
{
  // DM author *
  // Disconnect function will not be added until requested
}



// Error listener
DynamicIPBot.on('error', e => { console.error(e); });

DynamicIPBot.login(token);
