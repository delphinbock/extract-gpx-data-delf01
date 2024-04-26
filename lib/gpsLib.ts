// Color console
import "colors"

// Files manager
import * as fs from 'fs';

// Path manager
import * as path from 'path';

// Convert fs.readFile to an async function
import { promisify } from 'util';
const readFileAsync = promisify(fs.readFile);

// Debug mode
const debugMode = true;

// Types
import {
  RootAppPath,
  ReadGpxFile,
  GetStringBetweenIncludedPatterns,
  GetStringBetweenIncludedPatternsData,
  MergeStagesTrackData,
  MergeStagesTrack,
  GetString,
  GetLinkTrk,
  GetLinkTrkData,
  GetExtensions,
  GetExtensionsData,
  GetTracks,
  GetTracksData,
  GetRoutes,
  GetRoutesData,
  GetWayPoints,
  GetWayPointsData,
  DataExtraction,
  DataExtractionData,
  SplitString,
  SplitStringData,
  GetCumulativeElevations,
  GetCumulativeElevationsData,
  ConvertPositionsToArr,
  ConvertPositionsToArrData,
  GetPositionsArr,
  GetPositionsArrData,
  GetElevationArr,
  GetElevationArrData,
  GetTagsValueArr,
  GetBounds,
  GetBoundsData,
  GetLink,
  GetLinkData,
  GetMetaData,
  GetMetaDataData,
  CalculateDistanceBetweenPositions,
  TrackDistanceCalculation,
  StageData,
} from '../types/gpsLibType';

// Root app directory
const rootAppPath: RootAppPath = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let rootAppDirectory: unknown;

      if (require.main) {
        rootAppDirectory = path.dirname(require.main.filename);
      } else {
        rootAppDirectory = __dirname;
      }
      resolve({ rootAppDirectory: rootAppDirectory as string });
    } catch (error) {
      console.log(':( rootAppPath error'.red);
      reject(error);
    }
  });
};

// Read gpx file
const readGpxFile: ReadGpxFile = async (gpxFilePath) => {
  return new Promise<string | false>((resolve, reject) => {
    try {
      // Determine the root directory of the application
      const rootAppDirectory = require.main ? path.dirname(require.main.filename) : __dirname;

      // Construct the absolute path to the GPX file
      const absolutePath = path.join(rootAppDirectory, gpxFilePath);

      // Check if the file exists and is accessible
      fs.promises.access(absolutePath, fs.constants.F_OK)
        .then(() => {
          // Log success message if file exists
          console.log(`:) ${absolutePath} is right`.green);
          // Read the file
          return fs.promises.readFile(absolutePath, "utf8");
        })
        .then((gpxFileStr) => {
          // Resolve with the contents of the file
          resolve(gpxFileStr);
        })
        .catch((error) => {
          // Log error message if file does not exist or cannot be accessed
          console.log(`:( ${absolutePath} is wrong path. Check pathname or filename : ${error}`.red);
          // Resolve with false to indicate failure
          resolve(false);
        });
    } catch (error) {
      // Catch any synchronous errors and reject the promise
      console.error(':( readGpxFile error'.red);
      reject(error);
    }
  });
}

// Get string between two included string of characters
const getStringBetweenIncludedPatterns: GetStringBetweenIncludedPatterns = async ({ str, pattern1, pattern2 }) => {
  return new Promise((resolve, reject) => {
    try {
      // Regex
      let regex = new RegExp(pattern1, "g");

      // Count patterns
      const matchResult = str.match(regex);
      const patternCount = matchResult ? matchResult.length : 0;

      // While loop settings
      let i = 0;
      let resultArray = [];

      while (i < patternCount) {
        // Number of total characters
        const totalStr = str.length;

        // Slice str to each pattern segment
        const pattern1String = (pattern1 instanceof RegExp) ? pattern1.source : pattern1;
        const patternPosition = str.indexOf(pattern1String);
        const pattern2String = (pattern2 instanceof RegExp) ? pattern2.source : pattern2;
        const patternLastPosition = str.indexOf(pattern2String) + pattern2String.length;
        const patternStr = str.substring(patternPosition, patternLastPosition);

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
          const resArr = { length: resultArray.length, result: resultArray.filter(Boolean) };

          debugMode && console.log(`test getStringBetweenIncludedPatterns => `.magenta, JSON.stringify(resArr));
          resolve(resArr);
        }
      }
    } catch (error) {
      console.error("getStringBetweenIncludedPatterns error", error);
      reject(error);
    }
  });
}

