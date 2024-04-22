// Libs
import { readGpxFile, dataExtraction } from './lib/gpsLib';

// Types
import { DataExtractionProps } from './types/gpsLibType';

const extractGpxData = async (gpxFilePath: string): Promise<any> => {
    try {
        if (typeof gpxFilePath !== "string") {
            console.log(`:( GPX file ${gpxFilePath} is wrong`);
            return false;
        }

       //  console.log('gpxFilePath', gpxFilePath);

        // Read the Gpx file
        const gpxContent: string | false = await readGpxFile(gpxFilePath);

  

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
        const dataExtractionProps: DataExtractionProps = {
            readGpxFile: gpxContent,
        };

        // console.log("test2")


        // Data extraction
        const dataObj = await dataExtraction(dataExtractionProps);

        console.log('dataObj', dataObj);


        return dataObj;
    } catch (error) {
        console.log(`:( An error occurred while extracting GPX data: ${error}`);
        console.error(error);
        return false;
    }
};

export { extractGpxData };
