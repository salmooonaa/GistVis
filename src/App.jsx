import { ConfigProvider, Layout, Typography, Row, Col, Divider } from "antd";
import THEME from "./style/theme";
import { ArtcleProcess } from "./components/page.jsx";
import { Editor } from "./components/index.jsx";
import { DesignSpace } from "./visualizer/index.tsx"
import "./components/page.css";
import React, { useRef, useState } from "react";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const useGetarticle = () => {
  const [article, setArticle] = useState(
    '<S1>Bloomberg New Energy Finance, for instance, had projected <N4, H, value=1700000>sales of 1.7 million plug-in vehicles</N4> in 2023, but only 1.46 million ultimately sold.</S1> is just <A1, min, value=7.25>$7.25</A1>""At least <V1, value=40>40</V1> cities and counties also are hiking their minimum wages<R1><N1, rank=1>The little boy</N1> was careful enough to come first in the exam.</R1>and accounts for <P1, value=0.28>28%</P1> of the nation\'s greenhouse gas emissions<E1, N>But the <N1>EV market</N1> has nevertheless become a major disappointment.</E1><T1,N><N1, start_d=null, delta=2080000, end_d=1409670000 >China\'s population</N1> decreased by 2.08 million people in 2023 to 1.40967 billion</T1>". Each emotional '
  );
  return {
    article,
    setArticle,
  };
};

const useGetLlmarticle = () => {
  const [llmarticle, setLlmArticle] = useState([{ text: "" }]);
  return {
    llmarticle,
    setLlmArticle,
  };
};

const App = () => {
  // const [userInput, setUserInput] = useState("");
  const { article, setArticle } = useGetarticle();
  const { llmarticle, setLlmArticle } = useGetLlmarticle();
  const changeArticle = (inputText) => {
    setArticle(inputText);
  };

  const changeLlmArticle = (inputText) => {
    setLlmArticle(inputText);
  };

  return (
    <div className="App">
      <ConfigProvider theme={THEME}>
        <Header>
          <Text style={{ fontSize: "24px", padding: "2%", fontWeight: "bold" }}>
            GistVis
          </Text>
        </Header>
        <Content style={{ padding: "2%", margin: "0 auto" }}>
          <Layout dir="vertical">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
                  Design Space
                </Text>
                <DesignSpace />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
                  Input Article
                </Text>
                <Divider style={{ margin: "0 0 2% 0" }} />
                <Editor
                  changeArticle={changeArticle}
                  changeLlmArticle={changeLlmArticle}
                />
              </Col>
              <Col span={12}>
                <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
                  Rendered Result
                </Text>
                <Divider style={{ margin: "0 0 2% 0" }} />
                {/* <ArticleWithImage article={article} /> */}
                <ArtcleProcess llmarticle={llmarticle} />
              </Col>
            </Row>
          </Layout>
        </Content>
      </ConfigProvider>
    </div>
  );
};

export default App;
