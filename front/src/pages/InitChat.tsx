import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";

const InitChat = () => {
    const [purpose, setPurpose] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPurpose(e.target.value);
    }
    const submit = async() => {
        if (!purpose) return;
        try {
            setIsLoading(true);
            const response = await fetch("http://localhost:3002/start", {
                method: "POST",
                body: JSON.stringify({purpose}),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            let responseJson = await response.json();
            if (typeof responseJson === "string") {
                responseJson = JSON.parse(responseJson);
            }
            if (responseJson.status === "success") {
                navigate("/main");
            }
        } catch(e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Box sx={{
            width: "100%",
            margin: "20px 0"
        }}>
            <p style={{
                width: "80%",
                margin: "10px 10%"
            }}>Please Input Purpose of this explore.</p>
            <TextField
                sx={{
                    width: "80%",
                    margin: "20px 10%",
                    height: "30px"
                }}
                fullWidth
                onChange={onChangeInput}
            />
            <Button
                color="primary"
                onClick={submit}
                sx={{
                    width: "150px",
                    margin: "20px calc(50% - 75px)"
                }}
                variant="contained"
                disabled={isLoading}
            >
                Send
            </Button>
        </Box>
    )
}

export default InitChat;