import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HistoryHandler } from './history.js'

const app = new Hono()

app.use('/*', cors({
  origin: "http://localhost:5173",
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  allowHeaders: ["Content-Disposition", "Content-Type"],
  maxAge: 600,
  credentials: true,
}))

const successMessage = JSON.stringify({status: "success"})
const failMessage = JSON.stringify({status: "failed"})

let history: HistoryHandler | null = null;

// health check
app.get('/health', (c) => {
  return c.json(successMessage)
})

app.post('/start', async (c) => {
  if (history) {
    c.json(failMessage);
    return;
  }
  const body = await c.req.json();
  const purpose = body.purpose;
  try {
    history = new HistoryHandler(purpose);
    await history.init();
    return c.json(successMessage);
  } catch(e) {
    console.log(e);
    return c.json(failMessage);
  }
});

app.post('/doProceed', async(c) => {
  if (!history) {
    return c.json(failMessage);
  }
  try {
    await history.doProceed();
    console.log("Memory Result : ", history.getMemory());
    return c.json(JSON.stringify({history: history.getHistory()}));
  } catch(e) {
    console.log(e);
    return c.json(failMessage);
  }
});

app.post('/getSteps', async(c) => {
  if (!history) {
    return c.json(failMessage);
  }
  try {
    const steps = history.getSteps();
    return c.json(JSON.stringify({steps}));
  } catch(e) {
    console.log(e);
    return c.json(failMessage);
  }
});

app.post('/getCurrentStep', async(c) => {
  if (!history) {
    return c.json(failMessage);
  }
  try {
    const currentStep = history.getCurrentStep();
    return c.json(JSON.stringify({currentStep}));
  } catch(e) {
    console.log(e);
    return c.json(failMessage);
  }
})

serve({
  fetch: app.fetch,
  port: 3002
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