// Merge all stages track
const mergeStagesTrackData: MergeStagesTrack = async (stagesTrackArr) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Result object
      const mergeStagesTrackData: MergeStagesTrackData = {
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
      let positionsFullArr: any[] = [];
      let elevationsFullArr: any[] = [];
      let distancesFullArr: number[] = [];

      // Listing each stage
      stagesTrackArr.forEach(async (stage, i) => {
        // ID
        const id = i.toString();

        // Merge names
        let nameObj = {
          id: id,
          name: stage.name
        };

        // Merge types
        let typeObj = {
          id: id,
          type: stage.type
        };

        // Merge comments
        let cmtObj = {
          id: id,
          type: stage.cmt
        };

        // Merge descriptions
        let descObj = {
          id: id,
          type: stage.desc
        };

        // Merge sources
        let srcObj = {
          id: id,
          type: stage.src
        };

        // Merge url
        let urlObj = {
          id: id,
          type: stage.url
        };

        // Merge urlname
        let urlnameObj = {
          id: id,
          type: stage.urlname
        };

        // Merge link
        let linkObj = {
          id: id,
          type: stage.link
        };

        // Merge number
        let numberObj = {
          id: id,
          type: stage.number
        };

        // Merge extensions
        let extensionsObj = {
          id: id,
          type: stage.extensions
        };

        // Positions array of objects
        let positionsObj = {
          id: id,
          positions: stage.positions.positionsArrObj
        };

        // Distance array of objects
        let distancesObj = {
          id: id,
          distance: {
            meters: stage.distance.meters,
            yards: stage.distance.yards
          }
        };

        // Elevations array
        let eleObj = {
          id: id,
          elevations: stage.elevations.full
        };

        // Cumulative elevations
        let cumulativeElevationsObj = {
          id: stage.id,
          cumulativePositiveElevation: stage.elevations.cumulativePositiveElevation,
          cumulativeNegativeElevation: stage.elevations.cumulativeNegativeElevation
        };

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
        if (stagesTrackArr.length === i + 1) {
          // Positions
          positionsFullArr = positionsFullArr.flat();
          mergeStagesTrackData.positions.full = positionsFullArr;

          // Elevations
          elevationsFullArr = elevationsFullArr.flat();
          mergeStagesTrackData.elevations.full = elevationsFullArr;

          // Distances
          const distancesFullArrCalc = distancesFullArr.reduce((a, b) => a + b, 0);
          mergeStagesTrackData.distances.full.meters = distancesFullArrCalc;
          mergeStagesTrackData.distances.full.yards = parseInt((distancesFullArrCalc * 1.093613).toString());

          // Min elevation
          mergeStagesTrackData.elevations.min = Math.min(...elevationsFullArr);

          // Max elevation
          mergeStagesTrackData.elevations.max = Math.max(...elevationsFullArr);

          // Cumulative elevations
          let cumulativeElevations = await getCumulativeElevations({ elevationsArr: elevationsFullArr });

          // Cumulative positive elevation
          let cumulativePositiveElevation = cumulativeElevations.cumulativePositiveElevation;
          mergeStagesTrackData.cumulativeElevations.cumulativePositiveElevation = cumulativePositiveElevation;

          // Cumulative negative elevation
          let cumulativeNegativeElevation = cumulativeElevations.cumulativeNegativeElevation;
          mergeStagesTrackData.cumulativeElevations.cumulativeNegativeElevation = cumulativeNegativeElevation;

          debugMode && console.log(`test mergeStagesTrackData => `.magenta, JSON.stringify(mergeStagesTrackData));
          resolve(mergeStagesTrackData);
        }
      });
    } catch (error) {
      console.error(':( mergeStagesTrackData error'.red);
      reject(error);
    }
  });
}

// Get string between tags
const getString: GetString = async ({ str, pattern1, pattern2 }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Regex to get string between tags
      const regex1 = new RegExp(`(${pattern1}.*?${pattern2})`, 'g');

      // Regex to remove tags
      const regex2 = /(<([^>]+)>)/gi;

      // Match strings between tags
      const matches = str && str.match(regex1);

      if (matches) {
        // Extract and clean the strings
        const result = matches.map((match) => match.replace(regex2, ""));

        resolve(result);
      } else {
        // No matches found, return an empty array
        resolve([]);
      }
    } catch (error) {
      console.error(':( getString error'.red);
      reject(error);
    }
  });
};

// Get link tag
const getLinkTrk: GetLinkTrk = async (str) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Regex patterns
      const hrefRegex = /<link\s+href="([^"]+)"/;
      const textRegex = /<text>(.*?)<\/text>/;
      const typeRegex = /<type>(.*?)<\/type>/;

      // Check if link tag exists
      const check = str.includes(`<link`);

      if (check) {
        // Get href
        const hrefMatch = str.match(hrefRegex);
        const href = hrefMatch ? hrefMatch[1] : null;

        // Get text
        const textMatch = str.match(textRegex);
        const text = textMatch ? textMatch[1] : null;

        // Get type
        const typeMatch = str.match(typeRegex);
        const type = typeMatch ? typeMatch[1] : null;

        const linkTrk: GetLinkTrkData = {
          href: href,
          text: text,
          type: type
        };

        debugMode && console.log(`test getLink => `.magenta, JSON.stringify(linkTrk));
        resolve(linkTrk);
      } else {
        const linkTrk: GetLinkTrkData = {
          href: null,
          text: null,
          type: null
        };

        resolve(linkTrk);
      }
    } catch (error) {
      console.error(":( getLink error".red);
      reject(error);
    }
  });
};

