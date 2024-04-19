type RootAppPath = () => Promise<{
    rootAppDirectory: string;
}>;
type ReadGpxFile = (gpxFilePath: string) => Promise<string | false>;
interface GetStringBetweenIncludedPatternsProps {
    str: string;
    pattern1: string | RegExp;
    pattern2: string | RegExp;
}
interface GetStringBetweenIncludedPatternsData {
    result: string[] | null | [];
}
type GetStringBetweenIncludedPatterns = (props: GetStringBetweenIncludedPatternsProps) => Promise<GetStringBetweenIncludedPatternsData>;
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
    namesArrObj: {
        id: string;
        name: string;
    }[];
    typeArrObj: {
        id: string;
        type: string;
    }[];
    cmtArrObj: {
        id: string;
        type: string;
    }[];
    descArrObj: {
        id: string;
        type: string;
    }[];
    srcArrObj: {
        id: string;
        type: string;
    }[];
    urlArrObj: {
        id: string;
        type: string;
    }[];
    urlnameArrObj: {
        id: string;
        type: string;
    }[];
    linkArrObj: {
        id: string;
        type: string;
    }[];
    numberArrObj: {
        id: string;
        type: string;
    }[];
    extensionsArrObj: {
        id: string;
        type: string;
    }[];
    distances: {
        full: {
            meters: number | null;
            yards: number | null;
        };
        distancesArrObj: {
            id: string;
            distance: {
                meters: number;
                yards: number;
            };
        }[];
    };
    positions: {
        full: any[];
        positionsArrObj: any[];
    };
    elevations: {
        full: number[];
        min: number | null;
        max: number | null;
        minMaxArrObj: {
            id: string;
            elevations: number[];
        }[];
    };
    cumulativeElevations: {
        cumulativePositiveElevation: number | null;
        cumulativeNegativeElevation: number | null;
        cumulativeElevationArrObj: {
            id: string;
        }[];
    };
}
type MergeStagesTrack = (stagesTrackArr: StageData[]) => Promise<MergeStagesTrackData>;
interface GetStringProps {
    str: string;
    pattern1: string | RegExp;
    pattern2: string | RegExp;
}
type GetString = (props: GetStringProps) => Promise<string[]>;
interface GetLinkTrkData {
    href: string | null;
    text: string | null;
    type: string | null;
}
type GetLinkTrk = (str: string) => Promise<GetLinkTrkData>;
interface GetExtensionsData {
    extension: string | null;
}
interface GetStringProps {
    str: string;
    pattern1: string | RegExp;
    pattern2: string | RegExp;
}
type GetExtensions = (props: GetStringProps) => Promise<GetExtensionsData[]>;
interface GetTracksProps {
    readGpxFile: string;
}
interface GetTracksData {
    [key: string]: any;
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
type GetTracks = (props: GetTracksProps) => Promise<GetTracksData[]>;
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
}
type GetRoutes = (props: GetRoutesProps) => Promise<GetRoutesData[]>;
interface GetWayPointsProps {
    readGpxFile: string;
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
interface DataExtractionProps {
    readGpxFile: string;
}
interface DataExtractionData {
    gpxFileMetadata: any;
    wayPoints: GetWayPointsData[];
    routes: GetRoutesData[];
    stagesTrackData: GetTracksData[];
    mergeStagesTrackData: any;
}
type DataExtraction = (props: DataExtractionProps) => Promise<DataExtractionData>;
interface SplitStringParams {
    str: string;
    pattern: string | RegExp;
}
interface SplitStringData {
    resArr: string[];
}
type SplitString = (props: SplitStringParams) => Promise<SplitStringData>;
interface GetCumulativeElevationsArray extends Array<number> {
}
interface GetCumulativeElevationsProps {
    elevationsArr: GetCumulativeElevationsArray;
}
interface GetCumulativeElevationsData {
    cumulativeNegativeElevation: number;
    cumulativePositiveElevation: number;
}
type GetCumulativeElevations = (props: GetCumulativeElevationsProps) => Promise<GetCumulativeElevationsData>;
interface ConvertPositionsToArrProps {
    positionsArrObj: GetPositionsArrData[];
}
interface ConvertPositionsToArrData {
    id: string;
    positions: number[][];
}
type ConvertPositionsToArr = (props: ConvertPositionsToArrProps) => Promise<ConvertPositionsToArrData>;
interface GetPositionsArrProps {
    strArr: string[];
    pattern: string;
}
interface GetPositionsArrData {
    lat: number;
    lon: number;
}
type GetPositionsArr = (props: GetPositionsArrProps) => Promise<GetPositionsArrData[]>;
interface GetElevationArrProps {
    strArr: string[];
    pattern1: string | RegExp;
    pattern2: string | RegExp;
}
interface GetElevationArrData {
    elevationArr: number[];
}
type GetElevationArr = (props: GetElevationArrProps) => Promise<GetElevationArrData>;
interface GetTagsValueArrProps {
    strArr: string[];
    pattern1: string | RegExp;
    pattern2: string | RegExp;
}
interface GetTagsValueArrData {
    tagsValueArr: string[];
}
type GetTagsValueArr = (props: GetTagsValueArrProps) => Promise<GetTagsValueArrData>;
interface GetBoundsProps {
    [key: string]: any;
    metaData: GetStringBetweenIncludedPatternsProps;
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
interface GetLinkProps {
    [key: string]: any;
    str: string;
}
interface GetLinkData {
    href: string | null;
    text: string | null;
    type: string | null;
}
type GetLink = (props: GetLinkProps) => Promise<GetLinkData>;
interface GetMetaDataProps {
    readGpxFile: string;
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
type CalculateDistanceBetweenPositions = (props: GetPositionsArrData[]) => Promise<number>;
interface TrackDistanceCalculationProps {
    positionsArray: number[][];
}
type TrackDistanceCalculation = (props: TrackDistanceCalculationProps) => Promise<number>;
export { RootAppPath, ReadGpxFile, GetStringBetweenIncludedPatterns, MergeStagesTrack, MergeStagesTrackData, GetString, GetLinkTrk, GetLinkTrkData, GetExtensions, GetExtensionsData, GetTracks, GetTracksData, GetRoutes, GetRoutesData, GetWayPoints, GetWayPointsData, DataExtraction, DataExtractionProps, DataExtractionData, SplitString, GetCumulativeElevations, GetCumulativeElevationsData, ConvertPositionsToArr, ConvertPositionsToArrData, GetPositionsArr, GetPositionsArrData, GetElevationArr, GetTagsValueArr, GetBounds, GetBoundsData, GetLink, GetLinkData, GetMetaData, GetMetaDataData, StageData, CalculateDistanceBetweenPositions, TrackDistanceCalculation, };
