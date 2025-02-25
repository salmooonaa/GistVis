import React, { useState, useReducer } from 'react';
import { Card, Input, Button, List, Typography, Space, ConfigProvider, Row } from 'antd';
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
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const handleTextSubmit = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    try {
      const model = new ChatOpenAI({
        temperature: 0.7,
        topP: 1,
        n: 1,
        streaming: false,
        openAIApiKey: JSON.parse(localStorage.getItem('envVariables') || '{}')?.VITE_LLM_API_KEY || import.meta.env.VITE_LLM_API_KEY || '',
        modelName: JSON.parse(localStorage.getItem('envVariables') || '{}')?.VITE_LLM_MODEL_NAME || import.meta.env.VITE_LLM_MODEL_NAME || '',
        configuration: {
          apiKey: JSON.parse(localStorage.getItem('envVariables') || '{}')?.VITE_LLM_API_KEY || import.meta.env.VITE_LLM_API_KEY || '',
          baseURL: JSON.parse(localStorage.getItem('envVariables') || '{}')?.VITE_LLM_URL_BASE || import.meta.env.VITE_LLM_URL_BASE || '',
        },
        verbose: false,
      });

      const results: paragraphSpec[] = await splitInsight(model, [inputText]);
      if (results.length > 0) {
        setSpecs(results[0].paragraphContent);
      }
    } catch (error) {
      console.error('Error processing text:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSpecUpdate = (index: number, updatedSpec: GistvisSpec) => {
    setSpecs(prevSpecs => {
      const newSpecs = [...prevSpecs];
      newSpecs[index] = updatedSpec;
      return newSpecs;
    });
    console.log('Updated spec:', updatedSpec);
    console.log('Result spec:', specs[index]);
    forceUpdate();
  };

  return (
    <ConfigProvider theme={THEME}>
      <Space direction="vertical" style={{ width: '100%', ...style }}>
        <Card title="Text Input">
          <Space direction="vertical" style={{ width: '100%' }}>
            <TextArea 
              rows={4} 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to analyze..."
            />
            <Row
              style={{gap:'10px'}}
            >
              <Button 
                type="primary" 
                onClick={handleTextSubmit}
                loading={isProcessing}
                disabled={!inputText.trim()}
              >
                Generate Specs
              </Button>
              {import.meta.env.VITE_DINP_PIPELINEEXAMPLE?(
                <Button 
                  type="primary" 
                  onClick={()=>{setInputText(import.meta.env.VITE_DINP_PIPELINEEXAMPLE)}}
                  // loading={isProcessing}
                >
                  Load env input
                </Button>
              ):null}
            </Row>
          </Space>
        </Card>

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
      </Space>
      <ArtcleProcess llmarticle={[{paragraphIdx:0,paragraphContent:specs}]} />
    </ConfigProvider>
  );
};

export default PipelineExplorer;