// Get extensions tag
const getExtensions: GetExtensions = async ({ str, pattern1, pattern2 }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Convert pattern1 and pattern2 to strings if they are regular expressions
      const regexStr = new RegExp(`${(pattern1 instanceof RegExp) ? pattern1.source : pattern1}(.*?)${(pattern2 instanceof RegExp) ? pattern2.source : pattern2}`, 'g');

      // Match strings between tags
      const matches = str.match(regexStr);

      if (matches) {
        // Extract extensions
        const result: GetExtensionsData[] = matches.map((match) => {
          const extension = match.substring((pattern1 instanceof RegExp) ? pattern1.source.length : pattern1.length, match.length - ((pattern2 instanceof RegExp) ? pattern2.source.length : pattern2.length));
          return { extension };
        });

        debugMode && console.log(`test getExtensions => `.magenta, JSON.stringify(result));
        resolve(result);
      } else {
        // No matches found
        resolve([{ extension: null }]);
      }
    } catch (error) {
      console.error(":( getExtensions error".red);
      reject(error);
    }
  });
};

// Tracks
const getTracks: GetTracks = async ({ readGpxFile }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get track tag
      const stagesTrackArray: GetStringBetweenIncludedPatternsData = await getStringBetweenIncludedPatterns({
        str: readGpxFile.toString(),
        pattern1: "<trk>",
        pattern2: "</trk>"
      });

      if (stagesTrackArray.result) {
        // Default
        const resArr: GetTracksData[] = [];

        // Listing stages track
        for (let k = 0; k < stagesTrackArray.result.length; k++) {
          // Default obj
          const trackData: GetTracksData = {
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
              yards: null,
            },
            elevations: {
              full: [],
              min: null,
              max: null,
              cumulativePositiveElevation: null,
              cumulativeNegativeElevation: null,
            },
            positions: {
              positionsArrObj: [],
              positionsArrArr: [],
            },
            times: {
              full: [],
            },
            magvars: {
              full: [],
            },
            geoidheights: {
              full: [],
            },
            names: {
              full: [],
            },
            cmts: {
              full: [],
            },
            descs: {
              full: [],
            },
            srcs: {
              full: [],
            },
            urls: {
              full: [],
            },
            urlnames: {
              full: [],
            },
            syms: {
              full: [],
            },
            types: {
              full: [],
            },
            fixs: {
              full: [],
            },
            sats: {
              full: [],
            },
            hdops: {
              full: [],
            },
            vdops: {
              full: [],
            },
            pdops: {
              full: [],
            },
            ageofdgpsdatas: {
              full: [],
            },
            dgpsids: {
              full: [],
            },
            extensionss: {
              full: [],
            },
            speeds: {
              full: [],
            },
            courses: {
              full: [],
            },
          };

          // Default
          const stage = stagesTrackArray.result[k];

          // Tags tracks
          const trkptStr: SplitStringData = await splitString({ str: stage, pattern: "<trkpt" });

          // Segments tracks
          const trksegStr: any = await splitString({ str: stage, pattern: "<trkseg>" });

          // Check if data exists
          if (trkptStr.length > 0) {
            // ID track
            trackData.id = k.toString();

            // Positions array of objects
            const positionsArrObj = await getPositionsArr({ strArr: trkptStr.resArr, pattern: "\"" });
            trackData.positions.positionsArrObj = positionsArrObj;

            // Positions array of arrays
            const positionsArrArr = await convertPositionsToArr({ positionsArrObj: positionsArrObj });
            if (Array.isArray(positionsArrArr)) {
              trackData.positions.positionsArrArr = positionsArrArr;
            }

            // Distance calculation
            const distance = await trackDistanceCalculation({ positionsArray: positionsArrArr.positions });

            // Assign distance in meters
            trackData.distance.meters = distance;

            // Convert distance to yards if it's a number
            if (typeof distance === 'number') {
              trackData.distance.yards = distance * 1.093613;
            } else {
              // Handle the case where distance is not a number
              trackData.distance.yards = null;
            }

            // Elevations
            const elevationsResult: GetElevationArrData = await getElevationsArr({ strArr: trkptStr.resArr, pattern1: "<ele>", pattern2: "</ele>" });
            const elevationsArr = elevationsResult.elevationArr;

            // Full elevations
            trackData.elevations.full = elevationsArr;

            // Min elevation
            const minEle = Math.min(...elevationsArr);
            trackData.elevations.min = minEle;

            // Max elevation
            const maxEle = Math.max(...elevationsArr);
            trackData.elevations.max = maxEle;

            // Cumulative elevations
            const cumulativeElevations: GetCumulativeElevationsData = await getCumulativeElevations({ elevationsArr: elevationsArr });
            trackData.elevations.cumulativeNegativeElevation = cumulativeElevations.cumulativeNegativeElevation;
            trackData.elevations.cumulativePositiveElevation = cumulativeElevations.cumulativePositiveElevation;

            // Track points records
            const recordsTrkptArr = ["time", "magvar", "geoidheight", "name", "cmt", "desc", "src", "url", "urlname", "sym", "type", "fix", "sat", "hdop", "vdop", "pdop", "ageofdgpsdata", "dgpsid", "extensions", "speed", "course"];

            recordsTrkptArr.map(async (element) => {
              const arr = [trksegStr[1]];
              const elementArr = await getTagsValueArr({ strArr: arr, pattern1: `<${element}>`, pattern2: `</${element}>` });
              const propertyName = `${element}s`;
              trackData[propertyName] = { full: elementArr };
            });

            // ID
            trackData["id"] = k.toString();

            // Records trk "name", "type", "cmt", "desc", "src", "url", "urlname", "number" tags
            const recordsTrkArr = ["name", "type", "cmt", "desc", "src", "url", "urlname", "number"];

            recordsTrkArr.map(async (element) => {
              // Record trk elements
              const elementArr = await getString({ str: stage, pattern1: `<${element}>`, pattern2: `</${element}>` });
              trackData[element] = elementArr[0];
            });

            // Link
            // <link href="https://mywebsite.com"><text>My Website</text><type>cycling</type></link>
            const linkObj = await getLinkTrk(stage);
            trackData.link = linkObj;

            // Route extensions
            // <extensions><ogr:id>17</ogr:id><ogr:longitude>10.684415</ogr:longitude><ogr:latitude>53.865650</ogr:latitude></extensions>
            const extensions = await getExtensions({ str: stage, pattern1: "<extensions>", pattern2: "</extensions>" });
            trackData.extensions = extensions[0];

            // Add the processed track data to the result array
            resArr.push(trackData);
          }
        }

        debugMode && console.log(`test getTracks => `.magenta, JSON.stringify(resArr));
        resolve(resArr);
      } else {
        console.log(":| No tracks in the gpx file.");
        debugMode && console.log(`test getTracks => `.magenta, JSON.stringify([]));
        resolve([]);
      }
    } catch (error) {
      console.error(':( getTracks error', error);
      reject(error);
    }
  });
};

