import React, {useState} from 'react'
import { ConfigProvider, Layout, Typography, Button, Flex, Divider,Tooltip, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import THEME from "@src/style/theme";

const { Header, Content } = Layout;
const { Text } = Typography;

type PipelineBlockProps = {
    run: () => any;
    
    blockTitle?: string;
    inputPlaceholder?: string;

    // input and output
    inputText: string;
    setInputText: (text: string) => void;
    outputText: string;
    setOutputText: (text: string) => void;

    // last stage
    lastStageOutput?: string;

    // env input
    envInputText?: string;
}

const startButtonColor = "rgb(8, 123, 0)";

const PipelineBlock: React.FC<PipelineBlockProps> = ({ 
    blockTitle, 
    run, 
    inputPlaceholder,
    inputText,
    setInputText,
    outputText,
    setOutputText,
    lastStageOutput,
    envInputText
 }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    return (
        <ConfigProvider theme={THEME}>
        <Layout 
            dir="verticle"
            style={{ padding: "2%", margin: "0 auto", gap: "1%" }}
        >
            <Flex style={{gap: "10px"}} justify="space-between">
                <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {blockTitle? blockTitle : "Pipeline Block"}
                </Text>
                <Text style={{ fontSize: "16px"}}>
                    {isProcessing ? "(processing...)" : ""}
                </Text>
                <div></div>
            </Flex>
            <TextArea
                placeholder={inputPlaceholder}
                autoSize={{ minRows: 3, maxRows: 5 }}
                style={{ width: "100%", marginBottom: "1%" }}
                value={inputText}
            />
            <Flex justify="space-between">
                <Button 
                    type="primary" 
                    onClick={async () => {
                        setIsProcessing(true);
                        try {
                            const result = await run();
                            setOutputText(JSON.stringify(result, null, 2));
                        } catch (error) {
                            setOutputText("Failed to run the pipeline block: " + error);
                        }
                        setIsProcessing(false);
                    }}
                    style={{ backgroundColor: startButtonColor }}
                >
                    Run
                </Button>
                <Flex style={{gap: "10px"}}>
                    {envInputText && (<Tooltip title="Use the input from the environment">
                        <Button onClick={
                            () => {
                                try {
                                    setInputText(envInputText || "");
                                } catch (error) {
                                    console.error("Failed to set input from env: ", error);
                                }
                            }
                        }>
                            From Env
                        </Button>
                    </Tooltip>)}
                    {!(lastStageOutput===undefined) && (<Tooltip title="Use the output from the last stage">
                        <Button onClick={
                            () => {
                                try {
                                    setInputText(lastStageOutput);
                                } catch (error) {
                                    console.error("Failed to set input from last stage: ", error);
                                }
                            }
                        }>
                            From Last
                        </Button>
                    </Tooltip>)}    
                </Flex>
            </Flex>
            <Divider style={{ margin: "10px 0 5px 0" }} />
            <Text style={{ fontSize: "20px", fontStyle: "bold" }}>
                Output {outputText? "" : "(none)"}
            </Text>
            <Text style={{ fontSize: "16px", fontStyle: "italic", whiteSpace: "pre-wrap" }}>
                {(outputText||outputText=='')? outputText : "Output"}
            </Text>
            <Divider style={{ margin: "15px 0 10px 0" }} />
        </Layout>
        </ConfigProvider>
    )
}

export default PipelineBlock;