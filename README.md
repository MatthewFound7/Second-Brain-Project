# Local Development

## Web
- cd apps/web
- pnpm dev
- http://localhost:3000

## API
- cd apps/api
- uv run fastapi dev
- http://127.0.0.1:8000/docs

## Proxy
- Web calls FastAPI via Next.js rewrite:
  - http://localhost:3000/api/health -> http://127.0.0.1:8000/health