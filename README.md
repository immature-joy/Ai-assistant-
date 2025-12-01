# Shadow AI API (Beginner-friendly)

Simple Express API for an AI assistant. Provides a `/api/chat` endpoint that forwards user messages to an AI backend (OpenAI or an external AI URL).

## Quickstart

1. Clone or copy files into a folder.
2. `npm install`
3. Copy `.env.example` to `.env` and fill values:
   - `OPENAI_API_KEY` (optional) or `EXTERNAL_AI_URL` (fallback)
   - `SERVER_API_KEY` (required by clients)
4. Run:
   - `npm run dev` (requires nodemon) or `npm start`
5. Test:
   - `POST http://localhost:3000/api/chat` with JSON body `{ "message": "Hello" }`
   - Include header `x-api-key: <SERVER_API_KEY>`

## Example client (curl)
```bash
curl -X POST "http://localhost:3000/api/chat" \
  -H "Content-Type: application/json" \
  -H "x-api-key: changeme_local_key" \
  -d '{"message":"Hello there"}'
