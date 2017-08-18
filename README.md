## Strip player countries

This is a short app to pull golfers and their countries from a feed, so that we can create a dictionary for use in the studio app.

It reads the file with fetch.

start1.js
It outputs a file which contains the XML lines needed for the dictionary. These will then be cut and pasted into the production file. I thought I'd try using the xml-js library. This didn't produce the XML output that I was expecting, so I left it as a cut & paste job. 

start.js
Trying xml2js lib - sorted it out properly with this to the XML array etc. USE THIS VERSION. 

It is basically going through and checking whether the player has a code for the tour, together with a non-blank country code. I have set it up for 'R' which is the normal PGA Tour. The codes can be in different places in the XML, for some reason and sometimes they are included on more than one tour.  Currently, if there is an array of tours, I only look at the first entry.

Counts for 2017 Aug file - 44,189 players - 753 are on 'R', PGA Tour.

Perhaps we should allow for R and S, the Champions tour? We could do two runs, but would then have to merge lists. Did test -> 901 names for R & S.

There is a commented out line to add the player ID if needed for the SSN DB.

Url is needed in 'config.js' file,
module.exports = {
  feeds :  [
        { title: "players", type: "xml", url: 'https://...' }
        ]
};
