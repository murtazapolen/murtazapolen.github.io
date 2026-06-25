import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-reviews-plugin',
      configureServer(server) {
        server.middlewares.use('/api/save-reviews', (req, res) => {
          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => {
              body += chunk.toString()
            })
            req.on('end', () => {
              try {
                // Ensure valid JSON before saving
                JSON.parse(body)
                const filePath = path.resolve(__dirname, 'src/data/reviews.json')
                fs.writeFileSync(filePath, body)
                res.statusCode = 200
                res.end(JSON.stringify({ success: true }))
              } catch (e) {
                res.statusCode = 400
                res.end(JSON.stringify({ error: 'Invalid JSON' }))
              }
            })
          } else {
            res.statusCode = 405
            res.end('Method Not Allowed')
          }
        })
      }
    }
  ],
  build: {
    target: 'es2015'
  }
})
