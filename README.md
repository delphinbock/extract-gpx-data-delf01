![image](./extract-gpx-data-delf01.jpg)

[![npm version](https://badge.fury.io/js/extract-gpx-data-delf01.svg)](https://badge.fury.io/js/extract-gpx-data-delf01)
[![npm size](https://badge-size.herokuapp.com/delphinbock/extract-gpx-data-delf01/main/)](https://github.com/delphinbock/extract-gpx-data-delf01)
[![js](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/about/releases/)
[![Node version](https://img.shields.io/badge/node->=14.18.0-orange.svg?style=style=flat-square)](https://nodejs.org/en/about/releases/)
[![GNU License](https://img.shields.io/badge/license-GNU-blue.svg?style=style=flat-square)](https://www.gnu.org/licenses/gpl-3.0.html)
[![GPX Version](https://img.shields.io/badge/gpx_version-1.1-green.svg?style=style=flat-square)](https://www.topografix.com/gpx.asp)
[![Documentation](https://img.shields.io/badge/Documentation-github-yellow.svg?style=style=flat-square)](https://github.com/delphinbock/extract-gpx-data-delf01/blob/main/README.md)
[![Test](https://img.shields.io/badge/Test-Mocha-brightgreen.svg?style=style=flat-square)](https://mochajs.org/)

Node module that extract data from gpx file and returns a data JSON object.

Next versions: <br />
metadata => link and extension tags<br />
routes (rte) => name, extension, rtept, rtept name<br />
waypoints (wpt) => ele, time, name, sym<br />
track (trk) => time, cmt, desc, src, number, link, extension, trkpt name<br />

## Installation
1. Install extract-gpx-data-delf01 `npm install extract-gpx-data-delf01`
2. Create a gpx files directory at the root of the application.<br />
For example, create a directory named "gpx_files and/or a subdirectory named "tracks".<br /><br />
![image](./demo1.jpg)<br />
3. Put gpx files in this directory or subdirectory.<br />
Here is a multiple tracks gpx file example: [gpx file](https://github.com/delphinbock/gpx_veloscenie/blob/main/veloscenie.gpx)<br />
4. Use the following code. Write the path name of the gpx files folder like in the code's example.<br />
For examples: "directory/subdirectory/gpxName.gpx" or "directory/gpxName.gpx".<br />
```javascript
// NPM
const extractGpxDataDelf01 = require('extract-gpx-data-delf01');

// Async function
const runFunction = async () => {

    // Get gpx data file
    let gpxData = await extractGpxDataDelf01.extractGpxData("gpx_files/tracks/veloscenie.gpx");

    // Console message
    console.log(gpxData);

    return gpxData;
}

runFunction();
```

## Video installation
[![Demo video](./youtube.jpg)](https://www.youtube.com/watch?v=DbIJi81ico4)

## Explanation

You can use a gpx file containing a single track or multiple tracks.<br />
The returned object contains the metadata of the gpx file (gpxFileMetadata), the information on each of the tracks (stagesTrackData), the information of all the merged tracks (mergeStagesTrackData).<br />
The main information extracted from the gpx file are the metadata, distances (in meter), altitudes, positions, types of tracks, maximum and minimum altitudes,  names of the tracks.

## Example returned object of gpx data in json format

```javascript
{
    gpxFileMetadata: {
        gpxFileCreatorName: 'delf01',
        gpxFileName: 'Veloscenie',
        gpxFileDescription: 'Veloscenie Route gpx file containing stages',
        gpxFileAuthorName: 'Delphin Bock',
        gpxFileCopyright: 'GNU General Public License',
        gpxFileCreationDatetime: '2022-02-01 23:36:36',
        gpxFileKeywords: 'veloscenie, velo, gps, gpx, stages, track'
    },
    stagesTrackData : [
        {
            id: 1,
            name: 'Paris / Massy',
            type: 'cycling',
            positionsArrObj: [
                { lat: 48.855337, lon: 2.345867 },
                { lat: 48.852936, lon: 2.343239 },
                { lat: 48.853162, lon: 2.343176 },
                { lat: 48.853212, lon: 2.343104 }
            ],
            positionsArrArr: [
                [48.855337, 2.345867],
                [48.852936, 2.343239],
                [48.853162, 2.343176]
            ],
            distance: {
                meters: 15483,
                yards: 9,620
            },
            elevations: {
                full: [
                    50.4, 50.42, 50.46, 50.55, 50.66, 50.75,
                    51.08, 51.22, 51.19, 51.49, 51.42, 50.73,
                    51.22,  51.9, 53.05, 54.55, 55.96, 57.28,
                    59.63, 59.95, 60.41, 60.87, 61.46, 62.06,
                    62.86,  62.6, 62.21, 62.13, 62.05, 61.96,
                    62.7, 62.84, 63.03, 63.32, 63.57, 63.79
                ],
                min: 22.4,
                max 633.7,
                cumulativePositiveElevation: 567.6,
                cumulativeNegativeElevation: -345.6
            }
        },
        {
            id: 2,
            name: 'Massy / Versailles',
            type: 'cycling',
            positions: [
                { lat: 48.855337, lon: 2.345867 },
                { lat: 48.852936, lon: 2.343239 },
                { lat: 48.853162, lon: 2.343176 },
                { lat: 48.853212, lon: 2.343104 }
            ],
            elevations: {
                full: [
                    50.4, 50.42, 50.46, 50.55, 50.66, 50.75,
                    51.08, 51.22, 51.19, 51.49, 51.42, 50.73,
                    51.22,  51.9, 53.05, 54.55, 55.96, 57.28,
                    59.63, 59.95, 60.41, 60.87, 61.46, 62.06,
                    62.86,  62.6, 62.21, 62.13, 62.05, 61.96,
                    62.7, 62.84, 63.03, 63.32, 63.57, 63.79
                ],
                min: 12.4,
                max 123.7,
                cumulativePositiveElevation: 257.6,
                cumulativeNegativeElevation: -125.6
            }
        }
    ],
    mergeStagesTrackData: {
        namesArrObj: [
            { id: 0, name: 'Paris / Massy' },
            { id: 1, name: 'Massy / Versailles' },
            { id: 2, name: 'Versailles / St-Rémy-lès-Chevreuse' },
            { id: 3, name: 'St-Rémy-lès-Chevreuse / Rambouillet' },
            { id: 4, name: 'Massy / Limours' }
        ],
        typeArrObj: [
            { id: 0, type: 'cycling' },
            { id: 1, type: null },
            { id: 2, type: null },
            { id: 3, type: null },
            { id: 4, type: null },
            { id: 5, type: null }
        ],
        distances: {
            full: { meters: 490414, yards: 536323 },
            distancesArrObj: [
                { id: 1, distance: { meters: 17053, yards: 18649 } },
                { id: 2, distance: { meters: 23412, yards: 25603 } }
            ],
        },
        positions: {
            full: [
                { lat: 48.855337, lon: 2.345867 },
                { lat: 48.852936, lon: 2.343239 },
                { lat: 48.853162, lon: 2.343176 },
                { lat: 48.853212, lon: 2.343104 },
                { lat: 48.853243, lon: 2.342966 },
                { lat: 48.853265, lon: 2.342826 },
                { lat: 48.853284, lon: 2.342684 },
                { lat: 48.853298, lon: 2.342542 },
                { lat: 48.853307, lon: 2.342398 },
                { lat: 48.853334, lon: 2.34199 },
                { lat: 48.853354, lon: 2.341581 }
            ],
            positionsArrObj: [
                {
                    id: 25,
                    positions: [
                        { lat: 48.735693, lon: 2.238397 },
                        { lat: 48.735749, lon: 2.238334 },
                        { lat: 48.735771, lon: 2.238351 },
                        { lat: 48.735827, lon: 2.238408 },
                        { lat: 48.735859, lon: 2.238421 },
                        { lat: 48.735926, lon: 2.238449 },
                        { lat: 48.73606, lon: 2.238444 },
                        { lat: 48.736166, lon: 2.23836 },
                        { lat: 48.736229, lon: 2.23827 },
                        { lat: 48.736297, lon: 2.238099 }
                    ]
                },
                {
                    id: 26,
                    positions: [
                        { lat: 48.786668, lon: 2.152308 },
                        { lat: 48.786624, lon: 2.152357 },
                        { lat: 48.786584, lon: 2.152441 },
                        { lat: 48.786541, lon: 2.152521 },
                        { lat: 48.786541, lon: 2.152685 },
                        { lat: 48.786622, lon: 2.15302 },
                        { lat: 48.786642, lon: 2.153221 },
                        { lat: 48.786619, lon: 2.153342 },
                        { lat: 48.786516, lon: 2.153532 },
                        { lat: 48.786414, lon: 2.153698 },
                        { lat: 48.786176, lon: 2.153962 },
                        { lat: 48.786115, lon: 2.154028 }
                    ]
                }
            ]
        },
        elevations: {
            full: [
                20.4, 48.44, 45.11, 45.33, 48.63,  48.7, 48.33, 48.09,
                47.71, 47.58, 47.33, 46.78,  46.4, 45.97,  45.8, 45.93,
                46.25, 46.28,  46.5, 47.06, 47.61, 48.31, 49.21, 49.88,
                50.19, 50.34,  50.4, 50.42, 50.46, 50.55, 50.66, 50.75,
                51.08, 51.22, 51.19, 51.49, 51.42, 50.73, 50.72, 51.04,
                51.22,  51.9, 53.05, 54.55, 55.96, 57.28, 58.35, 59.39,
                59.63, 59.95, 60.41, 60.87, 61.46, 62.06, 62.43, 62.65,
                62.86,  62.6, 62.21, 62.13, 62.05, 61.96, 62.21, 62.59,
                62.7, 62.84, 63.03, 63.32, 63.57, 63.79, 63.95, 64.32,
                64.56, 64.77, 64.94, 65.06, 65.31, 65.76,  67.4, 68.85,
                70.42, 71.82, 72.55, 71.76, 70.81, 69.91, 68.71, 67.61,
                66.96, 66.44, 65.23, 64.39, 64.06, 63.57, 63.73, 64.75,
                65.46, 66.13, 67.01, 67.88
            ],
            min: 20.4,
            max: 72.55,
            minMaxArrObj: [
                {id: 0, min: 22.4, max: 633.7},
                {id: 1, min: 12.4, max: 123.7}
            ]
        },
        cumulativeElevations: {
            cumulativePositiveElevation: 567.6,
            cumulativeNegativeElevation: -345.6,
            cumulativeElevationArrObj: [
                {
                    id: 0,
                    cumulativePositiveElevations: 650,
                    cumulativeNegativeElevations: -350
                },
                {
                    id: 1,
                    cumulativePositiveElevations: 350,
                    cumulativeNegativeElevations: -150
                }
            ]
        }
    }
}
```
