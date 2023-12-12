import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import { OpenAI } from 'langchain/llms/openai'
import { Calculator } from 'langchain/tools/calculator'
import {
  GoogleCalendarCreateTool,
  GoogleCalendarViewTool,
} from 'langchain/tools/google_calendar'
import 'dotenv/config'
console.log(process.env)
const model = new OpenAI({
  temperature: 0,
  modelName: 'gpt-3.5-turbo',
  openAIApiKey: process.env.OPENAI_API_KEY,
})
const googleCalendarParams = {
  credentials: {
    clientEmail: process.env.GOOGLE_CALENDAR_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_CALENDAR_PRIVATE_KEY,
    calendarId: process.env.GOOGLE_CALENDAR_CALENDAR_ID,
  },
  scopes: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ],
  model,
}
export async function run() {
  const tools = [
    new Calculator(),
    new GoogleCalendarCreateTool(googleCalendarParams),
    new GoogleCalendarViewTool(googleCalendarParams),
  ]
  const calendarAgent = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: 'zero-shot-react-description',
    verbose: true,
  })

  const viewInput = `View my calendar for this week`

  const viewResult = await calendarAgent.call({ input: viewInput })

  console.log('View Result', viewResult)
}

await run()