// Routes
const getRoutes: GetRoutes = async ({ readGpxFile }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get route tag
      const routesArr = await getStringBetweenIncludedPatterns({
        str: readGpxFile,
        pattern1: "<rte>",
        pattern2: "</rte>"
      });

      if (routesArr.result) {
        const resArr: GetRoutesData[] = [];

        // Listing routes
        for (let i = 0; i < routesArr.result.length; i++) {
          // Default
          const route = routesArr.result[i];

          const routeData: GetRoutesData = {
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
              yards: null,
            },
            elevations: {
              full: [],
              min: null,
              max: null,
              cumulativePositiveElevation: null,
              cumulativeNegativeElevation: null,
            },
            positions: {
              positionsArrObj: [],
              positionsArrArr: [],
            },
            times: {
              full: [],
            },
            magvars: {
              full: [],
            },
            geoidheights: {
              full: [],
            },
            names: {
              full: [],
            },
            cmts: {
              full: [],
            },
            descs: {
              full: [],
            },
            srcs: {
              full: [],
            },
            urls: {
              full: [],
            },
            urlnames: {
              full: [],
            },
            syms: {
              full: [],
            },
            types: {
              full: [],
            },
            fixs: {
              full: [],
            },
            sats: {
              full: [],
            },
            hdops: {
              full: [],
            },
            vdops: {
              full: [],
            },
            pdops: {
              full: [],
            },
            ageofdgpsdatas: {
              full: [],
            },
            dgpsids: {
              full: [],
            },
            extensionss: {
              full: [],
            },
            speeds: {
              full: [],
            },
            courses: {
              full: [],
            },
          };

          // Route ID
          routeData.id = i

          // Route points tags
          const rteptStrArr = await splitString({ str: route, pattern: "<rtept" });

          if (rteptStrArr.resArr.length > 0) {
            // Positions array of objects
            const positionsArrObj = await getPositionsArr({ strArr: rteptStrArr.resArr, pattern: "\"" });
            routeData.positions.positionsArrObj = positionsArrObj;

            // Positions array of arrays
            const positionsArrArr = (await convertPositionsToArr({ positionsArrObj })).positions;
            routeData.positions.positionsArrArr = positionsArrArr;

            // Distance calculation
            const distance = await trackDistanceCalculation({ positionsArray: positionsArrArr });
            routeData.distance.meters = distance;
            routeData.distance.yards = typeof distance === 'number' ? distance * 1.093613 : null;

            // Elevations
            const elevationsArrData = await getElevationsArr({
              strArr: rteptStrArr.resArr,
              pattern1: "<ele>",
              pattern2: "</ele>"
            });

            const elevationsArr = elevationsArrData.elevationArr;
            routeData.elevations.full = elevationsArr;

            // Min and max elevation
            routeData.elevations.min = Math.min(...elevationsArr);
            routeData.elevations.max = Math.max(...elevationsArr);

            // Cumulative elevations
            const cumulativeElevations = await getCumulativeElevations({ elevationsArr });
            routeData.elevations.cumulativeNegativeElevation = cumulativeElevations.cumulativeNegativeElevation;
            routeData.elevations.cumulativePositiveElevation = cumulativeElevations.cumulativePositiveElevation;

            // Record route points tags
            const recordsRteptArr = ["time", "magvar", "geoidheight", "name", "cmt", "desc", "src", "url", "urlname", "sym", "type", "fix", "sat", "hdop", "vdop", "pdop", "ageofdgpsdata", "dgpsid", "extensions", "speed", "course"];

            await Promise.all(recordsRteptArr.map(async (element) => {
              if (rteptStrArr.resArr.length > 1) {
                const elementArr = await getTagsValueArr({ strArr: [rteptStrArr.resArr[0]], pattern1: `<${element}>`, pattern2: `</${element}>` });
                routeData[`${element}s`] = { full: elementArr.tagsValueArr };
              } else {
                console.log(`rteptStrArr.resArr does not contain enough elements for ${element}`);
              }
            }));

            // Records route "name", "type", "cmt", "desc", "src", "url", "urlname", "number" tags
            const recordsRteArr = ["name", "type", "cmt", "desc", "src", "url", "urlname", "number"];

            await Promise.all(recordsRteArr.map(async (element) => {
              const elementArr = await getString({
                str: route,
                pattern1: `<${element}>`,
                pattern2: `</${element}>`
              });
              routeData[element] = elementArr[0];
            }));

            // Route link
            const linkObj = await getLinkTrk(route);
            routeData.link = linkObj;

            // Route extensions
            const extensions = await getExtensions({
              str: route,
              pattern1: `<extensions>`,
              pattern2: `</extensions>`
            });

            if (extensions.length > 0 && extensions[0].extension) {
              routeData.extensions = extensions[0].extension;
            } else {
              routeData.extensions = null;
            }

            // Record route
            resArr.push(routeData);
          }
        }

        debugMode && console.log(`test getRoutes => `.magenta, JSON.stringify(resArr));
        resolve(resArr);
      } else {
        console.log(":| No routes in the gpx file.");
        debugMode && console.log(`test getRoutes => `.magenta, JSON.stringify([]));
        resolve([]);
      }
    } catch (error) {
      console.error(':( getRoutes error', error);
      reject(error);
    }
  });
};

