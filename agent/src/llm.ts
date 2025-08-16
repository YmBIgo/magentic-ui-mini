import OpenAI from "openai";
import { mainScript, stepScript, tools } from "./prompt.js";

const OPENAI_API_KEY = process.env["OPENAI_API_KEY"];

export class LLMHandler {   
    private openai: OpenAI = new OpenAI({apiKey: OPENAI_API_KEY});
    private purpose: string;
    private steps: string[] = [];
    constructor(purpose: string) {
        this.purpose = purpose;
    }
    async init(retry: number = 3): Promise<string[]> {
        console.log("start generation step by openai : retry " + retry)
        const steps = await this.openai.responses.create({
            model: "gpt-5",
            input: [{role: "system", content: stepScript}, { role: "user", content:`purpose : ${this.purpose}`}]
        });
        const choices = steps.output_text
        if (!choices.length) {
            if (retry === 0) throw new Error("OpenAI API Error");
            return this.init(retry - 1);
        }
        const step = choices
        console.log("openai result : ", step)
        try {
            const jsonStep = JSON.parse(step).steps;
            this.steps = jsonStep;
        } catch {
            if (retry === 0) throw new Error("OpenAI API Error");
            return this.init(retry - 1);
        }
        return this.steps;
    }
    async doQuery(currentStep: string, history: string, memory: string) {
        let base64: string = "";
        try {
            const base64ImageRequest = await fetch("http://localhost:3001/getScreenshot", {
                method: "POST",
            })
            const base64Json = await base64ImageRequest.json();
            base64 = base64Json.base64;
        } catch (e) {
            console.log("error occurs when getting image");
            return [];
        }
        const userContent = `
[purpose]
${this.purpose}

[steps]
${this.steps.join("\n")}

[current-step]
${currentStep}

[history]
${history}

[saved memory]
${memory}
`
        const response = await this.openai.responses.create({
            model: "gpt-5",
            input: [
                {role: "system", content: mainScript},
                {role: "user", content: [
                    {type: "input_image", image_url: base64, detail: "high"},
                    {type: "input_text", text: userContent}
                ]}
            ],
            tools
        });
        const toolResults = response.output.map((o) => {
            if (o.type === "function_call") {
                return {
                    name: o.name,
                    arguments: o.arguments
                }
            } else {
                return null
            }
        }).filter(Boolean);
        return toolResults;
    }
}