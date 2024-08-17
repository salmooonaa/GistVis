import { ConfigProvider, Layout, Typography, Row, Col, Divider } from "antd";
import THEME from "./style/theme";
import ArtcleProcess from "./components/page";
import Editor from "./components/editor";
import { DesignSpace } from "./visualizer/index"
import "./components/page.css";
import React, { useRef, useState } from "react";
import { paragraphSpec } from "./visualizer/types";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

// const useGetLlmarticle = () => {
//   const [llmarticle, setLlmArticle] = useState([{ text: "" }]);
//   return {
//     llmarticle,
//     setLlmArticle,
//   };
// };

const App = () => {
  // const [userInput, setUserInput] = useState("");
  // const { article, setArticle } = useGetarticle();
  const [llmarticle, setLlmArticle] = useState<paragraphSpec[]>([]);
  // const changeArticle = (inputText) => {
  //   setArticle(inputText);
  // };

  // const changeLlmArticle = (inputText: string) => {
  //   setLlmArticle(inputText);
  // };

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
                  // changeArticle={changeArticle}
                  changeLlmArticle={setLlmArticle}
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
