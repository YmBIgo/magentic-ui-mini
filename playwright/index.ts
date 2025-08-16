import {chromium, type BrowserContext, type Locator, type Page} from "playwright";
import express from "express";

const app = express();
app.use(express.json());
const PORT = 3001;
let page: Page | null;
let context: BrowserContext;

async function launchAndRun() {
    const browser = await chromium.connectOverCDP("http://127.0.0.1:9200");
    context = await browser.contexts()[0] ?? await browser.newContext();
    page = await context.newPage();
}

async function sleep(ms: number) {
    await new Promise((resolve) => setTimeout(resolve, ms));
}

launchAndRun();

const failMessage = JSON.stringify({status: "failed"});
const successMessage = JSON.stringify({status: "success"});

app.get("/health", async(req, res) => {
    res.send(successMessage);
})

app.post("/tapWithId", async(req, res) => {
    const id = req.body["id"];
    if (!id || !page) {
        res.send(failMessage);
        return;
    }
    try {
        await page.locator(`#${id}`).click({timeout: 3000});
        await sleep(1000);
    } catch(e) {}
    gotoLastTab();
    await sleep(1000);
    res.send(successMessage);
});

app.post("/tapText", async(req, res) => {
    const text = req.body["text"];
    if (!text || !page) {
        res.send(failMessage);
        return;
    }
    let texts: Locator[];
    try {
        texts = await page.getByText(text, {exact: true}).all();
    } catch(e) {
        texts = [];
    }
    let center_x = 0, center_y = 0;
    if (texts.length === 1) {
        const box = await texts[0]?.boundingBox();
        if (box) {
            center_x = box["x"] + box["width"] / 2
            center_y = box["y"] + box["height"] / 2
        }
    } else {
        for (let eachText of texts) {
            const textInner = await eachText.innerHTML();
            if (textInner !== text) continue;
            else {
                try {
                    const box = await eachText.boundingBox();
                    if (box) {
                        center_x = box["x"] + box["width"] / 2
                        center_y = box["y"] + box["height"] / 2
                    }
                } catch(e) {}
                break;
            }
        }
    }
    await page.mouse.move(center_x, center_y);
    await page.mouse.click(center_x, center_y);
    await sleep(1000);
    gotoLastTab();
    await sleep(1000);
    res.send(successMessage);
})

app.post("/keyboardType", async(req, res) => {
    const text = req.body["text"];
    if (!text || !page) {
        res.send(failMessage);
        return;
    }
    await page.keyboard.type(text);
    await sleep(1000);
    res.send(successMessage);
});

app.post("/keyboardEnter", async(req, res) => {
    if (!page) {
        res.send(failMessage);
        return;
    }
    await page.keyboard.press("Enter");
    await sleep(1000);
    gotoLastTab();
    await sleep(1000);
    res.send(successMessage);
})

app.post("/scrollDown", async(req, res) => {
    if (!page) {
        res.send(failMessage);
        return;
    }
    await page.evaluate("window.scrollBy(0, 500)");
    await sleep(1000);
    res.send(successMessage);
});

app.post("scrollUp", async(req, res) => {
    if (!page) {
        res.send(failMessage);
        return;
    }
    await page.evaluate("window.scrollBy(0, -500)");
    await sleep(1000);
    res.send(successMessage);
});

app.post("/gotoPage", async(req, res) => {
    const url = req.body["url"];
    if (!url || !page) {
        res.send(failMessage);
        return;
    }
    await page.goto(url);
    await sleep(1000);
    res.send(successMessage);
});

app.post("/back", async(req, res) => {
    if (!page) {
        res.send(failMessage);
        return;
    }
    await page.goBack();
    await sleep(1000);
    res.send(successMessage);
});

app.post("/refresh", async(req, res) => {
    if (!page) {
        res.send(failMessage);
        return;
    }
    await page.reload();
    await sleep(1000);
    res.send(successMessage);
})

app.post("/searchWeb", async(req, res) => {
    const query = req.body["query"];
    if (!query || !page) {
        res.send(failMessage);
        return;
    }
    const url = `https://bing.com/?q=${query}`
    await page.goto(url);
    await sleep(1000);
    res.send(successMessage);
});

app.post("/getScreenshot", async(req, res) => {
    if (!page) {
        res.send(failMessage);
        return;
    }
    const screenshot = await page.screenshot();
    const buf = "data:image/png;base64," + screenshot.toString("base64");
    const response = JSON.stringify({
        base64: buf
    });
    res.send(response);
});

app.post("/getUrl", async(req, res) => {
    if (!page) {
        res.send(failMessage);
        return;
    }
    const url = await page.url();
    const response = JSON.stringify({
        url
    });
    res.send(response);
});

app.listen(PORT, () => {
    console.log(`Server runnig at http://localhost:${PORT}...`);
    console.log(`WS proxy at ws://localhost:${PORT}/ws/cdp`);
});

function gotoLastTab() {
    const tabs = context.pages();
    const lastTab = tabs[tabs.length - 1];
    lastTab?.bringToFront();
}