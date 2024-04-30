// Root app directory
interface RootAppPathData {
  rootAppDirectory: string;
}

type RootAppPath = () => Promise<RootAppPathData>;

// Concatenation messages
interface MessageConcatProps {
  methodName: string;
  messagesArrObj: {
    message: string,
    color: any
  }[];
}

interface MessageConcatData {
  message: string;
}

type MessageConcat = (props: MessageConcatProps) => Promise<MessageConcatData>;

// Read gpx file
interface ReadGpxFileProps {
  gpxFilePath: string;
  debugMode: boolean;
}

interface ReadGpxFileData {
  gpxFileStr: string | null;
}

type ReadGpxFile = (props: ReadGpxFileProps) => Promise<ReadGpxFileData>;

// Get string between two included string of characters
interface GetStringBetweenIncludedPatternsProps {
  str: string;
  pattern1: string | RegExp;
  pattern2: string | RegExp;
  debugMode: boolean;
}

interface GetStringBetweenIncludedPatternsData {
  length: number;
  result: string[] | null;
}

type GetStringBetweenIncludedPatterns = (props: GetStringBetweenIncludedPatternsProps) => Promise<GetStringBetweenIncludedPatternsData>;

// Merge all stages track
interface StageData {
  id: string;
  name: string;
  type: string;
  cmt: string;
  desc: string;
  src: string;
  url: string;
  urlname: string;
  link: string;
  number: string;
  extensions: string;
  positions: {
    positionsArrObj: any[];
  };
  distance: {
    meters: number;
    yards: number;
  };
  elevations: {
    full: number[];
    min: number | null;
    max: number | null;
    cumulativePositiveElevation: number | null;
    cumulativeNegativeElevation: number | null;
  };
}

interface MergeStagesTrackProps {
  stagesTrackArr: StageData[];
  debugMode: boolean;
}

interface MergeStagesTrackData {
  namesArrObj: { id: number; name: string }[];
  typeArrObj: { id: number; type: string }[];
  cmtArrObj: { id: number; type: string }[];
  descArrObj: { id: number; type: string }[];
  srcArrObj: { id: number; type: string }[];
  urlArrObj: { id: number; type: string }[];
  urlnameArrObj: { id: number; type: string }[];
  linkArrObj: { id: number; type: string }[];
  numberArrObj: { id: number; type: string }[];
  extensionsArrObj: { id: number; type: string }[];
  distances: {
    full: {
      meters: number | null;
      yards: number | null;
    };
    distancesArrObj: { id: number; distance: { meters: number; yards: number } }[];
  };
  positions: {
    full: any[];
    positionsArrObj: any[];
  };
  elevations: {
    full: number[];
    min: number | null;
    max: number | null;
    minMaxArrObj: { id: number; elevations: number[] }[];
  };
  cumulativeElevations: {
    cumulativePositiveElevation: number | null;
    cumulativeNegativeElevation: number | null;
    cumulativeElevationArrObj: { id: string; cumulativePositiveElevation: number | null; cumulativeNegativeElevation: number | null }[];
  };
}

type MergeStagesTrack = (props: MergeStagesTrackProps) => Promise<MergeStagesTrackData>;

// Get string between tags
interface GetStringProps {
  str: string;
  pattern1: string | RegExp;
  pattern2: string | RegExp;
}

type GetString = (props: GetStringProps) => Promise<string[]>;

// Get link tag
interface GetLinkProps {
  str: string;
  debugMode: boolean;
}

interface GetLinkTrkData {
  href: string | null;
  text: string | null;
  type: string | null;
}

type GetLinkTrk = (props: GetLinkProps) => Promise<GetLinkTrkData>;

// Get extension tag
interface GetStringProps {
  str: string;
  pattern1: string | RegExp;
  pattern2: string | RegExp;
  debugMode: boolean;
}

interface GetExtensionsData {
  extension: string | null;
}

type GetExtensions = (props: GetStringProps) => Promise<GetExtensionsData[]>;

// Get tracks
interface GetTracksProps {
  readGpxFile: string;
  debugMode: boolean;
}

