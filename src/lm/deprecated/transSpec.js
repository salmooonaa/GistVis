export default function TransformData(inputData) {
    const idRegex = /^p(\d+)s(\d+)$/;
  
    const match = inputData.id.match(idRegex);
    if (!match) {
      throw new Error('ID format is incorrect.');
    }

    const paragraphIdx = parseInt(match[1], 10) + 1;
    const segmentIdx = parseInt(match[2], 10) + 1 ;
    let transformedData;
      // paragraphIdx: paragraphIdx,
    if (inputData.insightType === "trend" || inputData.insightType === "extreme") {
      transformedData = {
        paragraphIdx: paragraphIdx,
        id:inputData.id,
        unitSegmentSpec: {
          insightType: inputData.insightType,    
          segmentIdx: segmentIdx,
          context: inputData.context,
          attribute: inputData.attribute
        },
        dataSpec: inputData.dataSpec
      };
    } else {
      inputData.dataSpec.valueValue = inputData.dataSpec.valueValue===null?NaN:inputData.dataSpec.valueValue;
      transformedData = {
        paragraphIdx: paragraphIdx,
        id:inputData.id,
        unitSegmentSpec: {
          insightType: inputData.insightType,    
          segmentIdx: segmentIdx,
          context: inputData.context
        },
        dataSpec: inputData.dataSpec
      };
    }
  
    return transformedData;
  }
