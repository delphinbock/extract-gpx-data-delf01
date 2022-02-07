/************* NPM ******************/

// Color console
var colors = require('colors');

// Files manager
var fs = require('fs');

// path manager
var path = require('path');

/*********** FUNCTIONS **************/

// Root app directory
exports.rootAppPath = async () => {
  return new Promise(async (resolve, reject) => {
      try {
          var rootAppDirectoy = path.dirname(require.main.filename);
          resolve(rootAppDirectoy);
      } catch(error) {
          console.log(':( rootAppPath error'.red);
          reject(console.log);
      }
  })
}

// Read gpx file
exports.readGpxFile = async (gpxFilePath) => {
  return new Promise(async (resolve, reject) => {
      try {

        // Root path application
        var rootAppDirectoy = path.dirname(require.main.filename);

        // Absolute path gpx file
        let absolutePath = `${rootAppDirectoy}/${gpxFilePath}`;

        // Check if file exists
        fs.access(absolutePath, fs.F_OK, (error) => {

          if (error) {

            // Error message
            console.log(`:( ${absolutePath} is wrong path. Check pathname or filename`.red);

            resolve(false);

          } else {

            // Success message
            console.log(`:) ${absolutePath} is right`.green);

            // Read file
            let gpxFileStr = fs.readFileSync(absolutePath, "utf8");

            resolve(gpxFileStr);

          }
        })
      } catch(error) {
          console.log(':( readGpxFile error'.red);
          reject(console.log);
      }
  })
}

// Get string between two included string of characters
exports.getStringBetweenIncludedPatterns = async (str, pattern1, pattern2) => {
  return new Promise(async (resolve, reject) => {
    try {

      // Regex
      var regex = new RegExp(pattern1,"g");

      // Count pattern
      let patternCount = str.match(regex).length;

      // If pattern not exists return an empty value
      if (str.match(regex) !== null) {

        // While loop settings
        let i = 0;
        let resultArray = [];

        while (i < patternCount) {

          // Number of total characters
          let totalStr = str.length;

          // Slice str to each pattern segment
          let patternPosition = str.indexOf(pattern1);
          let patternLastPosition = str.indexOf(pattern2) + pattern2.length;
          let patternStr = str.substring(patternPosition, patternLastPosition);

          // Check if patternsegment is existing
          if (patternPosition > 0) {

            // Redefine the native string
            str = str.substring(patternLastPosition, totalStr);

            // Minify file
            let minifiedStr = patternStr.replace(/\s\s+/g, '') // Remove spaces, tabs, empty lines
            minifiedStr = minifiedStr.replace(/(\r\n|\n|\r)/gm, ""); // Remove linebreaks

            // Record
            resultArray.push(minifiedStr);
          }

          // Incrementation
          i++;

          if (i === patternCount) {

            resolve(resultArray);

          }

        }

      } else {

        resolve(null);

      }

    } catch (error) {
      console.error(":( getStringBetweenIncludedPatterns error".red);
      reject(console.log);
    }
  });
}

// Extract trkpt element from string
exports.extractTrkptArr = async (trkptArr) => {
  return new Promise(async (resolve, reject) => {
    try {

      // Settings
      let resArr = [];

      // Listing positions
      trkptArr.forEach((string, i) => {

        // Split
        let sliceTrkpt = string.split("\"");

        // Obj
        let obj = {
          lat: sliceTrkpt[1],
          lon: sliceTrkpt[3]
        };

        resArr.push(obj);

        // End loop
        if (trkptArr.length === i+1) {

          resolve(resArr);

        }

      });

    } catch(error) {
      console.log(':( extractTrkptArr error'.red);
      reject(console.log);
    }
  })
}