interface GetTracksData {
  [key: string]: any;
  id: null | string;
  name: string | null;
  type: string | null;
  cmt: string | null;
  desc: string | null;
  src: string | null;
  url: string | null;
  urlname: string | null;
  number: string | null;
  link: any;
  extensions: string | null | GetExtensionsData;
  distance: {
    meters: number | null;
    yards: number | null;
  };
  elevations: {
    full: number[];
    min: number | null;
    max: number | null;
    cumulativePositiveElevation: number | null;
    cumulativeNegativeElevation: number | null;
  };
  positions: {
    positionsArrObj: any[];
    positionsArrArr: any[];
  };
  times: {
    full: any[];
  };
  magvars: {
    full: any[];
  };
  geoidheights: {
    full: any[];
  };
  names: {
    full: any[];
  };
  cmts: {
    full: any[];
  };
  descs: {
    full: any[];
  };
  srcs: {
    full: any[];
  };
  urls: {
    full: any[];
  };
  urlnames: {
    full: any[];
  };
  syms: {
    full: any[];
  };
  types: {
    full: any[];
  };
  fixs: {
    full: any[];
  };
  sats: {
    full: any[];
  };
  hdops: {
    full: any[];
  };
  vdops: {
    full: any[];
  };
  pdops: {
    full: any[];
  };
  ageofdgpsdatas: {
    full: any[];
  };
  dgpsids: {
    full: any[];
  };
  extensionss: {
    full: any[];
  };
  speeds: {
    full: any[];
  };
  courses: {
    full: any[];
  };
}

type GetTracks = (props: GetTracksProps) => Promise<GetTracksData[]>;

// Routes
interface GetRoutesData {
  [key: string]: any;
  id: number | null;
  name: string | null;
  type: string | null;
  cmt: string | null;
  desc: string | null;
  src: string | null;
  url: string | null;
  urlname: string | null;
  number: string | null;
  link: GetLinkTrkData | null;
  extensions: string | null;
  distance: {
    meters: number | null;
    yards: number | null;
  };
  elevations: {
    full: number[];
    min: number | null;
    max: number | null;
    cumulativePositiveElevation: number | null;
    cumulativeNegativeElevation: number | null;
  };
  positions: {
    positionsArrObj: any[];
    positionsArrArr: any[];
  };
  times: {
    full: any[];
  };
  magvars: {
    full: any[];
  };
  geoidheights: {
    full: any[];
  };
  names: {
    full: any[];
  };
  cmts: {
    full: any[];
  };
  descs: {
    full: any[];
  };
  srcs: {
    full: any[];
  };
  urls: {
    full: any[];
  };
  urlnames: {
    full: any[];
  };
  syms: {
    full: any[];
  };
  types: {
    full: any[];
  };
  fixs: {
    full: any[];
  };
  sats: {
    full: any[];
  };
  hdops: {
    full: any[];
  };
  vdops: {
    full: any[];
  };
  pdops: {
    full: any[];
  };
  ageofdgpsdatas: {
    full: any[];
  };
  dgpsids: {
    full: any[];
  };
  extensionss: {
    full: any[];
  };
  speeds: {
    full: any[];
  };
  courses: {
    full: any[];
  };
}

interface GetRoutesProps {
  readGpxFile: string;
  debugMode: boolean;
}

type GetRoutes = (props: GetRoutesProps) => Promise<GetRoutesData[]>;

// Waypoints
interface GetWayPointsProps {
  readGpxFile: string;
  debugMode: boolean;
}

interface GetWayPointsData {
  [key: string]: any;
  id: number;
  name: string | null;
  position: string | null;
  elevation: number | null;
  time: string | null;
  magvar: string | null;
  geoidheight: string | null;
  cmt: string | null;
  desc: string | null;
  src: string | null;
  url: string | null;
  urlname: string | null;
  sym: string | null;
  type: string | null;
  fix: string | null;
  sat: string | null;
  hdop: string | null;
  vdop: string | null;
  pdop: string | null;
  ageofdgpsdata: string | null;
  dgpsid: string | null;
  extensions: string | null;
  speed: string | null;
  course: string | null;
  link: GetLinkTrkData | null;
}

type GetWayPoints = (props: GetWayPointsProps) => Promise<GetWayPointsData[]>;

// Data extraction
interface DataExtractionProps {
  readGpxFile: string;
  debugMode: boolean;
}

interface DataExtractionData {
  gpxFileMetadata: any;
  wayPoints: GetWayPointsData[];
  routes: GetRoutesData[];
  stagesTrackData: GetTracksData[];
  mergedData: any;
}

type DataExtraction = (props: DataExtractionProps) => Promise<DataExtractionData>;

