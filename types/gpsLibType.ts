// Root app directory
type RootAppPath = () => Promise<{ rootAppDirectory: string }>;

// Read gpx file
type ReadGpxFile = (gpxFilePath: string) => Promise<string | false>;

// Get string between two included string of characters
type GetStringBetweenIncludedPatterns = (
    str: string,
    pattern1: string | RegExp,
    pattern2: string | RegExp
) => Promise<string[] | null>;

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
    };
}

interface MergeStagesTrackData {
    namesArrObj: { id: string; name: string }[];
    typeArrObj: { id: string; type: string }[];
    cmtArrObj: { id: string; type: string }[];
    descArrObj: { id: string; type: string }[];
    srcArrObj: { id: string; type: string }[];
    urlArrObj: { id: string; type: string }[];
    urlnameArrObj: { id: string; type: string }[];
    linkArrObj: { id: string; type: string }[];
    numberArrObj: { id: string; type: string }[];
    extensionsArrObj: { id: string; type: string }[];
    distances: {
        full: {
            meters: number | null;
            yards: number | null;
        };
        distancesArrObj: { id: string; distance: { meters: number; yards: number } }[];
    };
    positions: {
        full: any[];
        positionsArrObj: any[];
    };
    elevations: {
        full: number[];
        min: number | null;
        max: number | null;
        minMaxArrObj: { id: string; elevations: number[] }[];
    };
    cumulativeElevations: {
        cumulativePositiveElevation: number | null;
        cumulativeNegativeElevation: number | null;
        cumulativeElevationArrObj: { id: string }[];
    };
}

type MergeStagesTrack = (stagesTrackArr: StageData[]) => Promise<MergeStagesTrackData>;

// Get string between tags
interface GetStringProps {
    str: string;
    pattern1: string | RegExp;
    pattern2: string | RegExp;
}

type GetString = (props: GetStringProps) => Promise<string[]>;

// Get link tag
interface LinkTrkData {
    href: string | null;
    text: string | null;
    type: string | null;
}

type GetLinkTrk = (str: string) => Promise<LinkTrkData>;

// Get extension tag
interface GetExtensionsData {
    extension: string | null;
}

interface GetStringProps {
    str: string;
    pattern1: string | RegExp;
    pattern2: string | RegExp;
}

type GetExtensions = (props: GetStringProps) => Promise<GetExtensionsData[]>;

//
interface GetTrackData {
    id: number;
    name: string | null;
    type: string | null;
    cmt: string | null;
    desc: string | null;
    src: string | null;
    url: string | null;
    urlname: string | null;
    number: string | null;
    link: any;
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

interface LinkData {
    href: string | null;
    text: string | null;
    type: string | null;
}


interface RouteData {
    id: number | null;
    name: string | null;
    type: string | null;
    cmt: string | null;
    desc: string | null;
    src: string | null;
    url: string | null;
    urlname: string | null;
    number: string | null;
    link: LinkData | null;
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

interface WayPointData {
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
    link: LinkData | null;
}

interface DataExtractionResult {
    gpxFileMetadata: any;
    wayPoints: WayPointData[];
    routes: RouteData[];
    stagesTrackData: TrackData[];
    MergeStagesTrackDataInterface: any;
}

interface SplitStringParams {
    str: string;
    pattern: string;
}

interface SplitStringResult {
    resArr: string[];
}

interface ElevationsData {
    cumulativeNegativeElevation: number;
    cumulativePositiveElevation: number;
}

interface PositionObject {
    lat: number;
    lon: number;
}

interface PositionObject {
    lat: number;
    lon: number;
}

interface StringArrayElement {
    [index: number]: string;
}

interface GetElevationData {
    (strArr: string[], pattern1: string, pattern2: string): Promise<number[]>;
}

interface StringArrayIndexSignature {
    [index: number]: string;
}

interface GetTagsValueArr {
    (strArr: string[], pattern1: string, pattern2: string): Promise<string[]>;
}

interface BoundsData {
    minlat: number | null;
    minlon: number | null;
    maxlat: number | null;
    maxlon: number | null;
}

interface GetBounds {
    (metaData: string[]): Promise<BoundsData>;
}

interface LinkData {
    href: string | null;
    text: string | null;
    type: string | null;
}

interface GetLink {
    (str: string[]): Promise<LinkData>;
}

interface GpxFileBounds {
    minlat: number | null;
    minlon: number | null;
    maxlat: number | null;
    maxlon: number | null;
}

interface GpxFileLink {
    href: string | null;
    text: string | null;
    type: string | null;
}

interface GpxFileMetadata {
    gpxFileCreatorName: string | null;
    gpxFileName: string | null;
    gpxFileDescription: string | null;
    gpxFileAuthorName: string | null;
    gpxFileCopyright: string | null;
    gpxFileCreationDatetime: string | null;
    gpxFileKeywords: string | null;
    gpxFileExtensions: string | null;
    gpxFileBounds: GpxFileBounds | null;
    gpxFileLink: GpxFileLink | null;
}

interface MetadataObj {
    gpxFileMetadata: GpxFileMetadata;
}

interface Position {
    lat: number;
    lon: number;
}



interface CumulativeElevations {
    cumulativePositiveElevation: number;
    cumulativeNegativeElevation: number;
}






export {
    RootAppPath,
    ReadGpxFile,
    GetStringBetweenIncludedPatterns,
    MergeStagesTrack,
    MergeStagesTrackData,
    GetString,
    GetLinkTrk,
    LinkTrkData,
    GetExtensions,
    GetExtensionsData,
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
    CumulativeElevations
};
