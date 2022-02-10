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

      // If pattern not exists return an empty value
      if (str.match(regex) !== null) {

        // Count pattern
        let patternCount = str.match(regex).length;

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

// Merge all stages track
exports.mergeStagesTrackData = async (stagesTrackArr) => {
  return new Promise(async (resolve, reject) => {
    try {

      // Result object
      let mergeStagesTrackData = {
        namesArrObj: [],
        typeArrObj: [],
        distances: {
          full: {
            meters: null,
            yards: null
          },
          distancesArrObj: []
        },
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
      let distancesFullArr = [];

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

        // Positions array of objects
        let positionsObj = {
          id: stage.id,
          positions: stage.positions.positionsArrObj
        };

        // Distance array of objects
        let distancesObj = {
          id: stage.id,
          distance: {
            meters: stage.distance.meters,
            yards: stage.distance.yards
          }
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
        positionsFullArr.push(stage.positions.positionsArrObj);

        // Elevations full
        elevationsFullArr.push(stage.elevations.full);

        // Distances full
        distancesFullArr.push(stage.distance.meters);

        // Records
        mergeStagesTrackData.namesArrObj.push(nameObj); // names
        mergeStagesTrackData.typeArrObj.push(typeObj); // types
        mergeStagesTrackData.positions.positionsArrObj.push(positionsObj); // array of positions objects
        mergeStagesTrackData.distances.distancesArrObj.push(distancesObj); // array of distances objects
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

          // Distances
          distancesFullArr = distancesFullArr.reduce((a, b) => a + b, 0);
          mergeStagesTrackData.distances.full["meters"] = distancesFullArr;
          mergeStagesTrackData.distances.full["yards"] = parseInt(distancesFullArr*1.093613);

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
      } else {

        resolve([null]);
      }
    } catch(error) {
      console.log(':( getString error'.red);
      reject(console.log);
    }
  })
}

// Tracks
exports.getTracks = async (readGpxFile) => {
  return new Promise(async (resolve, reject) => {
      try {

        // File creator
        let stagesTrackArray = await exports.getStringBetweenIncludedPatterns(readGpxFile, "<trk>", "</trk>");

        // Check if data exists
        if (stagesTrackArray !== null) {

          // Settings
          let resArr = [];

          // Listing stages track
          stagesTrackArray.forEach(async (stage, k) => {

            // Default stage obj
            let trackData = {
              id: null,
              name: null,
              type: null,
              cmt: null,
              desc: null,
              src: null,
              url: null,
              urlname: null,
              number: null,
              distance: {
                meters: null,
                yards: null
              },
              elevations: {
                  full: [],
                  min: null,
                  max: null,
                  cumulativePositiveElevation: null,
                  cumulativeNegativeElevation: null
              },
              positions: {
                positionsArrObj: [],
                positionsArrArr: []
              },
              times: {
                full: []
              },
              magvars: {
                full: []
              },
              geoidheights: {
                full: []
              },
              names: {
                full: []
              },
              cmts: {
                full: []
              },
              descs: {
                full: []
              },
              srcs: {
                full: []
              },
              links: {
                full: []
              },
              urls: {
                full: []
              },
              urlnames: {
                full: []
              },
              syms: {
                full: []
              },
              types: {
                full: []
              },
              fixs: {
                full: []
              },
              sats: {
                full: []
              },
              hdops: {
                full: []
              },
              vdops: {
                full: []
              },
              pdops: {
                full: []
              },
              ageofdgpsdatas: {
                full: []
              },
              dgpsids: {
                full: []
              },
              extensionss: {
                full: []
              },
              speeds: {
                full: []
              },
              courses: {
                full: []
              }
            }

            // Tags tracks
            let trkptStr = await exports.splitString(stage, "<trkpt");

            // Segments tracks
            let trksegStr = await exports.splitString(stage, "<trkseg>");

            // Check if data exists
            if (trkptStr.length > 0) {

              // Positions array of objects
              let positionsArrObj = await exports.getPositionsArr(trkptStr, "\"");
              trackData.positions["positionsArrObj"] = positionsArrObj;

              // Positions array of arrays
              let positionsArrArr = await exports.convertPositionsToArr(positionsArrObj);
              trackData.positions["positionsArrArr"] = positionsArrArr;

              // Distance calculation
              let distance = await exports.trackDistanceCalculation(positionsArrArr);
              trackData.distance["meters"] = distance;
              trackData.distance["yards"] = parseInt(distance*1.093613);

              // Elevations
              let elevationsArr = await exports.getElevationsArr(trkptStr, "<ele>", "</ele>");
              trackData.elevations["full"] = elevationsArr;

              // Min elevation
              let minEle = Math.min(...elevationsArr);
              trackData.elevations["min"] = minEle;

              // Max elevation
              let maxEle = Math.max(...elevationsArr);
              trackData.elevations["max"] = maxEle;

              // Cumulative elevations
              let cumulativeElevations = await exports.getCumulativeElevations(elevationsArr);
              trackData.elevations["cumulativeNegativeElevation"] = cumulativeElevations.cumulativeNegativeElevation;
              trackData.elevations["cumulativePositiveElevation"] = cumulativeElevations.cumulativePositiveElevation;

              // Link
              /*
                <link href="">
                  <text></text>
                  <type></type>
                </link>
                <link href="https://mywebsite.com">
      <text>My Website</text>
    </link>
              */

              // Record the rest of track points
              let recordsTrkptArr = ["time", "magvar", "geoidheight", "name", "cmt", "desc", "src", "link", "url", "urlname", "sym", "type", "fix", "sat", "hdop", "vdop", "pdop", "ageofdgpsdata", "dgpsid", "extensions", "speed", "course"];

              recordsTrkptArr.map(async (element) => {
                let arr = [trksegStr[1]];
                let elementArr = await exports.getTagsValueArr(arr, `<${element}>`, `</${element}>`);
                let propertyName = `${element}s`;
                trackData[propertyName] = {full: elementArr};
              });

              // ID
              trackData["id"] = k;

              // Records trk "name", "type", "cmt", "desc", "src", "url", "urlname", "number" tags
              let recordsTrkArr = ["name", "type", "cmt", "desc", "src", "url", "urlname", "number"];

              recordsTrkArr.map(async (element) => {

                // Record trk elements
                let elementArr = await exports.getString(stage, `<${element}>`, `</${element}>`);
                trackData[element] = elementArr[0];
              });

              resArr.push(trackData);

              // End loop
              if (stagesTrackArray.length === k+1) {

                resolve(resArr);
              }
            }
          });
        } else {

            // Console message
            console.log(":| No tracks in the gpx file.".cyan);

            resolve([]);
          }
      } catch(error) {
          console.log(':( getTracks error'.red);
          reject(console.log);
      }
  })
}

// Waypoints
exports.getWayPoints = async (readGpxFile) => {
  return new Promise(async (resolve, reject) => {
      try {

        // File creator
        let wayPointsArray = await exports.getStringBetweenIncludedPatterns(readGpxFile, "<wpt", "</wpt>");

        // Check if data exists
        if (wayPointsArray !== null) {

          // Settings
          let resArr = [];

          // Listing stages track
          wayPointsArray.forEach(async (point, m) => {

            // Default point obj
            let wayPointsData = {
              id: 1,
              name: null,
              position: null,
              elevation: null,
              time: null,
              magvar: null,
              geoidheight: null,
              cmt: null,
              desc: null,
              src: null,
              url: null,
              urlname: null,
              sym: null,
              type: null,
              fix: null,
              sat: null,
              hdop: null,
              vdop: null,
              pdop: null,
              ageofdgpsdata: null,
              dgpsid: null,
              extensions: null,
              speed: null,
              course: null
            }

            // Tags tracks
            let wptStr = await exports.splitString(point, "<wpt");

            // Check if data exists
            if (wptStr.length > 0) {

              // Position
              let positionsArrObj = await exports.getPositionsArr(wptStr, "\"");
              wayPointsData["position"] = positionsArrObj[0];

              // Elevation
              let elevationsArr = await exports.getElevationsArr(wptStr, "<ele>", "</ele>");
              wayPointsData["elevation"] = elevationsArr[0];

              // Link
              /*
                <link href="">
                  <text></text>
                  <type></type>
                </link>
              */

              // Record wpt elements
              let recordsWptArr = ["time", "magvar", "geoidheight", "name", "cmt", "desc", "src", "url", "urlname", "sym", "type", "fix", "sat", "hdop", "vdop", "pdop", "ageofdgpsdata", "dgpsid", "extensions", "speed", "course"];

              recordsWptArr.map(async (element) => {

                // Record wpt elements
                let elementArr = await exports.getTagsValueArr(wptStr, `<${element}>`, `</${element}>`);
                wayPointsData[element] = elementArr[1];
              });

              // ID
              wayPointsData["id"] = m;

              resArr.push(wayPointsData);

              // End loop
              if (wayPointsArray.length === m+1) {

                resolve(resArr);
              }
            }
          });
        } else {

          // Console message
          console.log(":| No way points in the gpx file.".cyan);

          resolve([]);
        }
      } catch(error) {
          console.log(':( getWayPoints error'.red);
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

        // Tracks
        let stagesTrackData = await exports.getTracks(readGpxFile);

        // Way points
        let wayPoints = await exports.getWayPoints(readGpxFile);

        // Merge tracks
        let mergeStagesTrackData = await exports.mergeStagesTrackData(stagesTrackData);

        // Result object
        var obj = {
          gpxFileMetadata: gpxFileMetadata,
          stagesTrackData: stagesTrackData,
          wayPoints: wayPoints,
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

        // If a single track elevation
        if (elevationsArr.length > 1) {

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
        } else {

           // Obj
           let obj = {
            cumulativeNegativeElevation: elevationsArr[0],
            cumulativePositiveElevation: elevationsArr[0]
          }

          resolve(obj);
        }
      } catch(error) {
          console.log(':( getCumulativeElevations error'.red);
          reject(console.log);
      }
  })
}

// Convert array of positions object to an array of positions arrays
exports.convertPositionsToArr = async (positionsArrObj) => {
  return new Promise(async (resolve, reject) => {
      try {
        /*positionsArrObj = [
            { lat: 48.738056, lon: 2.272639 },
            { lat: 48.73808, lon: 2.272365 },
            { lat: 48.738066, lon: 2.272267 }
        ]*/

        // Settings
        let resArr = [];

        positionsArrObj.forEach((positionsObj, i) => {

          // Array
          let arr = [positionsObj.lat, positionsObj.lon];

          resArr.push(arr);

          // End loop
          if (positionsArrObj.length === i+1) {

            resolve(resArr);
          }
        });
      } catch(error) {
          console.log(':( convertPositionsToArr error'.red);
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

// Get tag's value
exports.getTagsValueArr = async (strArr, pattern1, pattern2) => {
  return new Promise(async (resolve, reject) => {
      try {

        // Result array
        let resArr = [];

        // Listing selected string
        strArr.forEach(async (str, i) => {

          // Get each elevation
          let eleStr = await exports.getString(str, pattern1, pattern2);

          resArr.push(eleStr[0]);

          // End loop
          if (strArr.length === i+1) {

            resolve(resArr);
          }
        });
      } catch(error) {
          console.log(':( getTagsValueArr error'.red);
          reject(console.log);
      }
  })
}

// Get bounds tag
exports.getBounds = async (metaData) => {
  return new Promise(async (resolve, reject) => {
    try {

      // Split string
      let a = metaData[0].split(`<bounds`);

      // Check if bounds tag exists
      if (a.length > 1) {

        // Select values
        let b = a[1].split("\"");

        // Obj
        let obj = {
          minlat: parseFloat(b[1]),
          minlon: parseFloat(b[3]),
          maxlat: parseFloat(b[5]),
          maxlon: parseFloat(b[7])
        };

        resolve(obj);

      } else {

        resolve({});
      }
    } catch (error) {
      console.log(":( getBounds error".red);
      reject(console.log);
    }
  });
}

// Get link tag
exports.getLink = async (metaData) => {
  return new Promise(async (resolve, reject) => {
    try {

      // Split string
      let a = metaData[0].split(`<link`);

      // Check if data exists
      if (a.length > 1) {

        // Get href
        let b = a[1].split(`\"`);
        let href = b[1];

        // Get text
        let text = await exports.getString(a[1], `<text>`, `</text>`);
        text = text[0];

        // Get type
        let type = await exports.getString(a[1], `<type>`, `</type>`);
        type = type[0];

        // Obj
        let obj = {
          href: href,
          text: text,
          type: type
        };

        resolve(obj);

      } else {

        resolve({});
      }
    } catch (error) {
      console.log(":( getLink error".red);
      reject(console.log);
    }
  });
}

// Extract metadata
exports.getMetaData = async (readGpxFile) => {
  return new Promise(async (resolve, reject) => {
      try {

        // Metadata object
        let metadataObj = {
          gpxFileMetadata: {
            gpxFileCreatorName: null,
            gpxFileName: null,
            gpxFileDescription: null,
            gpxFileAuthorName: null,
            gpxFileCopyright: null,
            gpxFileCreationDatetime: null,
            gpxFileKeywords: null,
            gpxFileBounds: null,
            gpxFileLink: null
          }
        };

        // Settings
        let gpxFileCreatorName = null;

        // Convert object properties to array
        var arrObj = Object.keys(metadataObj.gpxFileMetadata);

        // File creator name
        let metaDataFileCreatorName = await exports.getStringBetweenIncludedPatterns(readGpxFile, "creator=", "<metadata>");

        // Check if creator name exists
        if (metaDataFileCreatorName !== null) {

          gpxFileCreatorName = metaDataFileCreatorName[0].split("\"");
          gpxFileCreatorName = gpxFileCreatorName[1];

        } else {

          gpxFileCreatorName = null;

          // Error message
          console.log(":( Gpx file is wrong. Check xml tag in your gpx file.".red)
        }

        // Metadata
        let metaData = await exports.getStringBetweenIncludedPatterns(readGpxFile, "<metadata>", "</metadata>");

        // Check if data exists
        if (metaData !== null) {

          // Bounds tag
          // <bounds minlat="42.960882000" minlon="0.089178000" maxlat="42.968482000" maxlon="0.101709000"/>
          let boundsObj = await exports.getBounds(metaData);

          // Link
          /*
            <link href="https://mywebsite.com">
              <text>My Website</text>
              <type>cycling</type>
            </link>
          */
          let linkObj = await exports.getLink(metaData);

          // Settings
          var arr = [`name`, `desc`, `author`, `copyright`, `time`, `keywords`];
          var resArr = [];

          // Get each element from gpx file
          arr.forEach(async (element, i) => {

            // Get string between two patterns
            let data = metaData[0].substring(metaData[0].lastIndexOf(`<${element}>`) + `<${element}>`.length, metaData[0].lastIndexOf(`</${element}>`));

            // Check value
            if (data.substring(0, 5) === "<meta") {

              // New value
              data = null;
            }

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

                  // Add bounds to object
                  metadataObj.gpxFileMetadata["gpxFileBounds"] = boundsObj;

                  // Add bounds to object
                  metadataObj.gpxFileMetadata["gpxFileLink"] = linkObj;

                  resolve(metadataObj);
                }
              });
            }
          });
        } else {

          // Error message
          console.log(":( Gpx file is wrong. Check metadata tag in your gpx file.".red)
        }
      } catch(error) {
          console.log(':( getMetaData error'.red);
          reject(console.log);
      }
  })
}

// Calculate between positions - Return the distance between (lat1,lon1) and (lat2,lon2)
exports.calculateDistanceBetweenPositions = async (positionsArrayObj) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Earth radius in meter
      let radius = 6378137.0;

      // Degree to radian conversion
      let DE2RA = 0.01745329252;

      // Params
      let lat1 = positionsArrayObj[0].lat;
      let lon1 = positionsArrayObj[0].lon;
      let lat2 = positionsArrayObj[1].lat;
      let lon2 = positionsArrayObj[1].lon;

      // If same point
      if (lat1 !== lat2 && lon1 !== lon2) {

        // Degree calculation
        lat1 *= DE2RA;
        lon1 *= DE2RA;
        lat2 *= DE2RA;
        lon2 *= DE2RA;

        // Calculation
        let d = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2);

        // Distance in meter
        let distance = radius * Math.acos(d);

        resolve(distance);

      }
    } catch (error) {
      console.log(":( calculateDistanceBetweenPositions error".red);
      reject(console.log);
    }
  });
}

