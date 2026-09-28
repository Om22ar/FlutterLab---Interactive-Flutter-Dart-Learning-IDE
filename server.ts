import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Educational Mock API Endpoints (Section 41)
app.get('/api/mock/users', (req: Request, res: Response) => {
  res.json([
    { id: 1, name: 'Alex Mercer', role: 'Flutter Lead', active: true, avatar: 'Icons.person' },
    { id: 2, name: 'Sara Connor', role: 'Dart Architect', active: true, avatar: 'Icons.code' },
    { id: 3, name: 'Tariq Ziyad', role: 'UI/UX Specialist', active: false, avatar: 'Icons.palette' },
  ]);
});

app.get('/api/mock/weather', (req: Request, res: Response) => {
  res.json({
    city: 'Dubai',
    temperature: 28,
    unit: 'Celsius',
    condition: 'Sunny',
    humidity: 45,
    windKmh: 14,
    forecast: [
      { day: 'Tomorrow', temp: 29, condition: 'Sunny' },
      { day: 'Wednesday', temp: 31, condition: 'Clear' },
      { day: 'Thursday', temp: 30, condition: 'Partly Cloudy' },
    ]
  });
});

app.get('/api/mock/tasks', (req: Request, res: Response) => {
  res.json([
    { id: 101, title: 'Understand Widget Tree', completed: true },
    { id: 102, title: 'Master Row and Column Constraints', completed: true },
    { id: 103, title: 'Deploy Flutter Web to Production', completed: false },
  ]);
});

// AI Tutor Endpoint with Gemini 3.1 Pro Preview & HIGH thinking mode
app.post('/api/ai/tutor', async (req: Request, res: Response) => {
  try {
    const {
      mode,
      code,
      lessonTitle,
      lessonConcept,
      selectedWidget,
      errorMessage,
      attemptNumber,
      userPrompt,
      language = 'ar',
    } = req.body;

    const isArabic = language === 'ar';

    const systemInstruction = `You are the expert, supportive FlutterLab AI Coach.
Your mission is to help students learn Flutter & Dart deeply through guided inquiry, conceptual clarity, and Socratic hints.
IMPORTANT PEDAGOGICAL RULES:
1. NEVER just hand over the complete solution code immediately! Always guide the student step-by-step.
2. If mode is "hint", adhere to the progressive hint system:
   - Attempt 1: Gentle nudge
   - Attempt 2: More specific hint
   - Attempt 3: Concept explanation
   - Attempt 4: Partial code snippet
3. If mode is "debug", explain:
   - What happened?
   - Why did it happen?
   - Where in the code (line & concept)?
   - How to think about the fix?
   - Try this action.
4. When mode is "widget_explain", explain how the widget works in the widget tree, constraints passed down, and common properties.
5. Provide response in ${isArabic ? 'Arabic (with English code terms and snippets in LTR markdown blocks)' : 'English'}.
`;

    const prompt = `Student Request Details:
Mode: ${mode}
Current Lesson: ${lessonTitle || 'Interactive Playground'}
Lesson Concept: ${lessonConcept || 'General Flutter'}
Selected Widget: ${selectedWidget || 'None'}
Error Message (if any): ${errorMessage || 'None'}
Attempt Number: ${attemptNumber || 1}
Student's Current Dart/Flutter Code:
\`\`\`dart
${code || '// Empty code'}
\`\`\`
Custom Student Question / Note:
${userPrompt || 'Please evaluate and guide me.'}
`;

    // Try gemini-3.1-pro-preview with HIGH thinking level as required
    let responseText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH,
          },
        },
      });
      responseText = response.text || '';
    } catch (primaryError: any) {
      console.warn('Fallback to gemini-3.8-flash:', primaryError.message);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
        },
      });
      responseText = fallbackResponse.text || '';
    }

    res.json({
      markdown: responseText,
      success: true,
    });
  } catch (err: any) {
    console.error('AI Tutor Server Error:', err);
    res.status(500).json({
      error: 'Failed to generate AI guidance',
      message: err.message,
    });
  }
});

// Telemetry & Session simulation
app.post('/api/runner/run', (req: Request, res: Response) => {
  const sessionId = `runner-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  res.json({
    sessionId,
    status: 'ready',
    sdkVersion: '3.24.0',
    dartVersion: '3.5.0',
    buildDurationMs: 380,
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend in development or production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`FlutterLab Fullstack Server running on http://localhost:${PORT}`);
  });
}

startServer();