// Waypoints
const getWayPoints: GetWayPoints = async ({ readGpxFile }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // File creator
      const wayPointsArray = await getStringBetweenIncludedPatterns({
        str: readGpxFile,
        pattern1: "<wpt",
        pattern2: "</wpt>"
      });

      if (wayPointsArray.result) {
        const resArr: GetWayPointsData[] = [];

        // Listing way points
        for (let m = 0; m < wayPointsArray.result.length; m++) {
          const point = wayPointsArray.result[m];

          const wayPointsData: GetWayPointsData = {
            id: m,
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
            link: null,
          };

          // Tags tracks
          const wptStr = await splitString({ str: point, pattern: "<wpt" });

          // Check if data exists
          if (wptStr.resArr.length > 0) {
            // Position
            const positionsArrObj = await getPositionsArr({ strArr: wptStr.resArr, pattern: "\"" });
            wayPointsData.position = `${positionsArrObj[0].lat},${positionsArrObj[0].lon}`;

            // Elevation
            const elevationsArr = await getElevationsArr({
              strArr: wptStr.resArr,
              pattern1: "<ele>",
              pattern2: "</ele>"
            });
            wayPointsData.elevation = parseFloat(elevationsArr.elevationArr[0].toString());

            // Link
            const linkObj = await getLinkTrk(wptStr.resArr[1]);
            wayPointsData.link = linkObj;

            // Route extensions
            const extensions = await getExtensions({ str: wptStr.resArr[1], pattern1: `<extensions>`, pattern2: `</extensions>` });
            wayPointsData.extensions = extensions.length > 0 ? extensions[0].extension : null;

            // Record wpt elements
            const recordsWptArr = ["time", "magvar", "geoidheight", "name", "cmt", "desc", "src", "url", "urlname", "sym", "type", "fix", "sat", "hdop", "vdop", "pdop", "ageofdgpsdata", "dgpsid", "speed", "course"];

            recordsWptArr.map(async (element) => {
              // Record wpt elements
              const elementArr = await getTagsValueArr({ strArr: wptStr.resArr, pattern1: `<${element}>`, pattern2: `</${element}>` });
              wayPointsData[element] = elementArr.tagsValueArr[1];
            });

            // ID
            wayPointsData["id"] = m;

            // Record
            resArr.push(wayPointsData);
          }
        }

        debugMode && console.log(`test getWayPoints => `.magenta, JSON.stringify(resArr));
        resolve(resArr);
      } else {
        // Console message
        console.log(":| No way points in the gpx file.".yellow);

        debugMode && console.log(`test getWayPoints => `.magenta, JSON.stringify([]));
        resolve([]);
      }
    } catch (error) {
      console.log(':( getWayPoints error'.red);
      reject(console.log);
    }
  });
};

