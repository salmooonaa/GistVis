// src/InteractivePage.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
    ComparisonTextRenderer,
    ExtremeTextRenderer,
    PlainTextRenderer,
    ProportionTextRenderer,
    RankTextRenderer,
    ValueTextRenderer,
  } from "../visualizer/renderer/rendererList";
  import TrendTextRenderer from "../visualizer/renderer/trendTextRenderer";

const InteractivePage = () => {
  const { pageId } = useParams();
  const [articleIndex, setArticleIndex] = useState(0);
  const [questions, setQuestions] = useState([
    {
      text: 'Question 1: The passage supports which of the following statementsabout the trees in the La Selva study?',
      text2:"A. During the El Nino year, they added considerably lesswood than they did in coolet vears during the periodof 1984-2000 \nB. During the El Nino year they typically had higher ratesof photosynthesis than they did in other years duringthe period of1984 2000 \n\nC. During the El Nino year, they released considerablymore oxygen than they did in cooler years during theperiod of 1984 2000 \n\nD. During the El Nino year they took up considerablymore CO, than they did in cooler years during theperiod of 1984-2000. \n\n",
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      selected: null
    },
    {
      text: 'Question 2: The author mentions the model developed bv Keeling primarily in order to?',
      text2:"A. provide an example that illustrates a complex scientificprocess\n B.present additional evidence for the existence of aphenomenon\n C.confirm the validity of a widely held assumption\n D.account for seeming inconsistencies in a study",
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      selected: null
    },
    
  ]);
  const [timer, setTimer] = useState(10 * 60);
  const [timeUp, setTimeUp] = useState(false);
  const timerInterval = useRef(null);

  const startTimer = () => {
    if (!timerInterval.current) {
      timerInterval.current = setInterval(() => {
        if (!timeUp && timer > 0) {
          setTimer(prev => prev - 1);
        } else {
          clearInterval(timerInterval.current);
          timerInterval.current = null;
          setTimeUp(true); // 如果时间到，设置timeUp为true
        }
      }, 1000);
    }
  };
  const renderMap = {
    noType: (item) => <PlainTextRenderer gistvisSpec={item} />,
    trend: (item) => <TrendTextRenderer gistvisSpec={item} />,
    rank: (item) => <RankTextRenderer gistvisSpec={item} />,
    proportion: (item) => <ProportionTextRenderer gistvisSpec={item} />,
    comparison: (item) => <ComparisonTextRenderer gistvisSpec={item} />,
    extreme: (item) => <ExtremeTextRenderer gistvisSpec={item} />,
    value: (item) => <ValueTextRenderer gistvisSpec={item} />,
  };
  const article = "Ecologists had assumed that trees in the consistently warm tropics grew at a slow but steady rate, unvarying from year to year. However a study at La Selva, Costa Rica, showed that trees grew less in hotter years and more in cooler ones: between 1984 and 2000, dramatic differences occurred in the six species of trees studied, with trees adding twice as much wood in some cooler years as they did in the scorching El Nino year of 1997-1998. Because tree growth is an index of the balance photosynthesis, in which trees absorb carbon dioxide (CO2)from the atmosphere and release oxygen and respiration, in which the opposite occurs, the Selva data were the first hint that rapidly rising global temperatures, driven by human-generated emissions of CO2, may be pushing tropical forests to release more CO2, thereby intensifying global warming. This raised serious questions about a popular theory that tropical forests act as a sponge, soaking up much of the excess CO2 that humans pump into the atmosphere. The La Selva data are consistent with a model of global CO2 flux developed by Keeling, who concluded that the amount of CO2 taken up in tropical landmasses rose in cooler years and fell in hotter ones, accounting for year-to-year changes in the amount of CO2 that stays in the atmosphere."
  const article2 = [
    {
      "paragraphIdx": 1,
      "paragraphContent": [
        {
          "id": "p0s0",
          "unitSegmentSpec": {
            "insightType": "comparison",
            "segmentIdx": 1,
            "context": "Ecologists had assumed that trees in the consistently warm tropics grew at a slow but steady rate, unvarying from year to year. However a study at La Selva, Costa Rica, showed that trees grew less in hotter years and more in cooler ones: between 1984 and 2000, dramatic differences occurred in the six species of trees studied, with trees adding twice as much wood in some cooler years as they did in the scorching El Nino year of 1997-1998."
          },
          "dataSpec": [
            {
              "categoryKey": "category of tree growth",
              "categoryValue": "tree growth in cooler years",
              "valueKey": "amount of wood added",
              "valueValue": 2
            },
            {
              "categoryKey": "category of tree growth",
              "categoryValue": "tree growth in El Nino year of 1997-1998",
              "valueKey": "amount of wood added",
              "valueValue": 1
            }
          ]
        },
        {
          "id": "p0s1",
          "unitSegmentSpec": {
            "insightType": "trend",
            "segmentIdx": 2,
            "context": "Because tree growth is an index of the balance photosynthesis, in which trees absorb carbon dioxide (CO2)from the atmosphere and release oxygen and respiration, in which the opposite occurs, the Selva data were the first hint that rapidly rising global temperatures, driven by human-generated emissions of CO2, may be pushing tropical forests to release more CO2, thereby intensifying global warming.",
            "attribute": "negative"
          },
          "dataSpec": [
            {
              "categoryKey": "the category of tree growth",
              "categoryValue": "tree growth",
              "valueKey": "the rate of CO2 release by tropical forests",
              "valueValue": NaN
            }
          ]
        },
        {
          "id": "p0s2",
          "unitSegmentSpec": {
            "insightType": "trend",
            "segmentIdx": 3,
            "context": "This raised serious questions about a popular theory that tropical forests act as a sponge, soaking up much of the excess CO2 that humans pump into the atmosphere. The La Selva data are consistent with a model of global CO2 flux developed by Keeling, who concluded that the amount of CO2 taken up in tropical landmasses rose in cooler years and fell in hotter ones, accounting for year-to-year changes in the amount of CO2 that stays in the atmosphere.",
            "attribute": "negative"
          },
          "dataSpec": [
            {
              "categoryKey": "the category of CO2 absorption in tropical forests",
              "categoryValue": "tropical forests",
              "valueKey": "the amount of CO2 taken up in tropical landmasses",
              "valueValue": NaN
            }
          ]
        }
      ]
    }
  ]
  useEffect(() => {
    if (timer === 0) {
      alert('Time is up! You can no longer answer the questions.');
    }
  }, [timer]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, []);

  const handleOptionClick = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].selected = optionIndex;
    setQuestions(newQuestions);
  };

  const nextQuestion = () => {
    if (articleIndex < questions.length - 1) {
      setArticleIndex(index => index + 1);
    }
  };

  const prevQuestion = () => {
    if (articleIndex > 0) {
      setArticleIndex(index => index - 1);
    }
  };

  return (
    <div style={{ display: 'flex', height: '90vh' }}>
      <div style={{ flex: 2, padding: '20px' }}>
        <h2>Article for Page {pageId}</h2>
        <p>{
            article2.map((para) => {
      if(para.paragraphIdx) {
        return (
          <p key={para.paragraphIdx}>
            {para.paragraphContent.map((item) => {
              const renderFunction =
                renderMap[item.unitSegmentSpec.insightType.trim()];
              return renderFunction ? renderFunction(item) : null;
            })}
          </p>
        );
      } else { 
        return null; 
      }
    })
    }</p>
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        <div>
          <h3>{questions[articleIndex].text}</h3>
          {questions[articleIndex].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(articleIndex, index)}
              disabled={timeUp || index === questions[articleIndex].selected}
              style={{ margin: '5px' }}
            >
              {option}
            </button>
          ))}
          <div>{questions[articleIndex].text2}</div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <button onClick={prevQuestion} disabled={articleIndex === 0 || timeUp}>
            Previous
          </button>
          <button onClick={nextQuestion} disabled={articleIndex === questions.length - 1 || timeUp}>
            Next
          </button>
        </div>
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        <h3>Timer: {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' + (timer % 60) : timer % 60}</h3>
      </div>
    </div>
  );
};

export default InteractivePage;