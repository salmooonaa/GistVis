import React from 'react';
import { paragraphSpec } from '../modules/visualizer/types';
import { Divider, Layout, Typography } from 'antd';
import ArtcleProcess from '../modules/visualizer/renderer/renderer';

const { Text } = Typography;

export const DemoPage = () => {
  const sampleArticle: paragraphSpec[] = [
    {
      paragraphIdx: 1,
      paragraphContent: [
        {
          id: '1',
          unitSegmentSpec: {
            insightType: 'noType',
            segmentIdx: 1,
            context: 'Electric cars manufactures are competing hard in the global market.',
          },
        },
      ],
    },
    {
      paragraphIdx: 2,
      paragraphContent: [
        {
          id: '2',
          unitSegmentSpec: {
            insightType: 'proportion',
            segmentIdx: 1,
            context:
              'The percentage of the sales of BYD is 30%, while the rest of the top 5 companies only consist of 25%.',
          },
          dataSpec: [
            {
              categoryKey: 'the category of sales',
              categoryValue: 'BYD',
              valueKey: 'the sales percentage',
              valueValue: 0.3,
            },
            {
              categoryKey: 'the category of sales',
              categoryValue: 'the rest of the top 5 companies',
              valueKey: 'the sales percentage',
              valueValue: 0.25,
            },
          ],
        },
        {
          id: '3',
          unitSegmentSpec: {
            insightType: 'trend',
            segmentIdx: 2,
            context: 'The sales of BYD have been steadily increasing over the past 5 years.',
            attribute: 'positive',
          },
          dataSpec: [
            {
              categoryKey: 'the category of sales',
              categoryValue: 'BYD',
              valueKey: 'the sales volumn',
              valueValue: NaN,
            },
          ],
        },
        {
          id: '4',
          unitSegmentSpec: {
            insightType: 'trend',
            segmentIdx: 3,
            context: 'Specifically, the sales of BYD was 10k, 5k, 30k, 80k, and 50k respectively.',
            attribute: 'positive',
          },
          dataSpec: [
            {
              categoryKey: 'the category of sales',
              categoryValue: 'BYD',
              valueKey: 'the sales volumn',
              valueValue: 10000,
            },
            {
              categoryKey: 'the category of sales',
              categoryValue: 'BYD',
              valueKey: 'the sales volumn',
              valueValue: 5000,
            },
            {
              categoryKey: 'the category of sales',
              categoryValue: 'BYD',
              valueKey: 'the sales volumn',
              valueValue: 30000,
            },
            {
              categoryKey: 'the category of sales',
              categoryValue: 'BYD',
              valueKey: 'the sales volumn',
              valueValue: 80000,
            },
            {
              categoryKey: 'the category of sales',
              categoryValue: 'BYD',
              valueKey: 'the sales volumn',
              valueValue: 50000,
            },
          ],
        },
        {
          id: '5',
          unitSegmentSpec: {
            insightType: 'extreme',
            segmentIdx: 4,
            context:
              'The top seller for BYD, Qin series, could do a maximum range of 2000 kilometers, making it the longest ranged plug-in hybrid you can buy on the market.',
            attribute: 'maximum',
            inSituPosition: ['maximum range of 2000 kilometers'],
          },
          dataSpec: [
            {
              categoryKey: 'The category of vehicle range',
              categoryValue: 'Qin series',
              valueKey: 'The vehicle range',
              valueValue: 2000,
            },
          ],
        },
      ],
    },
    {
      paragraphIdx: 3,
      paragraphContent: [
        {
          id: '6',
          unitSegmentSpec: {
            insightType: 'rank',
            segmentIdx: 1,
            context:
              'Conversly, the top 5 seller for traditional NCE vehicles are Toyota, VW, Stellantis, Nissan and Geely.',
          },
          dataSpec: [
            {
              categoryKey: 'seller',
              categoryValue: 'Toyota',
              valueKey: 'rank in top 5 sellers for traditional NCE vehicles',
              valueValue: 1,
            },
            {
              categoryKey: 'seller',
              categoryValue: 'VW',
              valueKey: 'rank in top 5 sellers for traditional NCE vehicles',
              valueValue: 2,
            },
            {
              categoryKey: 'seller',
              categoryValue: 'Stellantis',
              valueKey: 'rank in top 5 sellers for traditional NCE vehicles',
              valueValue: 3,
            },
            {
              categoryKey: 'seller',
              categoryValue: 'Nissan',
              valueKey: 'rank in top 5 sellers for traditional NCE vehicles',
              valueValue: 4,
            },
            {
              categoryKey: 'seller',
              categoryValue: 'Geely',
              valueKey: 'rank in top 5 sellers for traditional NCE vehicles',
              valueValue: 5,
            },
          ],
        },
        {
          id: '7',
          unitSegmentSpec: {
            insightType: 'comparison',
            segmentIdx: 2,
            context: 'The difference in sales between Toyota and VW is 5 million cars per year.',
          },
          dataSpec: [
            {
              categoryKey: 'The category of car sales',
              categoryValue: 'Toyota',
              valueKey: 'The number of cars sold per year',
              valueValue: 5000000,
            },
            {
              categoryKey: 'The category of car sales',
              categoryValue: 'VW',
              valueKey: 'The number of cars sold per year',
              valueValue: 0,
            },
          ],
        },
        {
          id: '8',
          unitSegmentSpec: {
            insightType: 'value',
            segmentIdx: 3,
            context: 'The average price for a Toyota car is 25000 pounds.',
            inSituPosition: ['25000 pounds'],
          },
          dataSpec: [
            {
              categoryKey: 'the category of car prices',
              categoryValue: 'Toyota car',
              valueKey: 'the average price',
              valueValue: 25000,
            },
          ],
        },
      ],
    },
  ];

  return (
    <div>
      <Layout dir="vertical">
        <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>Sample Paragraph</Text>
        <Text style={{ fontSize: '16px', fontStyle: 'italic' }}>Word-scale in situ visualization</Text>
        <Divider style={{ margin: '0 0 0 0' }} />
        <div style={{ width: '50%', margin: '0 auto' }}>
          <ArtcleProcess llmarticle={sampleArticle} />
        </div>
      </Layout>
    </div>
  );
};