// Merge all stages track
exports.mergeStagesTrackData = async (stagesTrackArr) => {
  return new Promise(async (resolve, reject) => {
    try {

      // Result object
      let mergeStagesTrackData = {
        namesArrObj: [],
        typeArrObj: [],
        positions: {
            full: [],
            positionsArrObj: []
        },
        elevations: {
            full: [],
            min: null,
            max: null,
            minMaxArrObj: []
        },
        cumulativeElevations: {
          cumulativePositiveElevation: null,
          cumulativeNegativeElevation: null,
          cumulativeElevationArrObj: []
        }
      }

      // Settings
      let positionsFullArr = [];
      let elevationsFullArr = [];

      // Listing each stage
      stagesTrackArr.forEach(async (stage, i) => {

        // Merge names
        let nameObj = {
          id: stage.id,
          name: stage.name
        };

        // Merge types
        let typeObj = {
          id: stage.id,
          type: stage.type
        };

        // Positions array
        let positionsObj = {
          id: stage.id,
          positions: stage.positions
        };

        // Elevations array
        let eleObj = {
          id: stage.id,
          elevations: stage.elevations
        };

        // Cumulative elevations
        let cumulativeElevationsObj = {
          id: stage.id,
          cumulativePositiveElevations: stage.elevations.cumulativePositiveElevation,
          cumulativeNegativeElevations: stage.elevations.cumulativeNegativeElevation
        }

        // Positions full
        positionsFullArr.push(stage.positions);

        // Elevations full
        elevationsFullArr.push(stage.elevations.full);

        // Records
        mergeStagesTrackData.namesArrObj.push(nameObj); // names
        mergeStagesTrackData.typeArrObj.push(typeObj); // types
        mergeStagesTrackData.positions.positionsArrObj.push(positionsObj); // array of positions objects
        mergeStagesTrackData.elevations.minMaxArrObj.push(eleObj); // array of elevations objects
        mergeStagesTrackData.cumulativeElevations.cumulativeElevationArrObj.push(cumulativeElevationsObj); // array of cumulative elevations objects

        // End loop
        if (stagesTrackArr.length === i+1) {

          // Positions
          positionsFullArr = positionsFullArr.flat();
          mergeStagesTrackData.positions["full"] = positionsFullArr;

          // Elevations
          elevationsFullArr = elevationsFullArr.flat();
          mergeStagesTrackData.elevations["full"] = elevationsFullArr;

          // Min elevation
          mergeStagesTrackData.elevations["min"] = Math.min(...elevationsFullArr);

          // Max elevation
          mergeStagesTrackData.elevations["max"] = Math.max(...elevationsFullArr);

          // Cumulative elevations
          let cumulativeElevations = await exports.getCumulativeElevations(elevationsFullArr);

          // Cumulative positive elevation
          let cumulativePositiveElevation = cumulativeElevations.cumulativePositiveElevation;
          mergeStagesTrackData.cumulativeElevations["cumulativePositiveElevation"] = cumulativePositiveElevation;

          // Cumulative negative elevation
          let cumulativeNegativeElevation = cumulativeElevations.cumulativeNegativeElevation;
          mergeStagesTrackData.cumulativeElevations["cumulativeNegativeElevation"] = cumulativeNegativeElevation;

          resolve(mergeStagesTrackData);
        }
      });
    } catch(error) {
      console.log(':( mergeStagesTrackData error'.red);
      reject(console.log);
    }
  })
}

// Get string between tags
exports.getString = async (str, pattern1, pattern2) => {
  return new Promise(async (resolve, reject) => {
    try {

      // Regex get string between tags
      const regex1 = new RegExp(`\(${pattern1}.*?${pattern2}\)`);

      // Regex replace tags by nothing
      const regex2 = new RegExp(/(<([^>]+)>)/gi);

      // Match string
      let match = str.match(regex1);

      if (match !== null) {

        // Get
        var result = str.match(regex1).map((val) => {

          return val.replace(regex2, "");
        });

        resolve(result);
      }
    } catch(error) {
      console.log(':( getStagesTrack error'.red);
      reject(console.log);
    }
  })
}

