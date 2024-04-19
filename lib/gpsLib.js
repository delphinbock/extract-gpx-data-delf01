"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackDistanceCalculation = exports.calculateDistanceBetweenPositions = exports.getMetaData = exports.getLink = exports.getBounds = exports.getTagsValueArr = exports.getElevationsArr = exports.getPositionsArr = exports.convertPositionsToArr = exports.getCumulativeElevations = exports.splitString = exports.dataExtraction = exports.getWayPoints = exports.getRoutes = exports.getTracks = exports.getExtensions = exports.getLinkTrk = exports.getString = exports.mergeStagesTrackData = exports.getStringBetweenIncludedPatterns = exports.readGpxFile = exports.rootAppPath = void 0;
// Color console
require("colors");
// Files manager
const fs = __importStar(require("fs"));
// Path manager
const path = __importStar(require("path"));
// Convert fs.readFile to an async function
const util_1 = require("util");
const readFileAsync = (0, util_1.promisify)(fs.readFile);
// Root app directory
const rootAppPath = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let rootAppDirectory;
            if (require.main) {
                rootAppDirectory = path.dirname(require.main.filename);
            }
            else {
                rootAppDirectory = __dirname;
            }
            resolve({ rootAppDirectory: rootAppDirectory });
        }
        catch (error) {
            console.log(':( rootAppPath error'.red);
            reject(error);
        }
    }));
});
exports.rootAppPath = rootAppPath;
// Read gpx file
const readGpxFile = (gpxFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
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
        }
        catch (error) {
            // Catch any synchronous errors and reject the promise
            console.error(':( readGpxFile error'.red);
            reject(error);
        }
    });
});
exports.readGpxFile = readGpxFile;
// Get string between two included string of characters
const getStringBetweenIncludedPatterns = (_a) => __awaiter(void 0, [_a], void 0, function* ({ str, pattern1, pattern2 }) {
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
            const resultArray = matches.map((match) => {
                const start = str.indexOf(match) + match.length;
                const end = str.indexOf(regex2.source, start);
                if (end === -1)
                    return '';
                const patternStr = str.substring(start, end);
                return patternStr.replace(/\s+/g, '').replace(/(\r\n|\n|\r)/gm, '');
            });
            resolve({ result: resultArray.filter(Boolean) });
        }
        catch (error) {
            console.error("getStringBetweenIncludedPatterns error", error);
            reject(error);
        }
    });
});
exports.getStringBetweenIncludedPatterns = getStringBetweenIncludedPatterns;
// Merge all stages track
const mergeStagesTrackData = (stagesTrackArr) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Initialize the merged data object
            const mergeStagesTrackData = {
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
                const { id, name, type, cmt, desc, src, url, urlname, link, number, extensions, positions, distance, elevations } = stage;
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
                const cumulativeElevations = yield exports.getCumulativeElevations(elevations.full);
                mergeStagesTrackData.cumulativeElevations.cumulativePositiveElevation += cumulativeElevations.cumulativePositiveElevation;
                mergeStagesTrackData.cumulativeElevations.cumulativeNegativeElevation += cumulativeElevations.cumulativeNegativeElevation;
            }
            // Calculate additional data
            if (mergeStagesTrackData.distances.full.meters !== null) {
                const metersToYards = mergeStagesTrackData.distances.full.meters * 1.093613;
                mergeStagesTrackData.distances.full.yards = Math.round(parseFloat(metersToYards.toFixed(2)));
            }
            else {
                mergeStagesTrackData.distances.full.yards = null;
            }
            mergeStagesTrackData.elevations.min = Math.min(...mergeStagesTrackData.elevations.full);
            mergeStagesTrackData.elevations.max = Math.max(...mergeStagesTrackData.elevations.full);
            resolve(mergeStagesTrackData);
        }
        catch (error) {
            console.error(':( mergeStagesTrackData error'.red);
            reject(error);
        }
    }));
});
exports.mergeStagesTrackData = mergeStagesTrackData;
// Get string between tags
const getString = (_b) => __awaiter(void 0, [_b], void 0, function* ({ str, pattern1, pattern2 }) {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
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
            }
            else {
                // No matches found, return an empty array
                resolve([]);
            }
        }
        catch (error) {
            console.error(':( getString error'.red);
            reject(error);
        }
    }));
});
exports.getString = getString;
// Get link tag
const getLinkTrk = (str) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
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
                const linkTrk = {
                    href: href,
                    text: text,
                    type: type
                };
                resolve(linkTrk);
            }
            else {
                const linkTrk = {
                    href: null,
                    text: null,
                    type: null
                };
                resolve(linkTrk);
            }
        }
        catch (error) {
            console.error(":( getLink error".red);
            reject(error);
        }
    }));
});
exports.getLinkTrk = getLinkTrk;
// Get extensions tag
const getExtensions = (_c) => __awaiter(void 0, [_c], void 0, function* ({ str, pattern1, pattern2 }) {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Convert pattern1 and pattern2 to strings if they are regular expressions
            const regexStr = new RegExp(`${(pattern1 instanceof RegExp) ? pattern1.source : pattern1}(.*?)${(pattern2 instanceof RegExp) ? pattern2.source : pattern2}`, 'g');
            // Match strings between tags
            const matches = str.match(regexStr);
            if (matches !== null) {
                // Extract extensions
                const result = matches.map((match) => {
                    const extension = match.substring((pattern1 instanceof RegExp) ? pattern1.source.length : pattern1.length, match.length - ((pattern2 instanceof RegExp) ? pattern2.source.length : pattern2.length));
                    return { extension };
                });
                resolve(result);
            }
            else {
                // No matches found
                resolve([{ extension: null }]);
            }
        }
        catch (error) {
            console.error(":( getExtensions error".red);
            reject(error);
        }
    }));
});
exports.getExtensions = getExtensions;
// Tracks
const getTracks = (_d) => __awaiter(void 0, [_d], void 0, function* ({ readGpxFile }) {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Get track tag
            const stagesTrackArray = yield exports.getStringBetweenIncludedPatterns(readGpxFile, "<trk>", "</trk>");
            if (stagesTrackArray !== null) {
                const resArr = [];
                // Listing stages track
                for (let k = 0; k < stagesTrackArray.length; k++) {
                    const stage = stagesTrackArray[k];
                    const trackData = {
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
                    let trkptStr = yield exports.splitString(stage, "<trkpt");
                    // Segments tracks
                    let trksegStr = yield exports.splitString(stage, "<trkseg>");
                    // Check if data exists
                    if (trkptStr.length > 0) {
                        // Positions array of objects
                        let positionsArrObj = yield exports.getPositionsArr(trkptStr, "\"");
                        trackData.positions["positionsArrObj"] = positionsArrObj;
                        // Positions array of arrays
                        let positionsArrArr = yield exports.convertPositionsToArr(positionsArrObj);
                        trackData.positions["positionsArrArr"] = positionsArrArr;
                        // Distance calculation
                        // Calculate distance
                        const distance = yield exports.trackDistanceCalculation(positionsArrArr);
                        // Assign distance in meters
                        trackData.distance["meters"] = distance;
                        // Convert distance to yards if it's a number
                        if (typeof distance === 'number') {
                            trackData.distance["yards"] = distance * 1.093613;
                        }
                        else {
                            // Handle the case where distance is not a number
                            trackData.distance["yards"] = null;
                        }
                        // Elevations
                        let elevationsArr = yield exports.getElevationsArr(trkptStr, "<ele>", "</ele>");
                        trackData.elevations["full"] = elevationsArr;
                        // Min elevation
                        let minEle = Math.min(...elevationsArr);
                        trackData.elevations["min"] = minEle;
                        // Max elevation
                        let maxEle = Math.max(...elevationsArr);
                        trackData.elevations["max"] = maxEle;
                        // Cumulative elevations
                        let cumulativeElevations = yield exports.getCumulativeElevations(elevationsArr);
                        trackData.elevations["cumulativeNegativeElevation"] = cumulativeElevations.cumulativeNegativeElevation;
                        trackData.elevations["cumulativePositiveElevation"] = cumulativeElevations.cumulativePositiveElevation;
                        // Track points records
                        let recordsTrkptArr = ["time", "magvar", "geoidheight", "name", "cmt", "desc", "src", "url", "urlname", "sym", "type", "fix", "sat", "hdop", "vdop", "pdop", "ageofdgpsdata", "dgpsid", "extensions", "speed", "course"];
                        recordsTrkptArr.map((element) => __awaiter(void 0, void 0, void 0, function* () {
                            let arr = [trksegStr[1]];
                            let elementArr = yield exports.getTagsValueArr(arr, `<${element}>`, `</${element}>`);
                            let propertyName = `${element}s`;
                            trackData[propertyName] = { full: elementArr };
                        }));
                        // ID
                        trackData["id"] = k;
                        // Records trk "name", "type", "cmt", "desc", "src", "url", "urlname", "number" tags
                        let recordsTrkArr = ["name", "type", "cmt", "desc", "src", "url", "urlname", "number"];
                        recordsTrkArr.map((element) => __awaiter(void 0, void 0, void 0, function* () {
                            // Record trk elements
                            let elementArr = yield exports.getString(stage, `<${element}>`, `</${element}>`);
                            trackData[element] = elementArr[0];
                        }));
                        // Link
                        // <link href="https://mywebsite.com"><text>My Website</text><type>cycling</type></link>
                        let linkObj = yield exports.getLinkTrk(stage);
                        trackData.link = linkObj;
                        // Route extensions
                        // <extensions><ogr:id>17</ogr:id><ogr:longitude>10.684415</ogr:longitude><ogr:latitude>53.865650</ogr:latitude></extensions>
                        let extensions = yield exports.getExtensions(stage, `<extensions>`, `</extensions>`);
                        trackData.extensions = extensions[0];
                        // Add the processed track data to the result array
                        resArr.push(trackData);
                    }
                }
                resolve(resArr);
            }
            else {
                console.log(":| No tracks in the gpx file.");
                resolve([]);
            }
        }
        catch (error) {
            console.error(':( getTracks error', error);
            reject(error);
        }
    }));
});
exports.getTracks = getTracks;
// Routes
const getRoutes = (_e) => __awaiter(void 0, [_e], void 0, function* ({ readGpxFile }) {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Get route tag
            const routesArr = yield exports.getStringBetweenIncludedPatterns(readGpxFile, "<rte>", "</rte>");
            if (routesArr !== null) {
                const resArr = [];
                // Listing routes
                for (let w = 0; w < routesArr.length; w++) {
                    const route = routesArr[w];
                    const routeData = {
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
                    const rteptStrArr = yield exports.splitString(route, "<rtept");
                    if (rteptStrArr.length > 0) {
                        // Positions array of objects
                        const positionsArrObj = yield exports.getPositionsArr(rteptStrArr, "\"");
                        routeData.positions["positionsArrObj"] = positionsArrObj;
                        // Positions array of arrays
                        const positionsArrArr = yield exports.convertPositionsToArr(positionsArrObj);
                        routeData.positions["positionsArrArr"] = positionsArrArr;
                        // Distance calculation
                        const distance = yield exports.trackDistanceCalculation(positionsArrArr);
                        routeData.distance["meters"] = distance;
                        routeData.distance["yards"] = typeof distance === 'number' ? distance * 1.093613 : null;
                        // Elevations
                        const elevationsArr = yield exports.getElevationsArr(rteptStrArr, "<ele>", "</ele>");
                        routeData.elevations["full"] = elevationsArr;
                        // Min and max elevation
                        routeData.elevations["min"] = Math.min(...elevationsArr);
                        routeData.elevations["max"] = Math.max(...elevationsArr);
                        // Cumulative elevations
                        const cumulativeElevations = yield exports.getCumulativeElevations(elevationsArr);
                        routeData.elevations["cumulativeNegativeElevation"] = cumulativeElevations.cumulativeNegativeElevation;
                        routeData.elevations["cumulativePositiveElevation"] = cumulativeElevations.cumulativePositiveElevation;
                        // Record route points tags
                        const recordsRteptArr = ["time", "magvar", "geoidheight", "name", "cmt", "desc", "src", "url", "urlname", "sym", "type", "fix", "sat", "hdop", "vdop", "pdop", "ageofdgpsdata", "dgpsid", "extensions", "speed", "course"];
                        recordsRteptArr.map((element) => __awaiter(void 0, void 0, void 0, function* () {
                            const elementArr = yield exports.getTagsValueArr([rteptStrArr[1]], `<${element}>`, `</${element}>`);
                            routeData[`${element}s`] = { full: elementArr };
                        }));
                        // Records route "name", "type", "cmt", "desc", "src", "url", "urlname", "number" tags
                        const recordsRteArr = ["name", "type", "cmt", "desc", "src", "url", "urlname", "number"];
                        recordsRteArr.map((element) => __awaiter(void 0, void 0, void 0, function* () {
                            const elementArr = yield exports.getString(route, `<${element}>`, `</${element}>`);
                            routeData[element] = elementArr[0];
                        }));
                        // Route link
                        const linkObj = yield exports.getLinkTrk(route);
                        routeData.link = linkObj;
                        // Route extensions
                        const extensions = yield exports.getExtensions(route, `<extensions>`, `</extensions>`);
                        routeData.extensions = extensions[0];
                        // Record route
                        resArr.push(routeData);
                    }
                }
                resolve(resArr);
            }
            else {
                console.log(":| No routes in the gpx file.");
                resolve([]);
            }
        }
        catch (error) {
            console.error(':( getRoutes error', error);
            reject(error);
        }
    }));
});
exports.getRoutes = getRoutes;
// Waypoints
const getWayPoints = (_f) => __awaiter(void 0, [_f], void 0, function* ({ readGpxFile }) {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // File creator
            const wayPointsArray = yield exports.getStringBetweenIncludedPatterns(readGpxFile, "<wpt", "</wpt>");
            if (wayPointsArray !== null) {
                const resArr = [];
                // Listing way points
                for (let m = 0; m < wayPointsArray.length; m++) {
                    const point = wayPointsArray[m];
                    const wayPointsData = {
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
                    const wptStr = yield exports.splitString(point, "<wpt");
                    // Check if data exists
                    if (wptStr.length > 0) {
                        // Position
                        const positionsArrObj = yield exports.getPositionsArr(wptStr, "\"");
                        wayPointsData.position = positionsArrObj[0];
                        // Elevation
                        const elevationsArr = yield exports.getElevationsArr(wptStr, "<ele>", "</ele>");
                        wayPointsData.elevation = parseFloat(elevationsArr[0]);
                        // Link
                        const linkObj = yield exports.getLinkTrk(wptStr[1]);
                        wayPointsData.link = linkObj;
                        // Route extensions
                        const extensions = yield exports.getExtensions(wptStr[1], `<extensions>`, `</extensions>`);
                        wayPointsData.extensions = extensions[0];
                        // Record wpt elements
                        const recordsWptArr = ["time", "magvar", "geoidheight", "name", "cmt", "desc", "src", "url", "urlname", "sym", "type", "fix", "sat", "hdop", "vdop", "pdop", "ageofdgpsdata", "dgpsid", "speed", "course"];
                        for (const element of recordsWptArr) {
                            const elementArr = yield exports.getTagsValueArr(wptStr, `<${element}>`, `</${element}>`);
                            wayPointsData[element] = elementArr[1];
                        }
                        // Record
                        resArr.push(wayPointsData);
                    }
                }
                resolve(resArr);
            }
            else {
                // Console message
                console.log(":| No way points in the gpx file.".cyan);
                resolve([]);
            }
        }
        catch (error) {
            console.log(':( getWayPoints error'.red);
            reject(console.log);
        }
    }));
});
exports.getWayPoints = getWayPoints;
// Extract gpx data
const dataExtraction = (_g) => __awaiter(void 0, [_g], void 0, function* ({ readGpxFile }) {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Metadata extraction
            const gpxFileMetadata = yield exports.getMetaData(readGpxFile);
            // Routes
            const routes = yield exports.getRoutes(readGpxFile);
            // Tracks
            const stagesTrackData = yield exports.getTracks(readGpxFile);
            // Way points
            const wayPoints = yield exports.getWayPoints(readGpxFile);
            // Merge tracks
            const mergeStagesTrackData = yield exports.mergeStagesTrackData(stagesTrackData);
            // Result object
            const obj = {
                gpxFileMetadata,
                wayPoints,
                routes,
                stagesTrackData,
                mergeStagesTrackData
            };
            resolve(obj);
        }
        catch (error) {
            console.log(':( dataExtraction error'.red);
            reject(console.log);
        }
    }));
});
exports.dataExtraction = dataExtraction;
// Split string
const splitString = (_h) => __awaiter(void 0, [_h], void 0, function* ({ str, pattern }) {
    return new Promise((resolve, reject) => {
        try {
            // Split
            const resArr = str.split(pattern);
            resolve({ resArr });
        }
        catch (error) {
            console.error(':( splitString error', error);
            reject(error);
        }
    });
});
exports.splitString = splitString;
// Get cumulative elevations
const getCumulativeElevations = (_j) => __awaiter(void 0, [_j], void 0, function* ({ elevationsArr }) {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // If no elevation tags
            if (elevationsArr.length === 0) {
                const obj1 = {
                    cumulativeNegativeElevation: 0,
                    cumulativePositiveElevation: 0
                };
                resolve(obj1);
            }
            // If elevation tags exist
            if (elevationsArr.length > 1) {
                // Listing elevation
                const e = elevationsArr.map((elevation, i) => __awaiter(void 0, void 0, void 0, function* () {
                    // Stop at last item array
                    if (elevationsArr[i + 1] !== undefined) {
                        // Calculation between each elevation
                        return elevationsArr[i + 1] - elevationsArr[i];
                    }
                }));
                // Reducer
                const reducer = (previousValue, currentValue) => previousValue + currentValue;
                // Get promises
                const promises = yield Promise.all(e);
                // Filter to remove undefined values
                const eleArr = promises.filter(Boolean);
                // Cumulative positive elevation
                let positiveEleArr = eleArr.filter((value) => value > 0);
                // Check if data exists
                let cumulativePositiveElevation;
                if (positiveEleArr.length !== 0) {
                    cumulativePositiveElevation = positiveEleArr.reduce(reducer);
                    cumulativePositiveElevation = Number(cumulativePositiveElevation.toFixed(2));
                }
                else {
                    cumulativePositiveElevation = 0;
                }
                // Cumulative negative elevation
                let negativeEleArr = eleArr.filter((value) => value < 0);
                // Check if data exists
                let cumulativeNegativeElevation;
                if (negativeEleArr.length !== 0) {
                    cumulativeNegativeElevation = negativeEleArr.reduce(reducer);
                    cumulativeNegativeElevation = Number(cumulativeNegativeElevation.toFixed(2));
                }
                else {
                    cumulativeNegativeElevation = 0;
                }
                // Obj
                const obj2 = {
                    cumulativeNegativeElevation,
                    cumulativePositiveElevation
                };
                resolve(obj2);
            }
            else {
                // Obj
                const obj3 = {
                    cumulativeNegativeElevation: elevationsArr[0],
                    cumulativePositiveElevation: elevationsArr[0]
                };
                resolve(obj3);
            }
        }
        catch (error) {
            console.error(':( getCumulativeElevations error', error);
            reject(error);
        }
    }));
});
exports.getCumulativeElevations = getCumulativeElevations;
// Convert array of positions object to an array of positions arrays
const convertPositionsToArr = (_k) => __awaiter(void 0, [_k], void 0, function* ({ positionsArrObj }) {
    return new Promise((resolve, reject) => {
        try {
            // Settings
            const resArr = { id: '', positions: [] };
            for (const positionsObj of positionsArrObj) {
                const arr = [positionsObj.lat, positionsObj.lon];
                resArr.positions.push(arr);
            }
            resolve(resArr);
        }
        catch (error) {
            console.error(':( convertPositionsToArr error', error);
            reject(error);
        }
    });
});
exports.convertPositionsToArr = convertPositionsToArr;
// Get selected string from string
const getPositionsArr = (_l) => __awaiter(void 0, [_l], void 0, function* ({ strArr, pattern }) {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Result array
            const resArr = strArr
                .map(str => str.split(pattern))
                .filter(splitStr => !isNaN(parseFloat(splitStr[1])) && !isNaN(parseFloat(splitStr[3])))
                .map(splitStr => ({
                lat: parseFloat(splitStr[1]),
                lon: parseFloat(splitStr[3])
            }));
            resolve(resArr);
        }
        catch (error) {
            console.error(':( getPositionsArr error', error);
            reject(error);
        }
    }));
});
exports.getPositionsArr = getPositionsArr;
// Get elevations
const getElevationsArr = (_m) => __awaiter(void 0, [_m], void 0, function* ({ strArr, pattern1, pattern2 }) {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // If no elevations
            if (strArr.length > 0) {
                // Promise array to store results of each getString call
                const promises = strArr.map(str => exports.getString(str, pattern1, pattern2));
                // Wait for all promises to resolve
                const results = yield Promise.all(promises);
                // Extract elevations from results
                const resArr = results
                    .map(eleStr => parseFloat(eleStr[1])) // Parse elevation strings to numbers
                    .filter(ele => !isNaN(ele)); // Filter out non-numeric elevations
                // Resolve with elevation array wrapped in an object
                resolve({ elevationArr: resArr });
            }
            else {
                // Resolve with an empty elevation array wrapped in an object
                resolve({ elevationArr: [] });
            }
        }
        catch (error) {
            console.error(':( getElevationsArr error', error);
            reject(error);
        }
    }));
});
exports.getElevationsArr = getElevationsArr;
// Get tag's value
const getTagsValueArr = (_o) => __awaiter(void 0, [_o], void 0, function* ({ strArr, pattern1, pattern2 }) {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Mapping selected string array to promises
            const promises = strArr.map((str) => __awaiter(void 0, void 0, void 0, function* () {
                // Get each tag value
                const tagValue = yield exports.getString(str, pattern1, pattern2);
                return tagValue[0];
            }));
            // Resolve all promises and return the resulting array
            const tagsValueArr = yield Promise.all(promises);
            resolve({ tagsValueArr });
        }
        catch (error) {
            console.error(':( getTagsValueArr error', error);
            reject(error);
        }
    }));
});
exports.getTagsValueArr = getTagsValueArr;
// Get bounds tag
const getBounds = (metaData) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Split string
            let a = metaData[0].split(`<bounds`);
            // Check if bounds tag exists
            if (a.length > 1) {
                // Select values
                let b = a[1].split("\"");
                // Obj
                let obj = {
                    bounds: {
                        minLat: parseFloat(b[1]),
                        minLon: parseFloat(b[3]),
                        maxLat: parseFloat(b[5]),
                        maxLon: parseFloat(b[7])
                    }
                };
                resolve(obj);
            }
            else {
                // Obj2
                let obj2 = {
                    bounds: {
                        minLat: null,
                        minLon: null,
                        maxLat: null,
                        maxLon: null
                    }
                };
                resolve(obj2);
            }
        }
        catch (error) {
            console.log(":( getBounds error".red);
            reject(console.log);
        }
    }));
});
exports.getBounds = getBounds;
// Get link tag
const getLink = (str) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
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
                    let text = yield exports.getString(a[1], `<text>`, `</text>`);
                    text = text[0];
                    // Get type
                    let type = yield exports.getString(a[1], `<type>`, `</type>`);
                    type = type[0];
                    // Obj
                    let obj = {
                        href: href,
                        text: text,
                        type: type
                    };
                    resolve(obj);
                }
                else {
                    // Obj2
                    let obj2 = {
                        href: null,
                        text: null,
                        type: null
                    };
                    resolve(obj2);
                }
            }
            else {
                // Retourne un objet avec des valeurs null
                let objEmpty = {
                    href: null,
                    text: null,
                    type: null
                };
                resolve(objEmpty);
            }
        }
        catch (error) {
            console.log(":( getLink error".red);
            reject(console.log);
        }
    }));
});
exports.getLink = getLink;
// Get metadata from a GPX file
const getMetaData = (_p) => __awaiter(void 0, [_p], void 0, function* ({ readGpxFile }) {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
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
            let gpxFileCreatorName = null;
            // Extract creator name from the GPX file
            let metaDataFileCreatorName = yield exports.getStringBetweenIncludedPatterns(readGpxFile, "creator=", "<metadata>");
            if (metaDataFileCreatorName !== null) {
                gpxFileCreatorName = metaDataFileCreatorName[0].split("\"")[1];
            }
            else {
                gpxFileCreatorName = null;
                console.log(":( Gpx file is wrong. Check xml tag in your gpx file.".red);
            }
            // Extract metadata from the GPX file
            let metaData = yield exports.getStringBetweenIncludedPatterns(readGpxFile, "<metadata>", "</metadata>");
            if (metaData !== null) {
                // Extract bounds and link from the metadata
                let boundsObj = yield exports.getBounds(metaData);
                let linkObj = yield exports.getLink(metaData[0]);
                let arr = [`name`, `desc`, `author`, `copyright`, `time`, `keywords`, `extensions`];
                let resArr = [];
                arr.forEach((element, i) => __awaiter(void 0, void 0, void 0, function* () {
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
                }));
            }
            else {
                console.log(":( Gpx file is wrong. Check metadata tag in your gpx file.".red);
            }
        }
        catch (error) {
            console.log(':( getMetaData error'.red);
            reject(error);
        }
    }));
});
exports.getMetaData = getMetaData;
// Calculate between positions - Return the distance between (lat1,lon1) and (lat2,lon2)
const calculateDistanceBetweenPositions = (positionsArrayObj) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
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
        }
        catch (error) {
            console.log(":( calculateDistanceBetweenPositions error".red);
            reject(console.log);
        }
    }));
});
exports.calculateDistanceBetweenPositions = calculateDistanceBetweenPositions;
// Track distance calculation
const trackDistanceCalculation = (_q) => __awaiter(void 0, [_q], void 0, function* ({ positionsArray }) {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Check if track tag exists
            if (positionsArray.length > 1) {
                // Distance calculation between each point
                let distances = positionsArray.map((position, q) => __awaiter(void 0, void 0, void 0, function* () {
                    // Stop at last object
                    if (typeof positionsArray[q + 1] === "object" && typeof positionsArray[q][1] === "number") {
                        // Extract positions
                        let position1 = {
                            lat: positionsArray[q][0],
                            lon: positionsArray[q][1]
                        };
                        let position2 = {
                            lat: positionsArray[q + 1][0],
                            lon: positionsArray[q + 1][1]
                        };
                        let arrObj = [position1, position2];
                        // Calculate distance
                        let distance = yield calculateDistanceBetweenPositions(arrObj);
                        distance = parseInt(distance.toString());
                        return distance;
                    }
                }));
                // Reducer function to sum distances
                const reducer = (accumulator, curr) => {
                    // If either accumulator or current value is undefined, return accumulator or 0 respectively
                    if (accumulator === undefined)
                        return 0;
                    if (curr === undefined)
                        return accumulator;
                    // Otherwise, sum the values
                    return accumulator + curr;
                };
                // Get distances for each segment
                const distanceArr = yield Promise.all(distances);
                // Filter to remove undefined values
                const filteredArray = distanceArr.filter(Boolean);
                // Total distance
                const totalDistance = filteredArray.reduce(reducer);
                if (totalDistance !== undefined) {
                    resolve(totalDistance);
                }
                else {
                    resolve(0); // Or handle the case when totalDistance is undefined
                }
            }
            else {
                // If there's only one position
                resolve(0);
            }
        }
        catch (error) {
            console.log(":( trackDistanceCalculation error".red);
            reject(console.log);
        }
    }));
});
exports.trackDistanceCalculation = trackDistanceCalculation;
