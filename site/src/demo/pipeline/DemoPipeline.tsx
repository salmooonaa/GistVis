import React from 'react';
import { Typography, Card, ConfigProvider, Space, Layout, Divider } from 'antd';
import THEME from '../../style/theme';
import PipelineExplorer from './PipelineExplorer';

const { Title, Paragraph, Text } = Typography;
const DemoPipeline: React.FC = () => {
  return (
    <ConfigProvider theme={THEME}>
      <Layout dir="vertical">
        <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>Pipeline Explorer</Text>
        <Text style={{ fontSize: '16px', fontStyle: 'italic' }}>
          Enter text to analyze and generate visualization specifications through the pipeline:
        </Text>
        <Divider style={{ margin: '0 0 0 0' }} />
      </Layout>
      <Space direction="vertical" style={{ width: '100%', padding: '24px' }}>
        <Card>
          <Paragraph>
            <Layout dir="vertical" style={{ gap: '10px', justifyContent: 'center' }}>
              <li><Text italic>Discoverer</Text> <br /> <Text italic type='secondary'>Splits text into segments and generates initial specs</Text></li>
              <li><Text italic>Annotator</Text> <br /> <Text italic type='secondary'>Analyzes and labels insight types</Text></li>
              <li><Text italic>Extractor</Text> <br /> <Text italic type='secondary'>Extracts structured data from text</Text></li>
              <li><Text italic>Visualizer</Text> <br /> <Text italic type='secondary'>Displays the final visualization</Text></li>
            </Layout>
          </Paragraph>
        </Card>
        <PipelineExplorer />
      </Space>
    </ConfigProvider>
  );
};

export default DemoPipeline;