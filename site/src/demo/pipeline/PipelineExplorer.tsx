import React, { useState, useReducer, useRef } from 'react';
import { Card, Input, Button, List, Flex, Space, ConfigProvider, Row } from 'antd';
import { ChatOpenAI } from '@langchain/openai';
import THEME from '../../style/theme';
import SpecProcessEditor from './SpecProcessEditor';
import splitInsight from '../../modules/llm/discoverer/discoverer';
import { GistvisSpec, paragraphSpec } from '../../modules/visualizer/types';
import ArtcleProcess from '../../modules/visualizer/renderer/renderer';

const { TextArea } = Input;

interface PipelineExplorerProps {
  style?: React.CSSProperties;
}

const PipelineExplorer: React.FC<PipelineExplorerProps> = ({ style }) => {
  const [inputText, setInputText] = useState('');
  const [specs, setSpecs] = useState<GistvisSpec[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const taskIdRef = useRef<number>(0);

  const handleCancel = () => {
    taskIdRef.current += 1;
    setIsProcessing(false);
  };

  const handleClear = () => {
    setSpecs([]);
  };

  const showEditor = () => {
    return isProcessing || specs.length > 0;
  };

  const showVisualization = () => {
    return isProcessing || specs.length > 0;
  };

  const handleTextSubmit = async () => {
    if (!inputText.trim()) return;
    const taskId = taskIdRef.current;
    setIsProcessing(true);
    try {
      const model = new ChatOpenAI({
        temperature: 0.7,
        topP: 1,
        n: 1,
        streaming: false,
        openAIApiKey:
          JSON.parse(localStorage.getItem('envVariables') || '{}')?.VITE_LLM_API_KEY ||
          import.meta.env.VITE_LLM_API_KEY ||
          '',
        modelName:
          JSON.parse(localStorage.getItem('envVariables') || '{}')?.VITE_LLM_MODEL_NAME ||
          import.meta.env.VITE_LLM_MODEL_NAME ||
          '',
        configuration: {
          apiKey:
            JSON.parse(localStorage.getItem('envVariables') || '{}')?.VITE_LLM_API_KEY ||
            import.meta.env.VITE_LLM_API_KEY ||
            '',
          baseURL:
            JSON.parse(localStorage.getItem('envVariables') || '{}')?.VITE_LLM_URL_BASE ||
            import.meta.env.VITE_LLM_URL_BASE ||
            '',
        },
        verbose: false,
      });

      const results: paragraphSpec[] = await splitInsight(model, [inputText]);
      if (taskId === taskIdRef.current && results.length > 0) {
        setSpecs(results[0].paragraphContent);
      }
    } catch (error) {
      console.error('Error processing text:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSpecUpdate = (index: number, updatedSpec: GistvisSpec) => {
    setSpecs((prevSpecs) => {
      const newSpecs = [...prevSpecs];
      newSpecs[index] = updatedSpec;
      return newSpecs;
    });
    forceUpdate();
  };

  return (
    <ConfigProvider theme={THEME}>
      <Space direction="vertical" style={{ width: '100%', ...style }}>
        <Card title="Text Input">
          <Flex style={{ width: '100%', gap: '10px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <TextArea
                rows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to analyze..."
              />
              <Row style={{ gap: '10px' }} justify="space-between">
                <Flex style={{ gap: '10px' }}>
                  <Button type="default" onClick={handleTextSubmit} loading={isProcessing} disabled={!inputText.trim()}>
                    Launch Pipeline
                  </Button>
                  <Button
                    type="default"
                    onClick={isProcessing ? handleCancel : handleClear}
                    disabled={isProcessing ? false : specs.length == 0}
                  >
                    {isProcessing ? 'Cancel' : 'Clear'}
                  </Button>
                </Flex>
                {import.meta.env.VITE_DINP_PIPELINEEXAMPLE ? (
                  <Button
                    type="default"
                    onClick={() => {
                      setInputText(import.meta.env.VITE_DINP_PIPELINEEXAMPLE);
                    }}
                    // loading={isProcessing}
                  >
                    Load env input
                  </Button>
                ) : null}
              </Row>
            </Space>
          </Flex>
        </Card>
        {showVisualization() ? (
          <Card title="Visualization" loading={isProcessing}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <ArtcleProcess llmarticle={[{ paragraphIdx: 0, paragraphContent: specs }]} />
            </Space>
          </Card>
        ) : null}
        {showEditor() ? (
          <Card title="Specs Editor" loading={isProcessing}>
            <List
              dataSource={specs}
              renderItem={(spec, index) => (
                <List.Item>
                  <SpecProcessEditor
                    spec={spec}
                    onSave={(updatedSpec) => handleSpecUpdate(index, updatedSpec)}
                    style={{ width: '100%' }}
                    example={false}
                  />
                </List.Item>
              )}
            />
          </Card>
        ) : null}
      </Space>
    </ConfigProvider>
  );
};

export default PipelineExplorer;
