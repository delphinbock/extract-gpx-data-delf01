// Color console
var colors = require('colors');

// Library
const mainFunctions = require("extract-gpx-data-delf01/lib/mainFunctions");

exports.extractGpxData = async (gpxFilePath) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Check if the settings objects are right
            if (typeof gpxFilePath === "string") {

                // Read gpx file
                const readGpxFile = await mainFunctions.readGpxFile(gpxFilePath);

                // Check if read file exists
                if (typeof readGpxFile === "string") {

                    // Data extraction
                    const dataObj = await mainFunctions.dataExtraction(readGpxFile);

                    resolve(dataObj);

                } else {

                    // Error message
                    console.log(":( File can not to be read");

                    resolve(false);

                }

            } else {

                // Error message
                console.log(":( Gpx file path is wrong".red);

                resolve(false);
            }
        } catch(error) {
            console.log(':( extractGpxData error');
            reject(console.log);
        }
    })
}