export class OperationHandler {
    static async doOperate(action: string, args: any, savedMemoryFunc:(newMemory: string) => void): Promise<number> {
        /*
        return value indicate meanings below
        0 : continue
        1 : increment step
        2 : quit
        */
        switch (action) {
            case "stop_action":
                return 2;
            case "click":
                const clickText = args.text;
                console.log("clickText with ", clickText);
                if (!clickText) return 0;
                await fetch("http://localhost:3001/tapText", {
                    method: "POST",
                    body: JSON.stringify({ text: clickText }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                return 0;
            case "input_text":
                const inputText = args.text;
                console.log("inputText with ", inputText);
                if (!inputText) return 0;
                await fetch("http://localhost:3001/keyboardType", {
                    method: "POST",
                    body: JSON.stringify({ text: inputText }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                return 0;
            case "scroll_up":
                await fetch("http://localhost:3001/scroll_up", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                return 0;
            case "scroll_down":
                await fetch("http://localhost:3001/scroll_down", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                return 0;
            case "visit_url":
                const visitUrl = args.url;
                console.log("visit_url to ", visitUrl);
                if (!visitUrl) return 0;
                await fetch("http://localhost:3001/gotoPage", {
                    method: "POST",
                    body: JSON.stringify({ url: visitUrl }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                return 0;
            case "web_search":
                const webQuery = args.query;
                console.log("web search with ", webQuery);
                if (!webQuery) return 0;
                await fetch("http://locahost:3001/searchWeb", {
                    method: "POST",
                    body: JSON.stringify({ query: webQuery }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            case "histocy_back":
                await fetch("http://localhost:3001/back", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                return 0;
            case "refresh_page":
                await fetch("http://localhost:3001/refresh", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                return 0;
            case "press_enter":
                await fetch("http://localhost:3001/keyboardEnter", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                return 0;
            case "finish_current_step":
                return 1;
            case "save_memory":
                const memoryText = args.text;
                console.log("Save memory : ", memoryText);
                if (!memoryText) return 0;
                savedMemoryFunc(memoryText);
                return 0;
            default:
                return 0;
        }
    }
}