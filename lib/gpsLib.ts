// Color console
import "colors"

// Files manager
import * as fs from 'fs';

// Path manager
import * as path from 'path';

// Convert fs.readFile to an async function
import { promisify } from 'util';
const readFileAsync = promisify(fs.readFile);

// Types
import {
  RootAppPath,
  ReadGpxFile,
  GetStringBetweenIncludedPatterns,
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
  GetCumulativeElevations,
  GetCumulativeElevationsData,
  ConvertPositionsToArr,
  ConvertPositionsToArrData,
  GetPositionsArr,
  GetPositionsArrData,
  GetElevationArr,
  GetTagsValueArr,
  GetBounds,
  GetBoundsData,
  GetLink,
  GetLinkData,
  GetMetaData,
  GetMetaDataData,
  CalculateDistanceBetweenPositions,
  TrackDistanceCalculation,
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
          console.log(`:( ${absolutePath} is wrong path. Check pathname or filename`.red);
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
      if (!str) {
        resolve({ result: null });
      }

      // Convert pattern1 and pattern2 to regular expressions if they are not already regular expressions
      const regex1 = typeof pattern1 === 'string' ? new RegExp(pattern1, 'g') : pattern1;
      const regex2 = typeof pattern2 === 'string' ? new RegExp(pattern2, 'g') : pattern2;

      // Find all matches of pattern1 in the string
      const matches = str.match(regex1) || [];

      // Process each match and extract the substring between pattern1 and pattern2
      const resultArray = matches.map((match: string) => {
        const start = str.indexOf(match) + match.length;
        const end = str.indexOf(regex2.source, start);
        if (end === -1) return '';
        const patternStr = str.substring(start, end);
        return patternStr.replace(/\s+/g, '').replace(/(\r\n|\n|\r)/gm, '');
      });

      resolve({ result: resultArray.filter(Boolean) });
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
      // Initialize the merged data object
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
            yards: null,
          },
          distancesArrObj: [],
        },
        positions: {
          full: [],
          positionsArrObj: [],
        },
        elevations: {
          full: [],
          min: null,
          max: null,
          minMaxArrObj: [],
        },
        cumulativeElevations: {
          cumulativePositiveElevation: null,
          cumulativeNegativeElevation: null,
          cumulativeElevationArrObj: [],
        },
      };

      // Default variable
      mergeStagesTrackData.distances.full.meters = 0;

      // Loop through each stage
      for (const stage of stagesTrackArr) {
        const {
          id,
          name,
          type,
          cmt,
          desc,
          src,
          url,
          urlname,
          link,
          number,
          extensions,
          positions,
          distance,
          elevations
        } = stage;

        // Merge data for each stage
        mergeStagesTrackData.namesArrObj.push({ id: id, name: name });
        mergeStagesTrackData.typeArrObj.push({ id: id, type: type });
        mergeStagesTrackData.cmtArrObj.push({ id: id, type: cmt });
        mergeStagesTrackData.descArrObj.push({ id: id, type: desc });
        mergeStagesTrackData.srcArrObj.push({ id: id, type: src });
        mergeStagesTrackData.urlArrObj.push({ id: id, type: url });
        mergeStagesTrackData.urlnameArrObj.push({ id: id, type: urlname });
        mergeStagesTrackData.linkArrObj.push({ id: id, type: link });
        mergeStagesTrackData.numberArrObj.push({ id: id, type: number });
        mergeStagesTrackData.extensionsArrObj.push({ id: id, type: extensions });

        // Merge positions
        mergeStagesTrackData.positions.positionsArrObj.push({ positions: positions });

        // Merge distances
        mergeStagesTrackData.distances.distancesArrObj.push({ id: id, distance: distance });

        // Merge elevations
        mergeStagesTrackData.elevations.minMaxArrObj.push({ id: id, elevations: elevations.full });

        // Add data to full arrays
        mergeStagesTrackData.positions.full.push(...positions.positionsArrObj);
        mergeStagesTrackData.elevations.full.push(...elevations.full);
        mergeStagesTrackData.distances.full.meters += distance.meters;

        // Cumulative elevations
        const cumulativeElevations = await getCumulativeElevations({ elevationsArr: elevations.full });
        if (mergeStagesTrackData.cumulativeElevations.cumulativePositiveElevation !== null) {
          mergeStagesTrackData.cumulativeElevations.cumulativePositiveElevation ??= 0;
          mergeStagesTrackData.cumulativeElevations.cumulativePositiveElevation += cumulativeElevations.cumulativePositiveElevation;
        }
        if (mergeStagesTrackData.cumulativeElevations.cumulativeNegativeElevation !== null) {
          mergeStagesTrackData.cumulativeElevations.cumulativeNegativeElevation ??= 0;
          mergeStagesTrackData.cumulativeElevations.cumulativeNegativeElevation += cumulativeElevations.cumulativeNegativeElevation;
        }
      }

      // Calculate additional data
      if (mergeStagesTrackData.distances.full.meters !== null) {
        const metersToYards = mergeStagesTrackData.distances.full.meters * 1.093613;
        mergeStagesTrackData.distances.full.yards = Math.round(parseFloat(metersToYards.toFixed(2)));
      } else {
        mergeStagesTrackData.distances.full.yards = null;
      }
      mergeStagesTrackData.elevations.min = Math.min(...mergeStagesTrackData.elevations.full);
      mergeStagesTrackData.elevations.max = Math.max(...mergeStagesTrackData.elevations.full);

      resolve(mergeStagesTrackData);
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
      const matches = str.match(regex1);

      if (matches !== null) {
        // Extract and clean the strings
        const result = matches.map((match) => {
          // Remove HTML tags
          const cleanString = match.replace(regex2, "");
          return cleanString;
        });

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

      if (matches !== null) {
        // Extract extensions
        const result: GetExtensionsData[] = matches.map((match) => {
          const extension = match.substring((pattern1 instanceof RegExp) ? pattern1.source.length : pattern1.length, match.length - ((pattern2 instanceof RegExp) ? pattern2.source.length : pattern2.length));
          return { extension };
        });

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
      const stagesTrackArray = await getStringBetweenIncludedPatterns({
        str: readGpxFile,
        pattern1: "<trk>",
        pattern2: "</trk>"
      });


      if (stagesTrackArray.result !== null) {
        const resArr: GetTracksData[] = [];

        // Listing stages track
        for (let k = 0; k < stagesTrackArray.result.length; k++) {
          const stage = stagesTrackArray[k];
          const trackData: GetTracksData = {
            id: k,
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

          // Tags tracks
          let trkptStr = await splitString(stage, "<trkpt");

          // Segments tracks
          let trksegStr = await splitString(stage, "<trkseg>");

          // Check if data exists
          if (trkptStr.length > 0) {

            // Positions array of objects
            let positionsArrObj = await getPositionsArr(trkptStr, "\"");
            trackData.positions["positionsArrObj"] = positionsArrObj;

            // Positions array of arrays
            let positionsArrArr = await convertPositionsToArr(positionsArrObj);
            trackData.positions["positionsArrArr"] = positionsArrArr;

            // Distance calculation
            // Calculate distance
            const distance = await trackDistanceCalculation(positionsArrArr);

            // Assign distance in meters
            trackData.distance["meters"] = distance;

            // Convert distance to yards if it's a number
            if (typeof distance === 'number') {
              trackData.distance["yards"] = distance * 1.093613;
            } else {
              // Handle the case where distance is not a number
              trackData.distance["yards"] = null;
            }

            // Elevations
            let elevationsArr = await getElevationsArr(trkptStr, "<ele>", "</ele>");
            trackData.elevations["full"] = elevationsArr;

            // Min elevation
            let minEle = Math.min(...elevationsArr);
            trackData.elevations["min"] = minEle;

            // Max elevation
            let maxEle = Math.max(...elevationsArr);
            trackData.elevations["max"] = maxEle;

            // Cumulative elevations
            let cumulativeElevations = await getCumulativeElevations(elevationsArr);
            trackData.elevations["cumulativeNegativeElevation"] = cumulativeElevations.cumulativeNegativeElevation;
            trackData.elevations["cumulativePositiveElevation"] = cumulativeElevations.cumulativePositiveElevation;

            // Track points records
            let recordsTrkptArr = ["time", "magvar", "geoidheight", "name", "cmt", "desc", "src", "url", "urlname", "sym", "type", "fix", "sat", "hdop", "vdop", "pdop", "ageofdgpsdata", "dgpsid", "extensions", "speed", "course"];

            recordsTrkptArr.map(async (element) => {
              let arr = [trksegStr[1]];
              let elementArr = await getTagsValueArr(arr, `<${element}>`, `</${element}>`);
              let propertyName = `${element}s`;
              trackData[propertyName] = { full: elementArr };
            });

            // ID
            trackData["id"] = k;

            // Records trk "name", "type", "cmt", "desc", "src", "url", "urlname", "number" tags
            let recordsTrkArr = ["name", "type", "cmt", "desc", "src", "url", "urlname", "number"];

            recordsTrkArr.map(async (element) => {

              // Record trk elements
              let elementArr = await getString(stage, `<${element}>`, `</${element}>`);
              trackData[element] = elementArr[0];
            });

            // Link
            // <link href="https://mywebsite.com"><text>My Website</text><type>cycling</type></link>
            let linkObj = await getLinkTrk(stage);
            trackData.link = linkObj;

            // Route extensions
            // <extensions><ogr:id>17</ogr:id><ogr:longitude>10.684415</ogr:longitude><ogr:latitude>53.865650</ogr:latitude></extensions>
            let extensions = await getExtensions(stage, `<extensions>`, `</extensions>`);
            trackData.extensions = extensions[0];

            // Add the processed track data to the result array
            resArr.push(trackData);
          }
        }

        resolve(resArr);
      } else {
        console.log(":| No tracks in the gpx file.");
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

      if (routesArr.result !== null) {
        const resArr: GetRoutesData[] = [];

        // Listing routes
        for (const route of routesArr.result) {
          const routeData: GetRoutesData = {
            routeData: null,
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

          // Route points tags
          const rteptStrArr = await splitString({ str: route, pattern: "<rtept" });

          if (rteptStrArr.resArr.length > 0) {
            // Positions array of objects
            const positionsArrObj = await getPositionsArr({ strArr: rteptStrArr.resArr, pattern: "\"" });
            routeData.positions["positionsArrObj"] = positionsArrObj;

            // Positions array of arrays
            const positionsArrArr = (await convertPositionsToArr({ positionsArrObj })).positions;
            routeData.positions.positionsArrArr = positionsArrArr;

            // Distance calculation
            const distance = await trackDistanceCalculation({ positionsArray: positionsArrArr });
            routeData.distance["meters"] = distance;
            routeData.distance["yards"] = typeof distance === 'number' ? distance * 1.093613 : null;

            // Elevations
            const elevationsArrData = await getElevationsArr({
              strArr: rteptStrArr.resArr,
              pattern1: "<ele>",
              pattern2: "</ele>"
            });

            const elevationsArr = elevationsArrData.elevationArr;
            routeData.elevations["full"] = elevationsArr;

            // Min and max elevation
            routeData.elevations["min"] = Math.min(...elevationsArr);
            routeData.elevations["max"] = Math.max(...elevationsArr);

            // Cumulative elevations
            const cumulativeElevations = await getCumulativeElevations({ elevationsArr });
            routeData.elevations["cumulativeNegativeElevation"] = cumulativeElevations.cumulativeNegativeElevation;
            routeData.elevations["cumulativePositiveElevation"] = cumulativeElevations.cumulativePositiveElevation;

            // Record route points tags
            const recordsRteptArr = ["time", "magvar", "geoidheight", "name", "cmt", "desc", "src", "url", "urlname", "sym", "type", "fix", "sat", "hdop", "vdop", "pdop", "ageofdgpsdata", "dgpsid", "extensions", "speed", "course"];

            await Promise.all(recordsRteptArr.map(async (element) => {
              if (rteptStrArr.resArr.length > 1) {
                const elementArr = await getTagsValueArr({ strArr: [rteptStrArr.resArr[0]], pattern1: `<${element}>`, pattern2: `</${element}>` });
                routeData[`${element}s`] = { full: elementArr.tagsValueArr };
              } else {
                throw new Error(`rteptStrArr.resArr does not contain enough elements for ${element}`);
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
        resolve(resArr);
      } else {
        console.log(":| No routes in the gpx file.");
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

      if (wayPointsArray.result !== null) {
        const resArr: GetWayPointsData[] = [];

        // Listing way points
        for (let m = 0; m < wayPointsArray.length; m++) {
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
          if (wptStr.length > 0) {
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

            for (const element of recordsWptArr) {
              const elementArr = await getTagsValueArr({ strArr: wptStr.resArr, pattern1: `<${element}>`, pattern2: `</${element}>` });

              wayPointsData[element] = elementArr.tagsValueArr[0];
            }

            // Record
            resArr.push(wayPointsData);
          }
        }
        resolve(resArr);
      } else {
        // Console message
        console.log(":| No way points in the gpx file.".cyan);
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
      const gpxFileMetadata = await getMetaData(readGpxFile);

      // Routes
      const routes = await getRoutes(readGpxFile);

      // Tracks
      const stagesTrackData = await getTracks(readGpxFile);

      // Way points
      const wayPoints = await getWayPoints(readGpxFile);

      // Merge tracks
      const mergeStagesTrackData = await mergeStagesTrackData(stagesTrackData);

      // Result object
      const obj: DataExtractionData = {
        gpxFileMetadata,
        wayPoints,
        routes,
        stagesTrackData,
        mergeStagesTrackData
      };

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
      resolve({ resArr });
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
      // If no elevation tags
      if (elevationsArr.length === 0) {
        const obj1: GetCumulativeElevationsData = {
          cumulativeNegativeElevation: 0,
          cumulativePositiveElevation: 0
        };
        resolve(obj1);
      }

      // If elevation tags exist
      if (elevationsArr.length > 1) {
        // Listing elevation
        const e = elevationsArr.map(async (elevation, i) => {
          // Stop at last item array
          if (elevationsArr[i + 1] !== undefined) {
            // Calculation between each elevation
            return elevationsArr[i + 1] - elevationsArr[i];
          }
        });

        // Reducer
        const reducer = (previousValue: number, currentValue: number) => previousValue + currentValue;

        // Get promises
        const promises = await Promise.all(e);

        // Filter to remove undefined values
        const eleArr = promises.filter(Boolean) as number[];

        // Cumulative positive elevation
        let positiveEleArr = eleArr.filter((value) => value > 0);

        // Check if data exists
        let cumulativePositiveElevation: number;
        if (positiveEleArr.length !== 0) {
          cumulativePositiveElevation = positiveEleArr.reduce(reducer);
          cumulativePositiveElevation = Number(cumulativePositiveElevation.toFixed(2));
        } else {
          cumulativePositiveElevation = 0;
        }

        // Cumulative negative elevation
        let negativeEleArr = eleArr.filter((value) => value < 0);

        // Check if data exists
        let cumulativeNegativeElevation: number;
        if (negativeEleArr.length !== 0) {
          cumulativeNegativeElevation = negativeEleArr.reduce(reducer);
          cumulativeNegativeElevation = Number(cumulativeNegativeElevation.toFixed(2));
        } else {
          cumulativeNegativeElevation = 0;
        }

        // Obj
        const obj2: GetCumulativeElevationsData = {
          cumulativeNegativeElevation,
          cumulativePositiveElevation
        };

        resolve(obj2);
      } else {
        // Obj
        const obj3: GetCumulativeElevationsData = {
          cumulativeNegativeElevation: elevationsArr[0],
          cumulativePositiveElevation: elevationsArr[0]
        };
        resolve(obj3);
      }
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
      // Result array
      const resArr: GetPositionsArrData[] = strArr
        .map(str => str.split(pattern))
        .filter(splitStr => !isNaN(parseFloat(splitStr[1])) && !isNaN(parseFloat(splitStr[3])))
        .map(splitStr => ({
          lat: parseFloat(splitStr[1]),
          lon: parseFloat(splitStr[3])
        }));

      resolve(resArr);
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
      if (strArr.length > 0) {
        // Promise array to store results of each getString call
        const promises = strArr.map(str => getString({ str, pattern1, pattern2 })); // Corrected call

        // Wait for all promises to resolve
        const results = await Promise.all(promises);

        // Extract elevations from results
        const resArr = results
          .map(eleStr => parseFloat(eleStr[1])) // Parse elevation strings to numbers
          .filter(ele => !isNaN(ele)); // Filter out non-numeric elevations

        // Resolve with elevation array wrapped in an object
        resolve({ elevationArr: resArr });
      } else {
        // Resolve with an empty elevation array wrapped in an object
        resolve({ elevationArr: [] });
      }
    } catch (error) {
      console.error(':( getElevationsArr error', error);
      reject(error);
    }
  });
};

// Get tag's value
const getTagsValueArr: GetTagsValueArr = async ({ strArr, pattern1, pattern2 }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Mapping selected string array to promises
      const promises = strArr.map(async (str) => {
        // Get each tag value
        const tagValue = await getString({ str, pattern1, pattern2 });
        return tagValue[0];
      });

      // Resolve all promises and return the resulting array
      const tagsValueArr = await Promise.all(promises);
      resolve({ tagsValueArr });
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
      let a = metaData[0].split(`<bounds`);

      // Check if bounds tag exists
      if (a.length > 1) {
        // Select values
        let b = a[1].split("\"");

        // Obj
        let obj: GetBoundsData = {
          bounds: {
            minLat: parseFloat(b[1]),
            minLon: parseFloat(b[3]),
            maxLat: parseFloat(b[5]),
            maxLon: parseFloat(b[7])
          }
        };

        resolve(obj);
      } else {
        // Obj2
        let obj2: GetBoundsData = {
          bounds: {
            minLat: null,
            minLon: null,
            maxLat: null,
            maxLon: null
          }
        };

        resolve(obj2);
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
          let text = await getString(a[1], `<text>`, `</text>`);
          text = text[0];

          // Get type
          let type = await getString(a[1], `<type>`, `</type>`);
          type = type[0];

          // Obj
          let obj: GetLinkData = {
            href: href,
            text: text,
            type: type
          };

          resolve(obj);
        } else {
          // Obj2
          let obj2: GetLinkData = {
            href: null,
            text: null,
            type: null
          };

          resolve(obj2);
        }
      } else {
        // Retourne un objet avec des valeurs null
        let objEmpty: GetLinkData = {
          href: null,
          text: null,
          type: null
        };

        resolve(objEmpty);
      }
    } catch (error) {
      console.log(":( getLink error".red);
      reject(console.log);
    }
  });
};

// Get metadata from a GPX file
const getMetaData: GetMetaData = async ({ readGpxFile }) => {
  console.log("readGpxFile")
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

      let gpxFileCreatorName: string | null = null;

      // Extract creator name from the GPX file
      let metaDataFileCreatorName = await getStringBetweenIncludedPatterns(readGpxFile, "creator=", "<metadata>");

      if (metaDataFileCreatorName !== null) {
        gpxFileCreatorName = metaDataFileCreatorName[0].split("\"")[1];
      } else {
        gpxFileCreatorName = null;
        console.log(":( Gpx file is wrong. Check xml tag in your gpx file.".red)
      }

      // Extract metadata from the GPX file
      let metaData = await getStringBetweenIncludedPatterns(readGpxFile, "<metadata>", "</metadata>");

      if (metaData !== null) {
        // Extract bounds and link from the metadata
        let boundsObj: GetBoundsData | null = await getBounds(metaData);
        let linkObj: GetLinkData | null = await getLink(metaData[0]);

        let arr = [`name`, `desc`, `author`, `copyright`, `time`, `keywords`, `extensions`];
        let resArr: string[] = [];

        arr.forEach(async (element, i) => {
          let data = metaData[0].substring(metaData[0].lastIndexOf(`<${element}>`) + `<${element}>`.length, metaData[0].lastIndexOf(`</${element}>`));

          if (data.substring(0, 5) === "<meta") {
            data = null;
          }

          resArr.push(data);

          if (i + 1 === arr.length) {
            Object.keys(metadataObj.gpxFileMetadata).forEach((property, f) => {
              metadataObj.gpxFileMetadata[property] = resArr[f - 1];

              if (Object.keys(metadataObj.gpxFileMetadata).length === f + 1) {
                metadataObj.gpxFileMetadata.gpxFileCreatorName = gpxFileCreatorName;
                metadataObj.gpxFileMetadata.gpxFileBounds = boundsObj;
                metadataObj.gpxFileMetadata.gpxFileLink = linkObj;

                resolve(metadataObj);
              }
            });
          }
        });
      } else {
        console.log(":( Gpx file is wrong. Check metadata tag in your gpx file.".red)
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
      let radius = 6378137.0;

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
        let d = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2);

        // Distance in meters
        let distance = radius * Math.acos(d);

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