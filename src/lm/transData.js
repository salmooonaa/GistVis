export function transData(inputData) {
    return inputData.reduce((accumulator, currentItem) => {
      // console.log(accumulator)
      // console.log(currentItem)
      const paragraph = accumulator.find(p => p.paragraphIdx === currentItem.paragraphIdx);
      console.log(paragraph)
      if (paragraph) {
        paragraph.paragraphContent.push({
          id: currentItem.id,
          unitSegmentSpec: currentItem.unitSegmentSpec,
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