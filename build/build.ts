// NPM
import { extractGpxData } from 'extract-gpx-data-delf01';

// Async function
const runFunction = async () => {
    // Get gpx data file
    let gpxData = await extractGpxData('gpx_files/veloscenie.gpx');

    // Console message
    console.log(gpxData);

    return gpxData;
}

runFunction();