// Extract gpx data
const dataExtraction: DataExtraction = async ({ readGpxFile }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Metadata extraction
      const gpxFileMetadata = await getMetaData({ readGpxFile });

      // Routes
      const routes = await getRoutes({ readGpxFile });

      // Tracks
      const stagesTrackData: any = await getTracks({ readGpxFile });

      // Way points
      const wayPoints = await getWayPoints({ readGpxFile });

      // Merge tracks
      const mergedData: MergeStagesTrackData = await mergeStagesTrackData(stagesTrackData);

      // Result object
      const obj: DataExtractionData = {
        gpxFileMetadata,
        wayPoints,
        routes,
        stagesTrackData,
        mergedData,
      };

      debugMode && console.log(`test dataExtraction => `.magenta, JSON.stringify(obj));
      resolve(obj);
    } catch (error) {
      console.log(':( dataExtraction error'.red);
      reject(console.log);
    }
  });
};

// Split string
const splitString: SplitString = async ({ str, pattern }) => {
  return new Promise((resolve, reject) => {
    try {
      // Split
      const resArr: string[] = str.split(pattern);
      resolve({ resArr, length: resArr.length });
    } catch (error) {
      console.error(':( splitString error', error);
      reject(error);
    }
  });
};

// Get cumulative elevations
const getCumulativeElevations: GetCumulativeElevations = async ({ elevationsArr }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Default
      let cumulativeNegativeElevation = 0;
      let cumulativePositiveElevation = 0;

      // Check existing elevations values
      if (elevationsArr.length > 1) {
        // Elevations calculation
        for (const elevation of elevationsArr) {
          if (elevation < 0) {
            cumulativeNegativeElevation += elevation;
          } else {
            cumulativePositiveElevation += elevation;
          }
        }
      }

      const cumulativeElevationsObj = {
        cumulativeNegativeElevation: cumulativeNegativeElevation,
        cumulativePositiveElevation: cumulativePositiveElevation
      };

      debugMode && console.log(`test getCumulativeElevations => `.magenta, JSON.stringify(cumulativeElevationsObj));
      resolve(cumulativeElevationsObj);
    } catch (error) {
      console.error(':( getCumulativeElevations error', error);
      reject(error);
    }
  });
};

// Convert array of positions object to an array of positions arrays
const convertPositionsToArr: ConvertPositionsToArr = async ({ positionsArrObj }) => {
  return new Promise((resolve, reject) => {
    try {
      // Settings
      const resArr: ConvertPositionsToArrData = { id: '', positions: [] };

      for (const positionsObj of positionsArrObj) {
        const arr: [number, number] = [positionsObj.lat, positionsObj.lon];
        resArr.positions.push(arr);
      }

      resolve(resArr);
    } catch (error) {
      console.error(':( convertPositionsToArr error', error);
      reject(error);
    }
  });
};

// Get selected string from string
const getPositionsArr: GetPositionsArr = async ({ strArr, pattern }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Array.isArray(strArr)) {
        // Result array
        const resArr: GetPositionsArrData[] = (strArr)
          .map(str => str.split(pattern))
          .filter(splitStr => !isNaN(parseFloat(splitStr[1])) && !isNaN(parseFloat(splitStr[3])))
          .map(splitStr => ({
            lat: parseFloat(splitStr[1]),
            lon: parseFloat(splitStr[3])
          }));

        if (Array.isArray(resArr)) {
          debugMode && console.log(`test getPositionsArr => `.magenta, JSON.stringify(resArr));
          resolve(resArr);
        } else {
          // Results obj
          const resultsObj = {
            lat: 0,
            lon: 0,
          }

          debugMode && console.log(`test getPositionsArr => `.magenta, JSON.stringify(resultsObj));
          resolve([resultsObj]);
        }
      } else {
        console.log(`:( strArr is not an array`.red);
      }
    } catch (error) {
      console.error(':( getPositionsArr error', error);
      reject(error);
    }
  });
};

// Get elevations
const getElevationsArr: GetElevationArr = async ({ strArr, pattern1, pattern2 }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // If no elevations
      if (Array.isArray(strArr) && strArr.length > 0) {
        // Result array
        const resArrPromises = strArr.map(async (str, i) => {
          // Get each elevation
          const eleStr = await getString({ str, pattern1, pattern2 });

          // Record
          if (!isNaN(parseFloat(eleStr[0]))) {
            // Elevation
            return parseFloat(eleStr[0]);
          }
        });

        // Wait promesses
        const resolvedArr = await Promise.all(resArrPromises);

        // Filter values
        const resArr = resolvedArr.filter(ele => typeof ele === 'number' && !isNaN(ele)) as number[];

        debugMode && console.log(`test getElevationsArr => `.magenta, JSON.stringify({ elevationArr: resArr }));
        resolve({ elevationArr: resArr });
      } else {
        debugMode && console.log(`test getElevationsArr => `.magenta, JSON.stringify({ elevationArr: [] }));
        resolve({ elevationArr: [] });
      }
    } catch (error) {
      console.error(':( getElevationsArr error => ', error);
      reject(error);
    }
  });
};

