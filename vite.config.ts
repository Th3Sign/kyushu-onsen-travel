import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import authHandler from './api/auth'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'api-auth-dev',
      configureServer(server) {
        server.middlewares.use('/api/auth', async (req: any, res: any) => {
          const url = new URL(req.url, 'http://localhost:5173/api/auth')
          const query = Object.fromEntries(url.searchParams.entries())
          req.query = query

          const sendJson = (code: number, data: any) => {
            res.statusCode = code
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
          }

          const mockRes = {
            setHeader: (k: string, v: string) => res.setHeader(k, v),
            status: (code: number) => ({
              json: (data: any) => sendJson(code, data),
              end: () => res.end(),
            }),
          }

          if (req.method === 'POST') {
            let bodyStr = ''
            req.on('data', (chunk: any) => {
              bodyStr += chunk
            })
            req.on('end', async () => {
              try {
                req.body = bodyStr ? JSON.parse(bodyStr) : {}
              } catch {
                req.body = {}
              }
              try {
                await authHandler(req, mockRes)
              } catch (err: any) {
                sendJson(500, { ok: false, error: err.message })
              }
            })
          } else {
            try {
              await authHandler(req, mockRes)
            } catch (err: any) {
              sendJson(500, { ok: false, error: err.message })
            }
          }
        })
      },
    },
  ],
})
