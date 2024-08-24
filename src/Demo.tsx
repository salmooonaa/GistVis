import {
  ConfigProvider,
  Layout,
  Typography,
  Row,
  Col,
  Divider,
  Progress,
  Flex,
} from "antd";
import THEME from "./style/theme";
import ArtcleProcess from "./components/renderer";
import Editor from "./components/editor";
import { DemoPage } from "./visualizer/demoPage";
import React, { useRef, useState } from "react";
import { paragraphSpec } from "./visualizer/types";
import { processStageAtom } from "./globalState";
import { useAtom } from "jotai";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const PublicityPage = () => {
  const [processStage, setProcessStage] = useAtom(processStageAtom);
  const [llmarticle, setLlmArticle] = useState<paragraphSpec[]>([]);
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
                <DemoPage />
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
                <Flex gap="middle" justify="space-around" wrap="nowrap">
                  <Text style={{ whiteSpace: "nowrap" }}>Progress: </Text>
                  <Progress percent={processStage * 25} />
                </Flex>
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

export default PublicityPage;