// Get tag's value
const getTagsValueArr: GetTagsValueArr = async ({ strArr, pattern1, pattern2 }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Array.isArray(strArr)) {
        // Mapping selected string array to promises
        const promises = strArr.map(async (str) => {
          // Get each tag value
          const tagValue = await getString({ str, pattern1, pattern2 });

          return tagValue[0] ? tagValue[0] : "";
        });

        // Resolve all promises and return the resulting array
        const tagsValueArr = await Promise.all(promises);

        debugMode && console.log(`test getTagsValueArr => `.magenta, JSON.stringify({ tagsValueArr: tagsValueArr }));
        resolve({ tagsValueArr: tagsValueArr });
      } else {
        debugMode && console.log(`test getTagsValueArr => `.magenta, JSON.stringify({ tagsValueArr: [] }));
        resolve({ tagsValueArr: [] });
      }
    } catch (error) {
      console.error(':( getTagsValueArr error', error);
      reject(error);
    }
  });
};

// Get bounds tag
const getBounds: GetBounds = async (metaData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Split string
      const bounds = metaData.metaData.str.split(`<bounds`);

      // Check if bounds tag exists
      if (bounds.length > 1) {
        // Select values
        const selectedValue = bounds[1].split("\"");

        // Obj
        const boundsDataObj: GetBoundsData = {
          bounds: {
            minLat: parseFloat(selectedValue[1]),
            minLon: parseFloat(selectedValue[3]),
            maxLat: parseFloat(selectedValue[5]),
            maxLon: parseFloat(selectedValue[7])
          }
        };

        debugMode && console.log(`test getBounds => `.magenta, JSON.stringify(boundsDataObj));
        resolve(boundsDataObj);
      } else {
        // Obj
        const boundsDataObj: GetBoundsData = {
          bounds: {
            minLat: null,
            minLon: null,
            maxLat: null,
            maxLon: null
          }
        };

        debugMode && console.log(`test getBounds => `.magenta, JSON.stringify(boundsDataObj));
        resolve(boundsDataObj);
      }
    } catch (error) {
      console.log(":( getBounds error".red);
      reject(console.log);
    }
  });
};

// Get link tag
const getLink: GetLink = async (str) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if link tag exists
      const checkedLinks = str.str.includes(`<link`);

      // Data existing checking
      if (checkedLinks) {
        // Split str
        const links = str.str.split(`<link`);

        // Get href
        let linksArr = links[1].split(`"`);
        let href = linksArr[1] ?? "";

        // Get text
        let textArray: string[] = await getString({ str: links[1], pattern1: `<text>`, pattern2: `</text>` });
        let text: string = textArray[0] ?? "";

        // Get type
        let typeArray: string[] = await getString({ str: links[1], pattern1: `<type>`, pattern2: `</type>` });
        let type: string = typeArray[0] ?? "";

        // Link data obj
        const linkDataObj: GetLinkData = {
          href: href,
          text: text,
          type: type
        };

        debugMode && console.log(`test getLink => `.magenta, JSON.stringify(linkDataObj));
        resolve(linkDataObj);
      } else {
        // Return an empty object
        let linkDataObj: GetLinkData = {
          href: null,
          text: null,
          type: null
        };

        debugMode && console.log(`test getLink => `.magenta, JSON.stringify(linkDataObj));
        resolve(linkDataObj);
      }
    } catch (error) {
      console.log(":( getLink error".red);
      reject(console.log);
    }
  });
};