// Stages track
exports.getStagesTrack = async (readGpxFile) => {
  return new Promise(async (resolve, reject) => {
      try {

        // File creator
        let stagesTrackArray = await exports.getStringBetweenIncludedPatterns(readGpxFile, "<trk>", "</trk>");

        // Settings
        let resArr = [];

        // Listing stages track
        stagesTrackArray.forEach(async (stage, i) => {

          // Default stage obj
          let trackData = {
            id: null,
            name: null,
            type: null,
            positions: [],
            elevations: {
                full: [],
                min: null,
                max: null,
                cumulativePositiveElevation: null,
                cumulativeNegativeElevation: null
            }
          }

          // Positions
          let trkptStr = await exports.splitString(stage, "<trkpt");
          let positionsArr = await exports.getPositionsArr(trkptStr, "\"");
          trackData["positions"] = positionsArr;

          // Elevations
          let elevationsArr = await exports.getElevationsArr(trkptStr, "<ele>", "</ele>");
          trackData.elevations["full"] = elevationsArr;

          // Min elevation
          let minEle = Math.min(...elevationsArr);
          trackData.elevations["min"] = minEle;

          // Max elevation
          let maxEle = Math.max(...elevationsArr);
          trackData.elevations["max"] = maxEle;

          // ID
          trackData["id"] = i;

          // Name
          let nameArr = await exports.getString(stage, "<name>", "</name>");
          trackData["name"] = nameArr[0];

          // Cumulative elevations
          let cumulativeElevations = await exports.getCumulativeElevations(elevationsArr);
          trackData.elevations["cumulativeNegativeElevation"] = cumulativeElevations.cumulativeNegativeElevation;
          trackData.elevations["cumulativePositiveElevation"] = cumulativeElevations.cumulativePositiveElevation;

          resArr.push(trackData);

          // End loop
          if (stagesTrackArray.length === i+1) {

            resolve(resArr);
          }
        });
      } catch(error) {
          console.log(':( getStagesTrack error'.red);
          reject(console.log);
      }
  })
}

// Extract gpx data
exports.dataExtraction = async (readGpxFile) => {
  return new Promise(async (resolve, reject) => {
      try {

        // Metadata extraction
        let gpxFileMetadata = await exports.getMetaData(readGpxFile);

        // Stages track
        let stagesTrackData = await exports.getStagesTrack(readGpxFile);

        // Merge stages track
        let mergeStagesTrackData = await exports.mergeStagesTrackData(stagesTrackData);

        // Result object
        var obj = {
          gpxFileMetadata: gpxFileMetadata,
          stagesTrackData: stagesTrackData,
          mergeStagesTrackData: mergeStagesTrackData
        }

        resolve(obj);

      } catch(error) {
          console.log(':( dataExtraction error'.red);
          reject(console.log);
      }
  })
}

// Split string
exports.splitString = async (str, pattern) => {
  return new Promise(async (resolve, reject) => {
      try {

        // Split
        let resArr = str.split(pattern);

        resolve(resArr);

      } catch(error) {
          console.log(':( splitString error'.red);
          reject(console.log);
      }
  })
}

// Get cumulative elevations
exports.getCumulativeElevations = async (elevationsArr) => {
  return new Promise(async (resolve, reject) => {
      try {

        // Result array
        let resArr = [];

        // Listing elevation
        for (let i = 0; i < elevationsArr.length; i++) {

          // Calculation between each elevation
         let ele = elevationsArr[i+1] - elevationsArr[i];

          resArr.push(ele);

         // End loop
         if (elevationsArr.length === i+1) {

            // Reducer
            const reducer = (previousValue, currentValue) => previousValue + currentValue;

            // Cumulative positive elevation
            let positiveEleArr = resArr.filter((value) => {
              return value > 0;
            });

            positiveEleArr = positiveEleArr.reduce(reducer);

            // Round number
            positiveEleArr = positiveEleArr.toFixed(2);
            positiveEleArr = Number(positiveEleArr);

            // Cumulative negatice elevation
            let negativeEleArr = resArr.filter((value) => {
              return value < 0;
            });

            negativeEleArr = negativeEleArr.reduce(reducer);

            // Round number
            negativeEleArr = negativeEleArr.toFixed(2);
            negativeEleArr = Number(negativeEleArr);

            // Obj
            let obj = {
              cumulativeNegativeElevation: negativeEleArr,
              cumulativePositiveElevation: positiveEleArr
            }

            resolve(obj);
         }
        };
      } catch(error) {
          console.log(':( getCumulativeElevations error'.red);
          reject(console.log);
      }
  })
}

