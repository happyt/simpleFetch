var config = require('./config.js');
var fetchUrl = require("fetch").fetchUrl;
var fs = require('fs'),
    xml2js = require('xml2js');

var options = { trim: true, explicitArray : false };
var parser = new xml2js.Parser(options);

// source file is iso-8859-15 but it is converted to utf-8 automatically
fetchUrl(config.feeds[0].url,
    function (error, meta, body) {
        if (error) {
            console.log("Feed err: ", error);
        } else {
            //         if (!quiet) console.log(body);
            // write to file
            // fs.writeFile('c:/golf/USAplayers2017.xml', body, function (err) {
            //     if (err) return console.log(err);
            //     console.log('Y');
            // });

            // test        var xmlIn = "<root>Hello xml2js!</root>";
            var count = 0;
            var xmlList = ""
            var theList = {"entries": { "lookupEntry" : []} }

            parser.parseString(body, function (err, jsonObj) {

                // fs.writeFile('./xml2jsOutput.json', JSON.stringify(jsonObj), function (err) {
                //     if (err) return console.log(err);
                //     console.log('Full file written');
                // });

                console.log("plr count = ", jsonObj.plrs.plr.length)
                for (var p in jsonObj.plrs.plr) {
          //          console.log("output = ", JSON.stringify(jsonObj.plrs.plr[p]))
                    if (playerOnTour(jsonObj.plrs.plr[p], "R")) {
                        var entry = jsonObj.plrs.plr[p].name;
                        var newEntry = {}

                        newEntry.longname = entry.last + "," + entry.first
                        newEntry.entryname = entry.Country
                        if (count < 14) console.log("New: ", newEntry);  // just to see a few lines

                        // write out to a file
                        // tried to convert json to xml, but lib didn't give me what I expected, so will just cut and past result
                        // with ID             xmlList += "<dictionaryentry><num>" + jsonObj.plrs.plr[p]._attributes.plrNum + "</num><longname>" + entry.last._text + "," + entry.first._text + "</longname><entryname>" + entry.Country._text + "</entryname></dictionaryentry>\n"
                        xmlList += "<dictionaryentry><longname>" + entry.last + "," + entry.first + "</longname><entryname>" + entry.Country + "</entryname></dictionaryentry>\n"
                        theList.entries.lookupEntry.push(newEntry)
                        count++;
                    }
               //     count++;
               //     if (count > 14) break;
                }
            })
        }
        //     console.log(JSON.stringify(jsonObj));
        console.log("total = ", count);
        fs.writeFile('c:/golf/countrynamesList.xml', xmlList, function (err) {
            if (err) return console.log(err);
            console.log('OK');
        });

        //        console.log("the list = ", theList)

        // // testing convert obj to XML
        // theList = { overall: { abc: { name: "abc" }, bbc: [{ aaa: { name: "aaa" } }, { aaa: { name: "bbb" } }, { aaa: { name: "ccc" } }] } }
        var builder = new xml2js.Builder({"rootName": "lookupDictionary"});
        var xmlresult = builder.buildObject(theList);
        fs.writeFile('c:/golf/countrynames5.xml', xmlresult, function (err) {
            if (err) return console.log(err);
            console.log('OK');
        });
        // console.log("result = ", xmlresult);
    });

    // use the console.log to see that get some of each type
function playerOnTour(p, code) {
    var result = false;
    if (p.tour !== undefined) {
        // we have a tour block
        if (p.tour.$ === undefined) {
            // tour is an array in this case, look at each entry...
            //just try printing first entry...
            if (p.name.Country !== "" && p.tour[0].$.tourCodeUC === code) {
                result = true;
      //                  console.log("tour array");
            }
        } else {
            if (p.tour.$.tourCodeUC === code) {
                if (p.name.Country !== "") {
                    result = true;
      //                  console.log("tour w attrs");
                }
            }
        }
    } else {
        // no tour defined - use the main attributes
        if (p.name.Country !== "" && p.$.primaryTourUC === code) {
            result = true;
      //                 console.log("no tour");
        }
    }

    return result;
}