// Get metadata from a GPX file
const getMetaData: GetMetaData = async ({ readGpxFile }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let metadataObj: GetMetaDataData = {
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

      // Extract creator name from the GPX file
      const resultData = await getStringBetweenIncludedPatterns({ str: readGpxFile, pattern1: "creator=", pattern2: "<metadata>" });

      // Default
      let gpxFileCreatorName = "";

      if (resultData.result && resultData.result.length > 0) {
        gpxFileCreatorName = resultData.result[0].split("\"")[1];
      } else {
        console.log(`:| The "<gpx />" tag does not contained the "creator" property.`.yellow);
      }

      // Extract metadata from the GPX file
      const metaData: GetStringBetweenIncludedPatternsData = await getStringBetweenIncludedPatterns({ str: readGpxFile, pattern1: "<metadata>", pattern2: "</metadata>" });

      if (metaData.result) {
        // Extract bounds from the metadata
        const boundsObj: GetBoundsData = await getBounds({ metaData: { str: readGpxFile, pattern1: "<metadata>", pattern2: "</metadata>" } });

        // Extract links from metadata
        const linkObj: GetLinkData | null = await getLink({ str: readGpxFile, pattern: "<metadata>", pattern2: "</metadata>" });

        const arr = [`name`, `desc`, `author`, `copyright`, `time`, `keywords`, `extensions`];
        const resArr: string[] = [];

        for (const element of arr) {
          let data: string | null = metaData.result[0].substring(metaData.result[0].lastIndexOf(`<${element}>`) + `<${element}>`.length, metaData.result[0].lastIndexOf(`</${element}>`));

          if (data && data.substring(0, 5) === "<meta") {
            data = null;
          }

          if (data) {
            resArr.push(data);
          }
        }

        // Assign extracted metadata to metadataObj
        Object.keys(metadataObj.gpxFileMetadata).forEach((property, f) => {
          metadataObj.gpxFileMetadata[property] = resArr[f - 1];
          if (Object.keys(metadataObj.gpxFileMetadata).length === f + 1) {
            metadataObj.gpxFileMetadata.gpxFileCreatorName = gpxFileCreatorName;
            metadataObj.gpxFileMetadata.gpxFileBounds = boundsObj;
            metadataObj.gpxFileMetadata.gpxFileLink = linkObj;

            debugMode && console.log(`test getMetaData => `.magenta, JSON.stringify(metadataObj));
            resolve(metadataObj);
          }
        });
      } else {
        console.log(":( Gpx file is wrong. Check metadata tag in your gpx file.".red);

        debugMode && console.log(`test getMetaData => `.magenta, JSON.stringify(metadataObj));
        resolve(metadataObj);
      }
    } catch (error) {
      console.log(':( getMetaData error'.red);
      reject(error);
    }
  });
};

// Calculate between positions - Return the distance between (lat1,lon1) and (lat2,lon2)
const calculateDistanceBetweenPositions: CalculateDistanceBetweenPositions = async (positionsArrayObj) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Earth radius in meters
      const radius = 6378137.0;

      // Degree to radian conversion
      let DE2RA = 0.01745329252;

      // Extracting parameters
      let lat1 = positionsArrayObj[0].lat;
      let lon1 = positionsArrayObj[0].lon;
      let lat2 = positionsArrayObj[1].lat;
      let lon2 = positionsArrayObj[1].lon;

      // If the positions are different
      if (lat1 !== lat2 && lon1 !== lon2) {
        // Convert degrees to radians
        lat1 *= DE2RA;
        lon1 *= DE2RA;
        lat2 *= DE2RA;
        lon2 *= DE2RA;

        // Calculate distance
        const d = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2);

        // Distance in meters
        const distance = radius * Math.acos(d);

        resolve(distance);
      }
    } catch (error) {
      console.log(":( calculateDistanceBetweenPositions error".red);
      reject(console.log);
    }
  });
};

// Track distance calculation
const trackDistanceCalculation: TrackDistanceCalculation = async ({ positionsArray }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if track tag exists
      if (positionsArray.length > 1) {
        // Distance calculation between each point
        let distances = positionsArray.map(async (position, q) => {
          // Stop at last object
          if (typeof positionsArray[q + 1] === "object" && typeof positionsArray[q][1] === "number") {
            // Extract positions
            let position1: GetPositionsArrData = {
              lat: positionsArray[q][0],
              lon: positionsArray[q][1]
            };

            let position2: GetPositionsArrData = {
              lat: positionsArray[q + 1][0],
              lon: positionsArray[q + 1][1]
            };

            let arrObj: GetPositionsArrData[] = [position1, position2];

            // Calculate distance
            let distance = await calculateDistanceBetweenPositions(arrObj);
            distance = parseInt(distance.toString());

            return distance;
          }
        });

        // Reducer function to sum distances
        const reducer = (accumulator: number | undefined, curr: number | undefined): number => {
          // If either accumulator or current value is undefined, return accumulator or 0 respectively
          if (accumulator === undefined) return 0;
          if (curr === undefined) return accumulator;
          // Otherwise, sum the values
          return accumulator + curr;
        };

        // Get distances for each segment
        const distanceArr = await Promise.all(distances);

        // Filter to remove undefined values
        const filteredArray = distanceArr.filter(Boolean);

        // Total distance
        const totalDistance = filteredArray.reduce(reducer);

        if (totalDistance !== undefined) {
          resolve(totalDistance);
        } else {
          resolve(0); // Or handle the case when totalDistance is undefined
        }
      } else {
        // If there's only one position
        resolve(0);
      }
    } catch (error) {
      console.log(":( trackDistanceCalculation error".red);
      reject(console.log);
    }
  });
};

export {
  rootAppPath,
  readGpxFile,
  getStringBetweenIncludedPatterns,
  mergeStagesTrackData,
  getString,
  getLinkTrk,
  getExtensions,
  getTracks,
  getRoutes,
  getWayPoints,
  dataExtraction,
  splitString,
  getCumulativeElevations,
  convertPositionsToArr,
  getPositionsArr,
  getElevationsArr,
  getTagsValueArr,
  getBounds,
  getLink,
  getMetaData,
  calculateDistanceBetweenPositions,
  trackDistanceCalculation
}