// Track distance calculation
exports.trackDistanceCalculation = async (positionsArray) => {
  return new Promise(async (resolve, reject) => {
    try {
      //let positionsArray =  [[42.913941, -8.0148, 456.5],[42.926359, -8.162513, 389.7]]

      // Params
      let resolveArray = [];

      // Distance calculation between each point
      positionsArray.map(async (position, l) => {

        // Stop at last object
        if (typeof positionsArray[l + 1] === "object" && typeof positionsArray[l][1] === "number") {

          // Settings
          let position1 = {
            lat: positionsArray[l][0],
            lon: positionsArray[l][1]
          };

          let position2 = {
            lat: positionsArray[l + 1][0],
            lon: positionsArray[l + 1][1]
          };

          let arrObj = [position1, position2];

          // Distance
          let distance = await exports.calculateDistanceBetweenPositions(arrObj);
          distance = parseInt(distance);

          // Record
          resolveArray.push(distance);

          if (positionsArray.length === l+1) {

            // Total distance calculation
            let totalDistance = resolveArray.reduce((a, b) => a + b, 0);

            resolve(totalDistance);
          }

        } else {

          resolve(0);
        }
      });
    } catch (error) {
      console.log(":( trackDistanceCalculation error".red);
      reject(console.log);
    }
  });
}
