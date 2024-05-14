// Libs
import { extractGpxData } from '../extract-gpx-data-delf01'
import { readGpxFile, dataExtraction } from '../lib/gpsLib';

jest.mock('../lib/gpsLib', () => ({
  readGpxFile: jest.fn(),
  dataExtraction: jest.fn()
}));

describe('extractGpxData function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should handle invalid file path', async () => {
    const gpxPath = './invalid_path';
    const errorObj = await extractGpxData(gpxPath, false);

    expect(errorObj).toBe(false);
  });

  test('should extract GPX data successfully', async () => {
    const gpxFilePath = './gpx/test.gpx';
    const debugMode = false;
    const mockGpxContent = { gpxFileStr: '<gpx>...</gpx>' };
    const mockDataExtractionObj = {};

    // Mock readGpxFile function
    (readGpxFile as jest.Mock).mockResolvedValue(mockGpxContent);

    // Mock dataExtraction function
    (dataExtraction as jest.Mock).mockResolvedValue(mockDataExtractionObj);

    const result = await extractGpxData(gpxFilePath, debugMode);

    expect(result).toEqual(mockDataExtractionObj);
    expect(readGpxFile).toHaveBeenCalledWith({ gpxFilePath, debugMode });
    expect(dataExtraction).toHaveBeenCalledWith({ readGpxFile: mockGpxContent.gpxFileStr, debugMode });
  });
});
