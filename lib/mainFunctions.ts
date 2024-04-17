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
  MergeStagesTrackDataReturn,
  GetString,
  GetLinkTrk,
  LinkTrkReturn,
  ExtensionsResult,
  TrackData,
  LinkData,
  RouteData,
  WayPointData,
  DataExtractionResult,
  SplitStringParams,
  SplitStringResult,
  ElevationsData,
  PositionObject,
  StringArrayElement,
  GetElevationData,
  StringArrayIndexSignature,
  GetTagsValueArr,
  BoundsData,
  GetBounds,
  GetLink,
  GpxFileBounds,
  GpxFileLink,
  GpxFileMetadata,
  MetadataObj,
  Position,
  StageData,
  CumulativeElevations,
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
const getStringBetweenIncludedPatterns: GetStringBetweenIncludedPatterns = async (
  str,
  pattern1,
  pattern2
) => {
  return new Promise<string[] | null>((resolve, reject) => {
    try {
      if (!str) {
        resolve(null);
        return;
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

      resolve(resultArray.filter(Boolean)); // Filter out empty strings
    } catch (error) {
      console.error(":( getStringBetweenIncludedPatterns error".red);
      reject(error);
    }
  });
}

// Merge all stages track
const mergeStagesTrackData: MergeStagesTrackData = async (stagesTrackArr) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Initialize the merged data object
      const mergeStagesTrackData: MergeStagesTrackDataReturn = {
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
        mergeStagesTrackData.positions.positionsArrObj.push({ id: id, positions: positions });

        // Merge distances
        mergeStagesTrackData.distances.distancesArrObj.push({ id: id, distance: distance });

        // Merge elevations
        mergeStagesTrackData.elevations.minMaxArrObj.push({ id: id, elevations: elevations.full });

        // Add data to full arrays
        mergeStagesTrackData.positions.full.push(...positions.positionsArrObj);
        mergeStagesTrackData.elevations.full.push(...elevations.full);
        mergeStagesTrackData.distances.full.meters += distance.meters;

        // Cumulative elevations
        const cumulativeElevations = await exports.getCumulativeElevations(elevations.full);
        mergeStagesTrackData.cumulativeElevations.cumulativePositiveElevation += cumulativeElevations.cumulativePositiveElevation;
        mergeStagesTrackData.cumulativeElevations.cumulativeNegativeElevation += cumulativeElevations.cumulativeNegativeElevation;
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
      const regex1 = new RegExp(`\(${pattern1}.*?${pattern2}\)`, 'g');

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

        const linkTrk: LinkTrkReturn = {
          href: href,
          text: text,
          type: type
        };

        resolve(linkTrk);
      } else {
        const linkTrk: LinkTrkReturn = {
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
const getExtensions = async (str: string, pattern1: string, pattern2: string): Promise<ExtensionsResult[]> => {
  return new Promise<ExtensionsResult[]>(async (resolve, reject) => {
    try {
      // Regex to get string between tags
      const regex = new RegExp(`${pattern1}(.*?)${pattern2}`, 'g');

      // Match strings between tags
      const matches = str.match(regex);

      if (matches !== null) {
        // Extract extensions
        const result: ExtensionsResult[] = matches.map((match) => {
          const extension = match.substring(pattern1.length, match.length - pattern2.length);
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
const getTracks = async (readGpxFile: string): Promise<TrackData[]> => {
  return new Promise<TrackData[]>(async (resolve, reject) => {
    try {
      // Get track tag
      const stagesTrackArray = await exports.getStringBetweenIncludedPatterns(readGpxFile, "<trk>", "</trk>");

      if (stagesTrackArray !== null) {
        const resArr: TrackData[] = [];

        // Listing stages track
        for (let k = 0; k < stagesTrackArray.length; k++) {
          const stage = stagesTrackArray[k];
          const trackData: TrackData = {
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
            // Calculate distance
            const distance = await exports.trackDistanceCalculation(positionsArrArr);

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
              trackData[propertyName] = { full: elementArr };
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
const getRoutes = async (readGpxFile: string): Promise<RouteData[]> => {
  return new Promise<RouteData[]>(async (resolve, reject) => {
    try {
      // Get route tag
      const routesArr = await exports.getStringBetweenIncludedPatterns(readGpxFile, "<rte>", "</rte>");

      if (routesArr !== null) {
        const resArr: RouteData[] = [];

        // Listing routes
        for (let w = 0; w < routesArr.length; w++) {
          const route = routesArr[w];
          const routeData: RouteData = {
            id: w,
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
          const rteptStrArr = await exports.splitString(route, "<rtept");

          if (rteptStrArr.length > 0) {
            // Positions array of objects
            const positionsArrObj = await exports.getPositionsArr(rteptStrArr, "\"");
            routeData.positions["positionsArrObj"] = positionsArrObj;

            // Positions array of arrays
            const positionsArrArr = await exports.convertPositionsToArr(positionsArrObj);
            routeData.positions["positionsArrArr"] = positionsArrArr;

            // Distance calculation
            const distance = await exports.trackDistanceCalculation(positionsArrArr);
            routeData.distance["meters"] = distance;
            routeData.distance["yards"] = typeof distance === 'number' ? distance * 1.093613 : null;

            // Elevations
            const elevationsArr = await exports.getElevationsArr(rteptStrArr, "<ele>", "</ele>");
            routeData.elevations["full"] = elevationsArr;

            // Min and max elevation
            routeData.elevations["min"] = Math.min(...elevationsArr);
            routeData.elevations["max"] = Math.max(...elevationsArr);

            // Cumulative elevations
            const cumulativeElevations = await exports.getCumulativeElevations(elevationsArr);
            routeData.elevations["cumulativeNegativeElevation"] = cumulativeElevations.cumulativeNegativeElevation;
            routeData.elevations["cumulativePositiveElevation"] = cumulativeElevations.cumulativePositiveElevation;

            // Record route points tags
            const recordsRteptArr = ["time", "magvar", "geoidheight", "name", "cmt", "desc", "src", "url", "urlname", "sym", "type", "fix", "sat", "hdop", "vdop", "pdop", "ageofdgpsdata", "dgpsid", "extensions", "speed", "course"];

            recordsRteptArr.map(async (element) => {
              const elementArr = await exports.getTagsValueArr([rteptStrArr[1]], `<${element}>`, `</${element}>`);
              routeData[`${element}s`] = { full: elementArr };
            });

            // Records route "name", "type", "cmt", "desc", "src", "url", "urlname", "number" tags
            const recordsRteArr = ["name", "type", "cmt", "desc", "src", "url", "urlname", "number"];

            recordsRteArr.map(async (element) => {
              const elementArr = await exports.getString(route, `<${element}>`, `</${element}>`);
              routeData[element] = elementArr[0];
            });

            // Route link
            const linkObj = await exports.getLinkTrk(route);
            routeData.link = linkObj;

            // Route extensions
            const extensions = await exports.getExtensions(route, `<extensions>`, `</extensions>`);
            routeData.extensions = extensions[0];

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
const getWayPoints = async (readGpxFile: string): Promise<WayPointData[]> => {
  return new Promise<WayPointData[]>(async (resolve, reject) => {
    try {
      // File creator
      const wayPointsArray = await exports.getStringBetweenIncludedPatterns(readGpxFile, "<wpt", "</wpt>");

      if (wayPointsArray !== null) {
        const resArr: WayPointData[] = [];

        // Listing way points
        for (let m = 0; m < wayPointsArray.length; m++) {
          const point = wayPointsArray[m];
          const wayPointsData: WayPointData = {
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
          const wptStr = await exports.splitString(point, "<wpt");

          // Check if data exists
          if (wptStr.length > 0) {
            // Position
            const positionsArrObj = await exports.getPositionsArr(wptStr, "\"");
            wayPointsData.position = positionsArrObj[0];

            // Elevation
            const elevationsArr = await exports.getElevationsArr(wptStr, "<ele>", "</ele>");
            wayPointsData.elevation = parseFloat(elevationsArr[0]);

            // Link
            const linkObj = await exports.getLinkTrk(wptStr[1]);
            wayPointsData.link = linkObj;

            // Route extensions
            const extensions = await exports.getExtensions(wptStr[1], `<extensions>`, `</extensions>`);
            wayPointsData.extensions = extensions[0];

            // Record wpt elements
            const recordsWptArr = ["time", "magvar", "geoidheight", "name", "cmt", "desc", "src", "url", "urlname", "sym", "type", "fix", "sat", "hdop", "vdop", "pdop", "ageofdgpsdata", "dgpsid", "speed", "course"];

            for (const element of recordsWptArr) {
              const elementArr = await exports.getTagsValueArr(wptStr, `<${element}>`, `</${element}>`);
              wayPointsData[element] = elementArr[1];
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
const dataExtraction = async (readGpxFile: string): Promise<DataExtractionResult> => {
  return new Promise<DataExtractionResult>(async (resolve, reject) => {
    try {
      // Metadata extraction
      const gpxFileMetadata = await exports.getMetaData(readGpxFile);

      // Routes
      const routes = await exports.getRoutes(readGpxFile);

      // Tracks
      const stagesTrackData = await exports.getTracks(readGpxFile);

      // Way points
      const wayPoints = await exports.getWayPoints(readGpxFile);

      // Merge tracks
      const mergeStagesTrackData = await exports.mergeStagesTrackData(stagesTrackData);

      // Result object
      const obj: DataExtractionResult = {
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
const splitString = async ({ str, pattern }: SplitStringParams): Promise<SplitStringResult> => {
  return new Promise<SplitStringResult>((resolve, reject) => {
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
const getCumulativeElevations = async (elevationsArr: number[]): Promise<ElevationsData> => {
  return new Promise<ElevationsData>(async (resolve, reject) => {
    try {
      // If no elevation tags
      if (elevationsArr.length === 0) {
        const obj1: ElevationsData = {
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
        const obj2: ElevationsData = {
          cumulativeNegativeElevation,
          cumulativePositiveElevation
        };

        resolve(obj2);
      } else {
        // Obj
        const obj3: ElevationsData = {
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
const convertPositionsToArr = async (positionsArrObj: PositionObject[]): Promise<number[][]> => {
  return new Promise<number[][]>(async (resolve, reject) => {
    try {
      // Settings
      const resArr: number[][] = [];

      positionsArrObj.forEach((positionsObj, i) => {
        // Array
        const arr = [positionsObj.lat, positionsObj.lon];
        resArr.push(arr);

        // End loop
        if (positionsArrObj.length === i + 1) {
          resolve(resArr);
        }
      });
    } catch (error) {
      console.error(':( convertPositionsToArr error', error);
      reject(error);
    }
  });
};

// Get selected string from string
const getPositionsArr = async (strArr: string[], pattern: string): Promise<PositionObject[]> => {
  return new Promise<PositionObject[]>(async (resolve, reject) => {
    try {
      // Result array
      const resArr: PositionObject[] = [];

      // Listing selected string
      strArr.forEach((str, i) => {
        // Split
        const splitStr = str.split(pattern);

        // Record
        if (!isNaN(parseFloat(splitStr[1])) || !isNaN(parseFloat(splitStr[3]))) {
          // Result object
          const obj: PositionObject = {
            lat: parseFloat(splitStr[1]),
            lon: parseFloat(splitStr[3])
          };

          resArr.push(obj);
        }

        // End loop
        if (strArr.length === i + 1) {
          resolve(resArr);
        }
      });
    } catch (error) {
      console.error(':( getPositionsArr error', error);
      reject(error);
    }
  });
};

// Get elevations
const getElevationsArr: GetElevationData = async (strArr, pattern1, pattern2) => {
  return new Promise<number[]>(async (resolve, reject) => {
    try {
      // If no elevations
      if (strArr.length > 0) {
        // Result array
        const resArr: number[] = [];

        // Listing selected string
        for (let i = 0; i < strArr.length; i++) {
          // Get each elevation
          const eleStr: StringArrayElement = await exports.getString(strArr[i], pattern1, pattern2);

          // Record
          if (!isNaN(parseFloat(eleStr[0]))) {
            // Elevation
            const ele = parseFloat(eleStr[1]);
            // Record elevation
            resArr.push(ele);
          }

          // End loop
          if (strArr.length === i + 1) {
            resolve(resArr);
          }
        }
      } else {
        resolve([0]);
      }
    } catch (error) {
      console.log(':( getElevationsArr error'.red);
      reject(console.log);
    }
  });
};

// Get tag's value
const getTagsValueArr: GetTagsValueArr = async (strArr, pattern1, pattern2) => {
  return new Promise<string[]>(async (resolve, reject) => {
    try {
      // Result array
      const resArr: string[] = [];

      // Listing selected string
      for (let i = 0; i < strArr.length; i++) {
        // Get each elevation
        const eleStr: StringArrayIndexSignature = await exports.getString(strArr[i], pattern1, pattern2);
        resArr.push(eleStr[0]);
      }

      resolve(resArr);
    } catch (error) {
      console.log(':( getTagsValueArr error'.red);
      reject(console.log);
    }
  });
};


// Get bounds tag
const getBounds: GetBounds = async (metaData) => {
  return new Promise<BoundsData>(async (resolve, reject) => {
    try {
      // Split string
      let a = metaData[0].split(`<bounds`);

      // Check if bounds tag exists
      if (a.length > 1) {
        // Select values
        let b = a[1].split("\"");

        // Obj
        let obj: BoundsData = {
          minlat: parseFloat(b[1]),
          minlon: parseFloat(b[3]),
          maxlat: parseFloat(b[5]),
          maxlon: parseFloat(b[7])
        };

        resolve(obj);
      } else {
        // Obj2
        let obj2: BoundsData = {
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
};

// Get link tag
const getLink: GetLink = async (str) => {
  return new Promise<LinkData>(async (resolve, reject) => {
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
          let obj: LinkData = {
            href: href,
            text: text,
            type: type
          };

          resolve(obj);
        } else {
          // Obj2
          let obj2: LinkData = {
            href: null,
            text: null,
            type: null
          };

          resolve(obj2);
        }
      } else {
        // Retourne un objet avec des valeurs null
        let objEmpty: LinkData = {
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
const getMetaData = async (readGpxFile: string): Promise<MetadataObj> => {
  return new Promise<MetadataObj>(async (resolve, reject) => {
    try {
      let metadataObj: MetadataObj = {
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
      let metaDataFileCreatorName = await exports.getStringBetweenIncludedPatterns(readGpxFile, "creator=", "<metadata>");

      if (metaDataFileCreatorName !== null) {
        gpxFileCreatorName = metaDataFileCreatorName[0].split("\"")[1];
      } else {
        gpxFileCreatorName = null;
        console.log(":( Gpx file is wrong. Check xml tag in your gpx file.".red)
      }

      // Extract metadata from the GPX file
      let metaData = await exports.getStringBetweenIncludedPatterns(readGpxFile, "<metadata>", "</metadata>");

      if (metaData !== null) {
        // Extract bounds and link from the metadata
        let boundsObj: GpxFileBounds | null = await exports.getBounds(metaData);
        let linkObj: GpxFileLink | null = await exports.getLink(metaData[0]);

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
                metadataObj.gpxFileMetadata["gpxFileCreatorName"] = gpxFileCreatorName;
                metadataObj.gpxFileMetadata["gpxFileBounds"] = boundsObj;
                metadataObj.gpxFileMetadata["gpxFileLink"] = linkObj;
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
      reject(console.log);
    }
  });
};

// Calculate between positions - Return the distance between (lat1,lon1) and (lat2,lon2)
const calculateDistanceBetweenPositions = async (positionsArrayObj: Position[]): Promise<number> => {
  return new Promise<number>(async (resolve, reject) => {
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
const trackDistanceCalculation = async (positionsArray: number[][]): Promise<number> => {
  return new Promise<number>(async (resolve, reject) => {
    try {
      // Check if track tag exists
      if (positionsArray.length > 1) {
        // Distance calculation between each point
        let distances = positionsArray.map(async (position, q) => {
          // Stop at last object
          if (typeof positionsArray[q + 1] === "object" && typeof positionsArray[q][1] === "number") {
            // Extract positions
            let position1: Position = {
              lat: positionsArray[q][0],
              lon: positionsArray[q][1]
            };

            let position2: Position = {
              lat: positionsArray[q + 1][0],
              lon: positionsArray[q + 1][1]
            };

            let arrObj: Position[] = [position1, position2];

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

export default {
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