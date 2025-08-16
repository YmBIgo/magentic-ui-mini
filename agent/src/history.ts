import { LLMHandler } from "./llm.js";
import { OperationHandler } from "./operation.js";

export type ExploreHistory = {
    step: string;
    url: string;
    text: string;
}

export class HistoryHandler {
    private purpose: string;
    private exploreHistory: ExploreHistory[];
    private llmHandler: LLMHandler;
    private steps: string[] = [];
    private currentStep: string | null = null;
    private savedMemory: string[];
    constructor(purpose: string) {
        this.purpose = purpose;
        this.exploreHistory = [];
        this.llmHandler = new LLMHandler(this.purpose);
        this.savedMemory = [];
    }
    async init() {
        this.steps = await this.llmHandler.init();
        this.currentStep = this.steps[0];
        console.log(this.steps, this.currentStep);
        await fetch("http://localhost:3001/gotoPage", {
            method: "POST",
            body: JSON.stringify({
                url: "https://bing.com"
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    async doProceed() {
        if (!this.currentStep) return;
        const toolResults = await this.llmHandler.doQuery(this.currentStep, this.getHistory(), this.getMemory());
        toolResults.forEach(async(t) => {
            if (!t?.name) return;
            console.log("do operate : ", t.name, t.arguments);
            const pushMemory = (newMemory: string) => {
                this.savedMemory.push(newMemory);
            }
            const result = await OperationHandler.doOperate(t?.name, JSON.parse(t?.arguments), pushMemory);
            if (result === 1) {
                const stepIndex = this.steps.findIndex((s) => s === this.currentStep);
                if (stepIndex !== -1) this.currentStep = this.steps[stepIndex + 1];
            }
            const currentUrlRequest = await fetch("http://localhost:3001/getUrl", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const currentUrlJson = await currentUrlRequest.json();
            const currentUrl = currentUrlJson.url;
            const cStep = this.currentStep || "not Provided..."
            this.exploreHistory.push({step: cStep, url: currentUrl, text: `${t.name} : ${t.arguments}`});
        });
    }
    getHistory(): string {
        return this.exploreHistory.map((e) => e.url + e.text).join("\n")
    }
    getMemory(): string {
        return this.savedMemory.join("\n");
    }
}