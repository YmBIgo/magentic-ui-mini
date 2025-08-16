import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";

const Main = () => {
    const [steps, setSteps] = useState<string[]>([]);
    const [currentStep, setCurrentStep] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const fetchSteps = async() => {
        try {
            const response = await fetch("http://localhost:3002/getSteps", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            let responseJson = await response.json();
            if (typeof responseJson === "string") {
                responseJson = JSON.parse(responseJson);
            }
            if (!Array.isArray(responseJson.steps) || responseJson.steps.length === 0) return;
            setSteps(responseJson.steps);
            setCurrentStep(responseJson.steps[0]);
        } catch(e) {
            console.error(e);
        }
    }
    const proceed = async() => {
        try {
            setIsLoading(true);
            await fetch("http://localhost:3002/doProceed", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const response = await fetch("http://localhost:3002/getCurrentStep", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            let responseJson = await response.json();
            if (typeof responseJson === "string") {
                responseJson = JSON.parse(responseJson);
            }
            const currentStep2 = responseJson.currentStep;
            setCurrentStep(currentStep2);
        } catch(e) {
            console.error(e)
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchSteps();
    }, []);
    return (
        <Box
            sx={{
                display: "flex",
                gap: "30px",
                flex: 1
            }}
        >
            <Box
                id="left-area"
                sx={{
                    border: "1px solid black",
                    borderRadius: "20px",
                    flex:0.7,
                    padding: "20px"
                }}
            >
                { steps.length
                ? steps.map((step, index) => {
                    return (
                        <p style={{
                            color: step === currentStep ? "red" : "inherit",
                            margin: "5px 20px",
                            textAlign: "left"
                        }}>
                            <small>
                            {index + 1} : {step}
                            </small>
                        </p>
                    )
                })
                : <>まだ手順はできていません...</>
                }
                <hr/>
                <Button
                    onClick={proceed}
                    color="primary"
                    variant="contained"
                    disabled={isLoading}
                >
                    Proceed
                </Button>
            </Box>
            <Box
                id="right-area"
                sx={{
                    flex: 1
                }}
            >
                <iframe
                    src="http://localhost:6080/vnc.html?host=localhost&port=6080&password=headless&autoconnect=1&quality=7&scaling=local&compress=0&resize=scale"
                    style={{
                        width: "90%",
                        margin: "20px 5%",
                        height: "400px"
                    }}
                >
                </iframe>
            </Box>
        </Box>
    )
}

export default Main;