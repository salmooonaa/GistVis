export function transData(inputData) {
    return inputData.reduce((accumulator, currentItem) => {
      const paragraph = accumulator.find(p => p.paragraphIdx === currentItem.paragraphIdx);
  
      if (paragraph) {
        paragraph.paragraphContent.push({
          id: currentItem.id,
          unitSegmentSpec: {
            insightType: currentItem.insightType,
            segmentIdx: currentItem.segmentIdx,
            context: currentItem.context
          },
          dataSpec: currentItem.dataSpec
        });
      } else {
        accumulator.push({
          paragraphIdx: currentItem.paragraphIdx,
          paragraphContent: [
            {
              id: currentItem.id,
              unitSegmentSpec: currentItem.unitSegmentSpec,
              dataSpec: currentItem.dataSpec
            }
          ]
        });
      }
  
      return accumulator;
    }, []);
  }