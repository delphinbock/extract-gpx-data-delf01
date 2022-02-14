/************* NPM ******************/

// Color console
var colors = require('colors');
const { resolveSoa } = require('dns');

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
        cmtArrObj: [],
        descArrObj: [],
        srcArrObj: [],
        urlArrObj: [],
        urlnameArrObj: [],
        linkArrObj: [],
        numberArrObj: [],
        extensionsArrObj: [],
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

        // Merge comments
        let cmtObj = {
          id: stage.id,
          type: stage.cmt
        };

        // Merge descriptions
        let descObj = {
          id: stage.id,
          type: stage.desc
        };

        // Merge sources
        let srcObj = {
          id: stage.id,
          type: stage.src
        };

        // Merge url
        let urlObj = {
          id: stage.id,
          type: stage.url
        };

        // Merge urlname
        let urlnameObj = {
          id: stage.id,
          type: stage.urlname
        };

        // Merge link
        let linkObj = {
          id: stage.id,
          type: stage.link
        };

        // Merge number
        let numberObj = {
          id: stage.id,
          type: stage.number
        };

        // Merge extensions
        let extensionsObj = {
          id: stage.id,
          type: stage.extensions
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
        mergeStagesTrackData.cmtArrObj.push(cmtObj); // comments
        mergeStagesTrackData.descArrObj.push(descObj); // descriptions
        mergeStagesTrackData.srcArrObj.push(srcObj); // sources
        mergeStagesTrackData.urlArrObj.push(urlObj); // url
        mergeStagesTrackData.urlnameArrObj.push(urlnameObj); // urlname
        mergeStagesTrackData.numberArrObj.push(numberObj); // number
        mergeStagesTrackData.linkArrObj.push(linkObj); // link
        mergeStagesTrackData.extensionsArrObj.push(extensionsObj); // extensions
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

      // Regex remove tag
      const regex2 = new RegExp(/(<([^>]+)>)/gi);

      // Match string
      let match = str.match(regex1);

      if (match !== null) {

        // Get
        var result = match.map((val) => {

          val = new String(val);

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

// Get link tag
exports.getLinkTrk = async (str) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if link tag exists
      let check = str.includes(`<link`);

      if (check) {

        // Get href
        let href = str.substring(str.indexOf(`<link href="`) + (`<link`).length, str.lastIndexOf(`</link>`));
        href = href.split(`\"`);
        href = href[1];

        // Get text
        let text = str.substring(str.indexOf(`<text>`) + (`<text>`).length, str.lastIndexOf(`</text>`));

        // Get type
        let type = str.substring(str.indexOf(`<type>`) + (`<type>`).length, str.indexOf(`</type>`));

        // Obj1
        let obj1 = {
          href: href,
          text: text,
          type: type
        };

        resolve(obj1);

      } else {

        // Obj2
        let obj2 = {
          href: null,
          text: null,
          type: null
        };

        resolve(obj2);

      }
    } catch (error) {
      console.log(":( getLink error".red);
      reject(console.log);
    }
  });
}

// Get extensions tag
exports.getExtensions = async (str, pattern1, pattern2) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Regex get string between tags
      const regex1 = new RegExp(`\(${pattern1}.*?${pattern2}\)`);

      // Match string
      let match = str.match(regex1);

      if (match !== null) {

        // Get
        var result = match.map((val) => {

          // Select value
          val = val.substring(val.indexOf(pattern1) + pattern1.length, val.indexOf(pattern2));

          return val;
        });

        resolve(result);

      } else {

        resolve([null]);
      }
    } catch (error) {
      console.log(":( getExtensions error".red);
      reject(console.log);
    }
  });
}