// Get selected string from string
exports.getPositionsArr = async (strArr, pattern) => {
  return new Promise(async (resolve, reject) => {
      try {

        // Result array
        let resArr = [];

        // Listing selected string
        strArr.forEach((str, i) => {

          // Split
          let splitStr = str.split(pattern);

          // Record
          if (!isNaN(parseInt(splitStr[1])) || !isNaN(parseInt(splitStr[3]))) {

            // Result object
            let obj = {
              lat: parseFloat(splitStr[1]),
              lon: parseFloat(splitStr[3])
            };

            resArr.push(obj);
          }

          // End loop
          if (strArr.length === i+1) {

            resolve(resArr);

          }

        });

      } catch(error) {
          console.log(':( getPositionsArr error'.red);
          reject(console.log);
      }
  })
}

// Get elevations
exports.getElevationsArr = async (strArr, pattern1, pattern2) => {
  return new Promise(async (resolve, reject) => {
      try {

        // Result array
        let resArr = [];

        // Listing selected string
        strArr.forEach(async (str, i) => {

          // Get each elevation
          let eleStr = await exports.getString(str, pattern1, pattern2);

          // Record
          if (!isNaN(parseFloat(eleStr[0]))) {

            // Elevation
            let ele = parseFloat(eleStr[1]);

            // Record elevation
            resArr.push(parseFloat(ele));
          }

          // End loop
          if (strArr.length === i+1) {

            resolve(resArr);
          }
        });
      } catch(error) {
          console.log(':( getElevationsArr error'.red);
          reject(console.log);
      }
  })
}

// Extract metadata
exports.getMetaData = async (readGpxFile) => {
  return new Promise(async (resolve, reject) => {
      try {

        // Metadata object
        let metadataObj = {
          gpxFileMetadata: {
            gpxFileCreatorName: "",
            gpxFileName: "",
            gpxFileDescription: "",
            gpxFileAuthorName: "",
            gpxFileCopyright: "",
            gpxFileCreationDatetime: "",
            gpxFileKeywords: ""
          }
        };

        // Convert object properties to array
        var arrObj = Object.keys(metadataObj.gpxFileMetadata);

        // File creator name
        let metaDataFileCreatorName = await exports.getStringBetweenIncludedPatterns(readGpxFile, "creator=", "<metadata>");
        let gpxFileCreatorName = metaDataFileCreatorName[0].split("\"");
        gpxFileCreatorName = gpxFileCreatorName[1];

        // Metadata
        let metaData = await exports.getStringBetweenIncludedPatterns(readGpxFile, "<metadata>", "</metadata>");

        // Settings
        var arr = ["name", "desc", "author", "copyright", "time", "keywords"];
        var resArr = [];

        // Get each element from gpx file
        arr.forEach(async (element, i) => {

          // Get string between two patterns
          let data = metaData[0].substring(metaData[0].lastIndexOf(`<${element}>`) + `<${element}>`.length, metaData[0].lastIndexOf(`</${element}>`));

          // Listing values
          resArr.push(data);

          // End loop
          if (i+1 === arr.length) {

            // Listing properties
            arrObj.forEach((property, f) => {

              // Add value to object property
              metadataObj.gpxFileMetadata[property] = resArr[f-1];

              // End loop
              if (arrObj.length === f+1) {

                // Add creator name to object
                metadataObj.gpxFileMetadata["gpxFileCreatorName"] = gpxFileCreatorName;

                resolve(metadataObj);

              }
            });
          }
        });
      } catch(error) {
          console.log(':( getMetaData error'.red);
          reject(console.log);
      }
  })
}