// Split string
interface SplitStringParams {
  str: string;
  pattern: string;
}

interface SplitStringData {
  length: number;
  resArr: string[];
}

type SplitString = (props: SplitStringParams) => Promise<SplitStringData>;

// Get cumulative elevations
interface GetCumulativeElevationsArray extends Array<number> { }

interface GetCumulativeElevationsProps {
  elevationsArr: GetCumulativeElevationsArray;
  debugMode: boolean;
}

interface GetCumulativeElevationsData {
  cumulativeNegativeElevation: number;
  cumulativePositiveElevation: number;
}

type GetCumulativeElevations = (props: GetCumulativeElevationsProps) => Promise<GetCumulativeElevationsData>;

// Convert array of positions object to an array of positions arrays
interface ConvertPositionsToArrProps {
  positionsArrObj: GetPositionsArrData[];
  debugMode: boolean;
}

interface ConvertPositionsToArrData {
  id: string;
  positions: number[][];
}

type ConvertPositionsToArr = (props: ConvertPositionsToArrProps) => Promise<ConvertPositionsToArrData>;

// Get selected string from string
interface GetPositionsArrProps {
  strArr: string[] | SplitStringData;
  pattern: string;
  debugMode: boolean;
}

interface GetPositionsArrData {
  lat: number;
  lon: number;
}

type GetPositionsArr = (props: GetPositionsArrProps) => Promise<GetPositionsArrData[]>;

// Get elevations
interface GetElevationArrProps {
  strArr: string[] | SplitStringData;
  pattern1: string | RegExp;
  pattern2: string | RegExp;
  debugMode: boolean;
}

interface GetElevationArrData {
  elevationArr: number[];
}

type GetElevationArr = (props: GetElevationArrProps) => Promise<GetElevationArrData>;

// Get tag's value
interface GetTagsValueArrProps {
  strArr: string[];
  pattern1: string | RegExp;
  pattern2: string | RegExp;
  debugMode: boolean;
}

interface GetTagsValueArrData {
  tagsValueArr: string[];
}

type GetTagsValueArr = (props: GetTagsValueArrProps) => Promise<GetTagsValueArrData>;

// Get bounds tag
interface GetBoundsProps {
  [key: string]: any;
  metaData: GetStringBetweenIncludedPatternsProps;
  debugMode: boolean;
}

interface GetBoundsData {
  bounds: {
    minLat: number | null;
    maxLat: number | null;
    minLon: number | null;
    maxLon: number | null;
  };
}

type GetBounds = (props: GetBoundsProps) => Promise<GetBoundsData>;

// Get metadata from a GPX file
interface GetLinkProps {
  [key: string]: any;
  str: string;
  debugMode: boolean;
}

interface GetLinkData {
  href: string | null;
  text: string | null;
  type: string | null;
}

type GetLink = (props: GetLinkProps) => Promise<GetLinkData>;

// Get metadata from a GPX file
interface GetMetaDataProps {
  readGpxFile: string;
  debugMode: boolean;
}

interface GetMetaDataData {
  gpxFileMetadata: {
    [key: string]: any;
    gpxFileCreatorName: string | null;
    gpxFileName: string | null;
    gpxFileDescription: string | null;
    gpxFileAuthorName: string | null;
    gpxFileCopyright: string | null;
    gpxFileCreationDatetime: string | null;
    gpxFileKeywords: string | null;
    gpxFileExtensions: string | null;
    gpxFileBounds: GetBoundsData | null;
    gpxFileLink: GetLinkData | null;
  };
}

type GetMetaData = (props: GetMetaDataProps) => Promise<GetMetaDataData>;

// Calculate between positions - Return the distance between (lat1,lon1) and (lat2,lon2)
type CalculateDistanceBetweenPositions = (props: GetPositionsArrData[]) => Promise<number>;

// Track distance calculation
interface TrackDistanceCalculationProps {
  positionsArray: number[][];
}

type TrackDistanceCalculation = (props: TrackDistanceCalculationProps) => Promise<number>;


export {
  RootAppPath,
  MessageConcat,
  ReadGpxFile,
  GetStringBetweenIncludedPatterns,
  GetStringBetweenIncludedPatternsData,
  MergeStagesTrack,
  MergeStagesTrackData,
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
  DataExtractionProps,
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
  StageData,
  CalculateDistanceBetweenPositions,
  TrackDistanceCalculation,
};
