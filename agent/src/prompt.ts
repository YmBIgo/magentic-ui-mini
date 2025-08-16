import type { Tool } from "openai/resources/responses/responses.js";

export const tools: Tool[] = [
    {
        type: "function",
        name: "stop_action",
        description: "Perform no action and provide an answer with a summary of past actions and observations",
        parameters: {},
        strict: false,
    },
    {
        type: "function",
        name: "click",
        description: "Click on a target element using its text",
        parameters: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "the text of element you want to click"
                }
            },
            required: ["text"],
            additionalProperties: false,
        },
        strict: true,
    },
    {
        type: "function",
        name: "input_text",
        description: "Type text into an input field",
        parameters: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "the text you want to type"
                }
            },
            required: ["text"],
            additionalProperties: false,
        },
        strict: true,
    },
    {
        type: "function",
        name: "scroll_up",
        description: "Scroll the viewport up for 500px",
        parameters: {},
        strict: false
    },
    {
        type: "function",
        name: "scroll_down",
        description: "Scroll the viewport down for 500px",
        parameters: {},
        strict: false
    },
    {
        type: "function",
        name: "visit_url",
        description: "Navigate directly to a provided URL",
        parameters: {
            type: "object",
            properties: {
                url: {
                    type: "string",
                    description: "The url you want to visit"
                }
            },
            required: ["url"],
            additionalProperties: false,
        },
        strict: true,
    },
    {
        type: "function",
        name: "web_search",
        description: "Perform a web search query on Bing.com",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "The query you want to search"
                }
            },
            required: ["query"],
            additionalProperties: false,
        },
        strict: true,
    },
    {
        type: "function",
        name: "history_back",
        description: "Go back one page in browser history",
        parameters: {},
        strict: false
    },
    {
        type: "function",
        name: "refresh_page",
        description: "Refresh the current page",
        parameters: {},
        strict: false
    },
    {
        type: "function",
        name: "press_enter",
        description: "Type Enter Key",
        parameters: {},
        strict: false
    },
    {
        type: "function",
        name: "finish_current_step",
        description: "Inform user of the completion of current step",
        parameters: {
            type: "object",
            properties: {
                stepIndex: {
                    type: "number",
                    description: "tell us index of finished step"
                }
            },
           required: ["stepIndex"],
           additionalProperties: false,
        },
        strict: true,
    },
    {
        type: "function",
        name: "save_memory",
        description: "Save memory of the current explore for comparison etc... These memories are refered next time of explore.",
        parameters: {
            type: "object",
            properties: {
                text: {
                    type: "string",
                    description: "tell us memory you want to save"
                }
            },
            required: ["text"],
            additionalProperties: false,
        },
        strict: true
    },
    // {
    //     type: "function",
    //     name: "",
    //     description: "",
    //     parameters: {
    //         type: "object",
    //         properties: {
    //             test: {
    //                 type: "string",
    //                 description: ""
    //             }
    //         }
    //     },
    //     required: [""]
    // },
];

export const stepScript = `
You are a helpful assistant that controls a web browser. 

User will give you the purpose of the search, and you should return abstract thoughts 4 steps to accomplish user's request using web surfing (ONLY web surfing) formatted by json.

[Example]

{
    "steps": [
        "Open a web browser and go to a search engine like Bing Maps.",
        "Type in specific keywords such as 'best hamburger shop Kyoto' or '美味しい ハンバーガー 京都' to get local results.",
        "Browse through the search results and map listings, focusing on high-rated places with positive reviews and appealing photos.",
        "Click on promising listings to read detailed reviews, check menus, and note their location for comparison."
    ]
}

`

export const mainScript = `
You are a helpful assistant that controls a web browser. You are to utilize this web browser to answer requests.

You will be given a screenshot of the current page and purpose of this search and steps of this search and current step and history and memory.
And considering these things, please choose the tool user provides to guide user to perform tool. 
`