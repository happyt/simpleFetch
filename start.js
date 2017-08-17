var config = require('./config.js');
var fetchUrl = require("fetch").fetchUrl;
var fs = require("fs");

var parser = require("xml-js");

// source file is iso-8859-15 but it is converted to utf-8 automatically
fetchUrl(config.feeds[0].url,
    function (error, meta, body) {
        if (error) {
            console.log("Feed err: ", error);
        } else {
            //         if (!quiet) console.log(body);
            // write to file
            fs.writeFile('c:/golf/USAplayers2017.xml', body, function (err) {
                if (err) return console.log(err);
                console.log('Y');
            });
            var jsonObj = parser.xml2js(body, { compact: true, spaces: 4 });
            // fs.writeFile('c:/golf/USAplayers2017.json', jsonObj, function (err) {
            //     if (err) return console.log(err);
            //     console.log('Z');
            // });
            var count = 0;
            var xmlList = ""
            var theList = { "entries": [] }
            console.log("decl = ", jsonObj._declaration)
            console.log("plr count = ", jsonObj.plrs.plr.length)
            for (var p in jsonObj.plrs.plr) {
                //           console.log("country = ", jsonObj.plrs.plr[p].name.Country)

                if (playerOnTour(jsonObj.plrs.plr[p], "R")) {
                    var entry = jsonObj.plrs.plr[p].name;
                    var newEntry = { "dictionaryentry": {} }

                    newEntry.dictionaryentry.longname = entry.last._text + "," + entry.first._text
                    newEntry.dictionaryentry.entryname = entry.Country._text
                    if (count < 14) console.log("New: ", newEntry);  // just to see a few lines

                    // write out to a file
                    // tried to convert json to xml, but lib didn't give me what I expected, so will just cut and past result
            // with ID             xmlList += "<dictionaryentry><num>" + jsonObj.plrs.plr[p]._attributes.plrNum + "</num><longname>" + entry.last._text + "," + entry.first._text + "</longname><entryname>" + entry.Country._text + "</entryname></dictionaryentry>\n"
                    xmlList += "<dictionaryentry><longname>" + entry.last._text + "," + entry.first._text + "</longname><entryname>" + entry.Country._text + "</entryname></dictionaryentry>\n"
                    theList.entries.push(newEntry)
                    count++;
                }
 // debug              if (count > 14) break;
            }
        }
        //     console.log(JSON.stringify(jsonObj));
        console.log("total = ", count);
        fs.writeFile('c:/golf/countrynames4.xml', xmlList, function (err) {
            if (err) return console.log(err);
            console.log('OK');
        });
        //        console.log("the list = ", theList)
        // testing
        theList = { overall: { abc: { _text: "abc" }, bbc: [{ aaa: { _text: "aaa" } }, { aaa: { _text: "bbb" } }, { aaa: { _text: "ccc" } }] } }
        var options = { ignoreComment: true, spaces: 4, compact: true };
        var xmlresult = parser.js2xml(theList, options);
        //         console.log("result = ", xmlresult);          
    });

function playerOnTour(p, code) {
    var result = false;
    if (p.tour !== undefined) {
        // we have a tour block
        if (p.tour._attributes === undefined) {
            // tour is an array in this case, look at each entry...
            //just try printing first entry...
            if (p.name.Country._text !== undefined && p.tour[0]._attributes.tourCodeUC === code) {
                result = true;
    //            console.log("tour array");
            }
        } else {
            if (p.tour._attributes.tourCodeUC === code) {
                if (p.name.Country._text !== undefined) {
                    result = true;
                }
            }
        }
    } else {
        // no tour defined - use the main attributes
        if (p.name.Country._text !== undefined && p._attributes.primaryTourUC === code) {
            result = true;
 //           console.log("no tour");
        }
    }

    return result;
}