// Tracks
exports.getTracks = async (readGpxFile) => {
  return new Promise(async (resolve, reject) => {
      try {

        // Get track tag
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
              link: null,
              extensions: null,
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

              // Track points records
              let recordsTrkptArr = ["time", "magvar", "geoidheight", "name", "cmt", "desc", "src", "url", "urlname", "sym", "type", "fix", "sat", "hdop", "vdop", "pdop", "ageofdgpsdata", "dgpsid", "extensions", "speed", "course"];

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

              // Link
              // <link href="https://mywebsite.com"><text>My Website</text><type>cycling</type></link>
              let linkObj = await exports.getLinkTrk(stage);
              trackData.link = linkObj;

              // Route extensions
              // <extensions><ogr:id>17</ogr:id><ogr:longitude>10.684415</ogr:longitude><ogr:latitude>53.865650</ogr:latitude></extensions>
              let extensions = await exports.getExtensions(stage, `<extensions>`, `</extensions>`);
              trackData.extensions = extensions[0];

              // Track record
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

// Routes
exports.getRoutes = async (readGpxFile) => {
  return new Promise(async (resolve, reject) => {
      try {
        // Get route tag
        let routesArr = await exports.getStringBetweenIncludedPatterns(readGpxFile, "<rte>", "</rte>");

        // Check if data exists
        if (routesArr !== null) {

          // Settings
          let resArr = [];

          // Listing stages track
          routesArr.forEach(async (route, w) => {

            // Default route obj
            let routeData = {
              id: null,
              name: null,
              type: null,
              cmt: null,
              desc: null,
              src: null,
              url: null,
              urlname: null,
              number: null,
              link: null,
              extensions: null,
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

            // Route point's tags
            let rteptStrArr = await exports.splitString(route, "<rtept");

            // Check if data exists
            if (rteptStrArr.length > 0) {

              // Positions array of objects
              let positionsArrObj = await exports.getPositionsArr(rteptStrArr, "\"");
              routeData.positions["positionsArrObj"] = positionsArrObj;

              // Positions array of arrays
              let positionsArrArr = await exports.convertPositionsToArr(positionsArrObj);
              routeData.positions["positionsArrArr"] = positionsArrArr;

              // Distance calculation
              let distance = await exports.trackDistanceCalculation(positionsArrArr);
              routeData.distance["meters"] = distance;
              routeData.distance["yards"] = parseInt(distance*1.093613);

              // Elevations
              let elevationsArr = await exports.getElevationsArr(rteptStrArr, "<ele>", "</ele>");
              routeData.elevations["full"] = elevationsArr;

              // Min elevation
              let minEle = Math.min(...elevationsArr);
              routeData.elevations["min"] = minEle;

              // Max elevation
              let maxEle = Math.max(...elevationsArr);
              routeData.elevations["max"] = maxEle;

              // Cumulative elevations
              let cumulativeElevations = await exports.getCumulativeElevations(elevationsArr);
              routeData.elevations["cumulativeNegativeElevation"] = cumulativeElevations.cumulativeNegativeElevation;
              routeData.elevations["cumulativePositiveElevation"] = cumulativeElevations.cumulativePositiveElevation;

              // Record route points tags
              let recordsRteptArr = ["time", "magvar", "geoidheight", "name", "cmt", "desc", "src", "url", "urlname", "sym", "type", "fix", "sat", "hdop", "vdop", "pdop", "ageofdgpsdata", "dgpsid", "extensions", "speed", "course"];

              recordsRteptArr.map(async (element) => {
                let arr = [rteptStrArr[1]];
                let elementArr = await exports.getTagsValueArr(arr, `<${element}>`, `</${element}>`);
                let propertyName = `${element}s`;
                routeData[propertyName] = {full: elementArr};
              });

              // ID
              routeData["id"] = w;

              // Records route "name", "type", "cmt", "desc", "src", "url", "urlname", "number" tags
              let recordsRteArr = ["name", "type", "cmt", "desc", "src", "url", "urlname", "number"];

              recordsRteArr.map(async (element) => {

                // Record route tags
                let elementArr = await exports.getString(route, `<${element}>`, `</${element}>`);
                routeData[element] = elementArr[0];
              });

              // Route link
              //<link href="https://mywebsite.com"><text>My Website</text><type>cycling</type></link>
              let linkObj = await exports.getLinkTrk(route);
              routeData.link = linkObj;

              // Route extensions
              let extensions = await exports.getExtensions(route, `<extensions>`, `</extensions>`);
              routeData.extensions = extensions[0];

              // Record route
              resArr.push(routeData);

              // End loop
              if (routesArr.length === w + 1) {

                resolve(resArr);
              }
            }
          });
        } else {

            // Console message
            console.log(":| No routes in the gpx file.".cyan);

            resolve([]);
          }
      } catch(error) {
          console.log(':( getRoutes error'.red);
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
              course: null,
              link: null
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
              //<link href="https://mywebsite.com"><text>My Website</text><type>cycling</type></link>
              let linkObj = await exports.getLinkTrk(wptStr[1]);
               wayPointsData.link = linkObj;

              // Route extensions
              let extensions = await exports.getExtensions(wptStr[1], `<extensions>`, `</extensions>`);
              wayPointsData.extensions = extensions[0];

              // Record wpt elements
              let recordsWptArr = ["time", "magvar", "geoidheight", "name", "cmt", "desc", "src", "url", "urlname", "sym", "type", "fix", "sat", "hdop", "vdop", "pdop", "ageofdgpsdata", "dgpsid", "speed", "course"];

              recordsWptArr.map(async (element) => {

                // Record wpt elements
                let elementArr = await exports.getTagsValueArr(wptStr, `<${element}>`, `</${element}>`);
                wayPointsData[element] = elementArr[1];
              });

              // ID
              wayPointsData["id"] = m;

              // Record
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

        // Routes
        let routes = await exports.getRoutes(readGpxFile);

        // Tracks
        let stagesTrackData = await exports.getTracks(readGpxFile);

        // Way points
        let wayPoints = await exports.getWayPoints(readGpxFile);

        // Merge tracks
        let mergeStagesTrackData = await exports.mergeStagesTrackData(stagesTrackData);

        // Result object
        var obj = {
          gpxFileMetadata: gpxFileMetadata,
          wayPoints: wayPoints,
          routes: routes,
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

        // If no elevation tags
        if (elevationsArr.length === 0) {

          // Obj
          let obj1 = {
            cumulativeNegativeElevation: 0,
            cumulativePositiveElevation: 0
          }

          resolve(obj1);
        }

        // If elevation tags exists
        if (elevationsArr.length > 1) {

          // Listing elevation
          let e = elevationsArr.map(async (elevation, i) => {

            // Stop at last item aray
            if (elevationsArr[i+1] !== undefined) {

              // Calculation between each elevation
              let ele = elevationsArr[i+1] - elevationsArr[i];

              return ele;
            }
          });

          // Reducer
          const reducer = (previousValue, currentValue) => previousValue + currentValue;

          // Get promises
          let promises = await Promise.all(e);

          // Filter to remove undefined values
          const eleArr = promises.filter(Boolean);

          // Cumulative positive elevation
          let positiveEleArr = eleArr.filter((value) => {
            return value > 0;
          });

          // Check if data exists
          if (positiveEleArr.length !== 0) {

            positiveEleArr = positiveEleArr.reduce(reducer);

            // Round number
            positiveEleArr = positiveEleArr.toFixed(2);
            positiveEleArr = Number(positiveEleArr);

          } else {

            positiveEleArr = 0;

          }

          // Cumulative negatice elevation
          let negativeEleArr = eleArr.filter((value) => {
            return value < 0;
          });

          // Check if data exists
          if (negativeEleArr.length !== 0) {

            negativeEleArr = negativeEleArr.reduce(reducer);

            // Round number
            negativeEleArr = negativeEleArr.toFixed(2);
            negativeEleArr = Number(negativeEleArr);

          } else {

            negativeEleArr = 0;
          }

          // Obj
          let obj2 = {
            cumulativeNegativeElevation: negativeEleArr,
            cumulativePositiveElevation: positiveEleArr
          }

          resolve(obj2);

        } else {

           // Obj
           let obj3 = {
            cumulativeNegativeElevation: elevationsArr[0],
            cumulativePositiveElevation: elevationsArr[0]
          }

          resolve(obj3);
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

        // If no elevations
        if (strArr.length > 0) {

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
        } else {

          resolve([0]);
        }
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

        // Obj2
        let obj2 = {
          minlat: null,
          minlon: null,
          maxlat: null,
          maxlon: null
        };

        resolve(obj2);
      }
    } catch (error) {
      console.log(":( getBounds error".red);
      reject(console.log);
    }
  });
}

// Get link tag
exports.getLink = async (str) => {
  return new Promise(async (resolve, reject) => {
    try {

      // Check if link tag exists
      let check = str[0].includes(`<link`);

      if (check) {

        // Split str
        let a = str[0].split(`<link`);

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

          // Obj2
          let obj2 = {
            href: null,
            text: null,
            type: null
          };

          resolve(obj2);
        }
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
            gpxFileExtensions: null,
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
          //<link href="https://mywebsite.com"><text>My Website</text><type>cycling</type></link>
          let linkObj = await exports.getLinkTrk(metaData[0]);

          // Settings
          var arr = [`name`, `desc`, `author`, `copyright`, `time`, `keywords`, `extensions`];
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

                  // Add link to object
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

      // Check if track tag exists
      if (positionsArray.length > 1) {

        // Distance calculation between each point
        let d = positionsArray.map(async (position, q) => {

          // Stop at last object
          if (typeof positionsArray[q + 1] === "object" && typeof positionsArray[q][1] === "number") {

            // Settings
            let position1 = {
              lat: positionsArray[q][0],
              lon: positionsArray[q][1]
            };

            let position2 = {
              lat: positionsArray[q + 1][0],
              lon: positionsArray[q + 1][1]
            };

            let arrObj = [position1, position2];

            // Distance
            let distance = await exports.calculateDistanceBetweenPositions(arrObj);
            distance = parseInt(distance);

            return distance;
          }
        });

        // Reducer
        const reducer = (accumulator, curr) => accumulator + curr;

        // Get promises
        const distanceArr = await Promise.all(d);

        // Filter to remove undefined values
        const filteredArray = distanceArr.filter(Boolean);

        // Total distance
        const totalDistance = filteredArray.reduce(reducer);

        resolve(totalDistance);

      } else {

        resolve(0);

      }

    } catch (error) {
      console.log(":( trackDistanceCalculation error".red);
      reject(console.log);
    }
  });
}
