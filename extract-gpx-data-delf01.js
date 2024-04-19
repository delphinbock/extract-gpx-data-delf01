"use strict";
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
exports.extractGpxData = void 0;
// Libs
const gpsLib_1 = require("./lib/gpsLib");
const extractGpxData = (gpxFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (typeof gpxFilePath !== "string") {
            console.log(`:( GPX file ${gpxFilePath} is wrong`);
            return false;
        }
        // Read the Gpx file
        const gpxContent = yield (0, gpsLib_1.readGpxFile)(gpxFilePath);
        // Check existing file
        if (typeof gpxContent === "boolean" && gpxContent === false) {
            console.log(`:( Unable to read file "${gpxFilePath}"`);
            return false;
        }
        if (typeof gpxContent !== "string") {
            // Handle unexpected types here, if necessary
            console.log(`:( Unexpected GPX file contents`);
            return false;
        }
        // Prepare DataExtractionProps object
        const dataExtractionProps = {
            readGpxFile: gpxContent,
        };
        // Data extraction
        const dataObj = yield (0, gpsLib_1.dataExtraction)(dataExtractionProps);
        return dataObj;
    }
    catch (error) {
        console.log(`:( An error occurred while extracting GPX data: ${error}`);
        console.error(error);
        return false;
    }
});
exports.extractGpxData = extractGpxData;
