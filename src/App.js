import {ArticleWithImage, ArticleEditor} from './page/page.js';

import './page/page.css';
import React, { useRef, useState } from 'react';

const useGetarticle = () => {
  // const [article, setArticle] = useState('你好这里是2024年<barchart>全国各地</barchart>的<sparkline>天气良好情况</sparkline>,气温总体呈现<ptrend>上升趋势</ptrend>,但在部分地区仍有<ntrend>下降</ntrend>');
  const [article, setArticle] = useState('<S1>Bloomberg New Energy Finance, for instance, had projected <N4, H, value=1700000>sales of 1.7 million plug-in vehicles</N4> in 2023, but only 1.46 million ultimately sold.</S1> is just <A1, min, value=7.25>$7.25</A1>""At least <V1, value=40>40</V1> cities and counties also are hiking their minimum wages<R1><N1, rank=1>The little boy</N1> was careful enough to come first in the exam.</R1>and accounts for <P1, value=0.28>28%</P1> of the nation\'s greenhouse gas emissions<E1, N>But the <N1>EV market</N1> has nevertheless become a major disappointment.</E1><T1,N><N1, start_d=null, delta=2080000, end_d=1409670000 >China\'s population</N1> decreased by 2.08 million people in 2023 to 1.40967 billion</T1>". Each emotional ')
  return {
    article,
    setArticle
  }
}

function App() {
  const {article, setArticle} = useGetarticle();
  const changeArticle = (inputText) => {
    setArticle(inputText);
  };

  return (
    <div className="App">
      <div class='title'>NEWSVIS</div>
      <ArticleEditor changeArticle={changeArticle}/>
      <ArticleWithImage article={article}/>
    </div>
  );
}

export default App;
