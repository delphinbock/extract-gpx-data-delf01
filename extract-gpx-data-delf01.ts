import * as util from 'util';

// Libs
import { readGpxFile, dataExtraction } from './lib/gpsLib';

// Types
import { DataExtractionProps } from './types/gpsLibType';

const extractGpxData = async (gpxFilePath: string, debugMode: boolean): Promise<any> => {
    try {
        if (typeof gpxFilePath !== "string") {
            console.log(`:( GPX file ${gpxFilePath} is wrong`);
            return;
        } else {
            // Read the Gpx file
            const gpxContent = await readGpxFile({ gpxFilePath: gpxFilePath, debugMode: debugMode });

            // Check existing file
            if (!gpxContent) {
                console.log(`:( Unable to read file "${gpxFilePath}"`);
                return;
            }

            // Extract
            const { gpxFileStr } = gpxContent;

            if (typeof gpxFileStr !== "string") {
                // Handle unexpected types here, if necessary
                console.log(`:( Unexpected GPX file contents`);
                return;
            }

            // Prepare DataExtractionProps object
            const dataExtractionProps: DataExtractionProps = { readGpxFile: gpxFileStr, debugMode: debugMode };

            // Data extraction
            const dataExtractionObj = await dataExtraction(dataExtractionProps);

            // console.log('dataObj', JSON.stringify(dataObj));

            //console.log(util.inspect(dataExtractionObj, {showHidden: false, depth: null, colors: true}))


            return dataExtractionObj;
        }
    } catch (error) {
        console.log(`:( An error occurred while extracting GPX data: ${error}`);
        console.error(error);
        return false;
    }
};

export { extractGpxData };
