import { paragraphSpec } from '../../../modules/visualizer/types';

const article3: paragraphSpec[] = [
  {
    paragraphIdx: 0,
    paragraphContent: [
      {
        id: 'p0s0',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 0,
          context:
            'The typical age gap between husbands and wives in the United States has narrowed over the past 20 years, continuing a 20th-century trend.',
          inSituPosition: [],
          attribute: 'negative',
        },
        dataSpec: [
          {
            categoryKey: 'category of age gap',
            categoryValue: 'age gap between husbands and wives',
            valueKey: 'age gap value',
            valueValue: NaN,
          },
        ],
      },
      {
        id: 'p0s1',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 1,
          context:
            'On average, husbands and wives were 2.2 years apart in age in 2022, according to a new Pew Research Center analysis of U.S. Census Bureau data. This is down from 2.4 years in 2000 and 4.9 years in 1880.',
          inSituPosition: [],
        },
        dataSpec: [
          {
            categoryKey: 'Age difference between husbands and wives',
            categoryValue: '2022',
            valueKey: 'Age difference in years',
            valueValue: 2.2,
          },
          {
            categoryKey: 'Age difference between husbands and wives',
            categoryValue: '2000',
            valueKey: 'Age difference in years',
            valueValue: 2.4,
          },
          {
            categoryKey: 'Age difference between husbands and wives',
            categoryValue: '1880',
            valueKey: 'Age difference in years',
            valueValue: 4.9,
          },
        ],
      },
    ],
  },
  {
    paragraphIdx: 1,
    paragraphContent: [
      {
        id: 'p1s0',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 0,
          context:
            'A line chart showing that the age gap between U.S. husbands and wives has kept dropping in 21st century.',
          inSituPosition: [],
          attribute: 'negative',
        },
        dataSpec: [
          {
            categoryKey: 'category of age gap',
            categoryValue: 'age gap between U.S. husbands and wives',
            valueKey: 'age gap value',
            valueValue: NaN,
          },
        ],
      },
    ],
  },
  {
    paragraphIdx: 2,
    paragraphContent: [
      {
        id: 'p2s0',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 0,
          context:
            'Since 1880, the share of marriages in which the husband is several years older than the wife has fallen significantly.',
          inSituPosition: [],
          attribute: 'negative',
        },
        dataSpec: [
          {
            categoryKey: 'category of marriages',
            categoryValue: 'marriages in which the husband is several years older than the wife',
            valueKey: 'share of marriages',
            valueValue: NaN,
          },
        ],
      },
      {
        id: 'p2s1',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 1,
          context:
            'And since 2000, marriages where the wife is significantly older than the husband have also become more rare. (This analysis is limited to opposite-sex marriages in which the spouses live together.)',
          inSituPosition: [],
          attribute: 'negative',
        },
        dataSpec: [
          {
            categoryKey: 'category of marriages',
            categoryValue: 'marriages where the wife is significantly older than the husband',
            valueKey: 'frequency of occurrence',
            valueValue: NaN,
          },
        ],
      },
    ],
  },
  {
    paragraphIdx: 3,
    paragraphContent: [
      {
        id: 'p3s0',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 0,
          context:
            'A stacked bar chart showing that about half of opposite-sex marriages in 2022 were between spouses who were roughly the same age.',
          inSituPosition: [],
        },
        dataSpec: [
          {
            categoryKey: 'category of marriages',
            categoryValue: 'opposite-sex marriages in 2022',
            valueKey: 'proportion of marriages',
            valueValue: 0.5,
          },
        ],
      },
    ],
  },
  {
    paragraphIdx: 4,
    paragraphContent: [
      {
        id: 'p4s0',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 0,
          context: 'Overall, in 2022:',
        },
      },
    ],
  },
  {
    paragraphIdx: 5,
    paragraphContent: [
      {
        id: 'p5s0',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 0,
          context:
            '51% of opposite-sex marriages had spouses who were two years apart in age or less. This is up from 46% in 2000.',
          inSituPosition: [],
          attribute: 'positive',
        },
        dataSpec: [
          {
            categoryKey: 'category of opposite-sex marriages',
            categoryValue: 'spouses age difference',
            valueKey: 'percentage of marriages',
            valueValue: 51,
          },
          {
            categoryKey: 'category of opposite-sex marriages',
            categoryValue: 'spouses age difference',
            valueKey: 'percentage of marriages',
            valueValue: 46,
          },
        ],
      },
    ],
  },
  {
    paragraphIdx: 6,
    paragraphContent: [
      {
        id: 'p6s0',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 0,
          context:
            '40% of marriages had a husband who was three or more years older than his wife. This is down from 43% in 2000.',
          inSituPosition: [],
          attribute: 'negative',
        },
        dataSpec: [
          {
            categoryKey: 'category of marriages',
            categoryValue: 'marriages with husband 3+ years older',
            valueKey: 'percentage of marriages',
            valueValue: 40,
          },
          {
            categoryKey: 'category of marriages',
            categoryValue: 'marriages with husband 3+ years older',
            valueKey: 'percentage of marriages',
            valueValue: 43,
          },
        ],
      },
    ],
  },
  {
    paragraphIdx: 7,
    paragraphContent: [
      {
        id: 'p7s0',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 0,
          context:
            '10% of marriages had a wife who was three or more years older than her husband. This share had been on the rise during the 20th century but is now down marginally from a peak of 11% in 2000.',
          inSituPosition: [],
          attribute: 'negative',
        },
        dataSpec: [
          {
            categoryKey: 'category of marriages',
            categoryValue: 'marriages with a wife three or more years older',
            valueKey: 'share of marriages',
            valueValue: 10,
          },
          {
            categoryKey: 'category of marriages',
            categoryValue: 'marriages with a wife three or more years older',
            valueKey: 'peak share of marriages',
            valueValue: 11,
          },
        ],
      },
    ],
  },
  {
    paragraphIdx: 8,
    paragraphContent: [
      {
        id: 'p8s0',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 0,
          context:
            'Not all family historians agree on how to define a “same-age” marriage. But whether we consider spouses of the same age to be those within two years of each other or four years, the historical trend is similar.',
          inSituPosition: [],
          attribute: undefined,
        },
        dataSpec: [
          {
            categoryKey: 'category of same-age marriage',
            categoryValue: 'spouses within two years',
            valueKey: 'historical trend',
            valueValue: 100,
          },
          {
            categoryKey: 'category of same-age marriage',
            categoryValue: 'spouses within four years',
            valueKey: 'historical trend',
            valueValue: 100,
          },
        ],
      },
    ],
  },
  {
    paragraphIdx: 9,
    paragraphContent: [
      {
        id: 'p9s0',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 0,
          context: 'Who is most likely to be in a same-age marriage?',
        },
      },
    ],
  },
  {
    paragraphIdx: 10,
    paragraphContent: [
      {
        id: 'p10s0',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 0,
          context: 'Some people are more likely than others to be in a same-age marriage:',
        },
      },
    ],
  },
  {
    paragraphIdx: 11,
    paragraphContent: [
      {
        id: 'p11s0',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 0,
          context:
            'More than half of husbands who have at least a bachelor’s degree (55%) are in a same-age marriage, compared with 48% of husbands with some college education or less.',
          inSituPosition: [],
        },
        dataSpec: [
          {
            categoryKey: 'category of husbands with education level',
            categoryValue: 'husbands with at least a bachelor’s degree',
            valueKey: 'percentage in same-age marriage',
            valueValue: 55,
          },
          {
            categoryKey: 'category of husbands with education level',
            categoryValue: 'husbands with some college education or less',
            valueKey: 'percentage in same-age marriage',
            valueValue: 48,
          },
        ],
      },
    ],
  },
  {
    paragraphIdx: 12,
    paragraphContent: [
      {
        id: 'p12s0',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 0,
          context:
            'Husbands in their first marriage are much more likely than husbands who have been married more than once to be roughly the same age as their wife (56% vs. 32%).',
          inSituPosition: [],
        },
        dataSpec: [
          {
            categoryKey: 'category of marriage status',
            categoryValue: 'first marriage',
            valueKey: 'percentage of husbands same age as wife',
            valueValue: 56,
          },
          {
            categoryKey: 'category of marriage status',
            categoryValue: 'more than once married',
            valueKey: 'percentage of husbands same age as wife',
            valueValue: 32,
          },
        ],
      },
      {
        id: 'p12s1',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 1,
          context:
            'And only 35% of husbands in their first marriage have a wife three or more years younger than them, compared with 56% of remarried husbands.',
          inSituPosition: [],
        },
        dataSpec: [
          {
            categoryKey: 'type of marriage',
            categoryValue: 'first marriage',
            valueKey: 'percentage of husbands with a wife three or more years younger',
            valueValue: 35,
          },
          {
            categoryKey: 'type of marriage',
            categoryValue: 'remarried',
            valueKey: 'percentage of husbands with a wife three or more years younger',
            valueValue: 56,
          },
        ],
      },
    ],
  },
  {
    paragraphIdx: 13,
    paragraphContent: [
      {
        id: 'p13s0',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 0,
          context:
            'White husbands (53%) are more likely than Hispanic (46%), Black (45%) and Asian husbands (45%) to be in a same-age marriage.',
          inSituPosition: [],
        },
        dataSpec: [
          {
            categoryKey: "Husband's Ethnicity",
            categoryValue: 'White',
            valueKey: 'Likelihood of Same-Age Marriage',
            valueValue: 53,
          },
          {
            categoryKey: "Husband's Ethnicity",
            categoryValue: 'Hispanic',
            valueKey: 'Likelihood of Same-Age Marriage',
            valueValue: 46,
          },
          {
            categoryKey: "Husband's Ethnicity",
            categoryValue: 'Black',
            valueKey: 'Likelihood of Same-Age Marriage',
            valueValue: 45,
          },
          {
            categoryKey: "Husband's Ethnicity",
            categoryValue: 'Asian',
            valueKey: 'Likelihood of Same-Age Marriage',
            valueValue: 45,
          },
        ],
      },
      {
        id: 'p13s1',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 1,
          context:
            'And about half of Asian husbands (49%) have a wife who is three or more years younger. The shares are lower among Hispanic (42%), Black (43%) and White husbands (38%).',
          inSituPosition: [],
        },
        dataSpec: [
          {
            categoryKey: 'Race',
            categoryValue: 'Asian',
            valueKey: 'Percentage of husbands with a wife three or more years younger',
            valueValue: 49,
          },
          {
            categoryKey: 'Race',
            categoryValue: 'Hispanic',
            valueKey: 'Percentage of husbands with a wife three or more years younger',
            valueValue: 42,
          },
          {
            categoryKey: 'Race',
            categoryValue: 'Black',
            valueKey: 'Percentage of husbands with a wife three or more years younger',
            valueValue: 43,
          },
          {
            categoryKey: 'Race',
            categoryValue: 'White',
            valueKey: 'Percentage of husbands with a wife three or more years younger',
            valueValue: 38,
          },
        ],
      },
    ],
  },
  {
    paragraphIdx: 14,
    paragraphContent: [
      {
        id: 'p14s0',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 0,
          context:
            'The marriage patterns are similar when looking at the wife’s characteristics rather than the husband’s.',
          inSituPosition: [],
        },
        dataSpec: [
          {
            categoryKey: 'category of marriage patterns',
            categoryValue: "wife's characteristics",
            valueKey: 'similarity in marriage patterns',
            valueValue: 0,
          },
          {
            categoryKey: 'category of marriage patterns',
            categoryValue: "husband's characteristics",
            valueKey: 'similarity in marriage patterns',
            valueValue: 0,
          },
        ],
      },
    ],
  },
  {
    paragraphIdx: 15,
    paragraphContent: [
      {
        id: 'p15s0',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 0,
          context: 'Why do age gaps in marriage matter?',
        },
      },
    ],
  },
  {
    paragraphIdx: 16,
    paragraphContent: [
      {
        id: 'p16s0',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 0,
          context:
            'A bar chart showing that husbands in first marriages are more likely than those who’ve been married more than once to be of similar age to their wife.',
          inSituPosition: [],
        },
        dataSpec: [
          {
            categoryKey: 'marital status',
            categoryValue: 'first marriage',
            valueKey: 'likelihood of similar age',
            valueValue: 0,
          },
          {
            categoryKey: 'marital status',
            categoryValue: 'married more than once',
            valueKey: 'likelihood of similar age',
            valueValue: 30,
          },
        ],
      },
    ],
  },
  {
    paragraphIdx: 17,
    paragraphContent: [
      {
        id: 'p17s0',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 0,
          context:
            'Large age differences between husbands and wives can have important consequences for the well-being of one of the spouses.',
          inSituPosition: [],
        },
        dataSpec: [
          {
            categoryKey: 'category of age difference',
            categoryValue: 'husbands and wives',
            valueKey: 'age difference value',
            valueValue: 0,
          },
          {
            categoryKey: 'category of age difference',
            categoryValue: 'husbands and wives',
            valueKey: 'age difference value',
            valueValue: 30,
          },
        ],
      },
      {
        id: 'p17s1',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 1,
          context:
            'For example, someone is more likely to end up widowed if their spouse is significantly older than them.',
          inSituPosition: [],
        },
        dataSpec: [
          {
            categoryKey: 'marital status',
            categoryValue: 'widowed',
            valueKey: 'likelihood',
            valueValue: NaN,
          },
        ],
      },
    ],
  },
  {
    paragraphIdx: 18,
    paragraphContent: [
      {
        id: 'p18s0',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 0,
          context:
            'As the share of marriages where the husband is older than his wife has fallen, there’s also been a decline in widowhood among older women.',
          inSituPosition: [],
          attribute: 'negative',
        },
        dataSpec: [
          {
            categoryKey: 'category of marriages',
            categoryValue: 'marriages where the husband is older than his wife',
            valueKey: 'share of marriages',
            valueValue: NaN,
          },
          {
            categoryKey: 'category of widowhood',
            categoryValue: 'widowhood among older women',
            valueKey: 'rate of widowhood',
            valueValue: NaN,
          },
        ],
      },
      {
        id: 'p18s1',
        unitSegmentSpec: {
          insightType: 'noType',
          segmentIdx: 1,
          context: 'Today, 30% of women ages 65 and older are widows, down from 45% in 2000.',
          inSituPosition: [],
          attribute: 'positive',
        },
        dataSpec: [
          {
            categoryKey: 'category of widows',
            categoryValue: 'women ages 65 and older',
            valueKey: 'percentage of widows',
            valueValue: 30,
          },
          {
            categoryKey: 'category of widows',
            categoryValue: 'women ages 65 and older',
            valueKey: 'percentage of widows',
            valueValue: 45,
          },
        ],
      },
    ],
  },
];

export default article3;
