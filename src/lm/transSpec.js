export default function TransformData(inputData) {
    const idRegex = /^p(\d+)s(\d+)$/;
  
    const match = inputData.id.match(idRegex);
    if (!match) {
      throw new Error('ID format is incorrect.');
    }

    const paragraphIdx = parseInt(match[1], 10);
    const segmentIdx = parseInt(match[2], 10);
  

    const transformedData = {
      id:inputData.id,
      paragraphSpec: {
        insightType: inputData.insightType,
        paragraphIdx: paragraphIdx,
        segmentIdx: segmentIdx,
        context: inputData.context
      },
      dataSpec: inputData.dataSpec
    };
  
    return transformedData;
  }
