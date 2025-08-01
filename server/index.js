import express from 'express'
import cors from 'cors'
import path from 'path'
import FileManager from './file-manager.js'

const app = express()
app.use(cors())
app.use(express.json())

const BASE_DIR = path.join(process.cwd(), 'public/modules')

app.post('/api/modules/update', async (req, res) => {
  const moduleTree = req.body

  const fm = new FileManager(BASE_DIR)

  try {
    await fm.syncFromTree(moduleTree, {
      createIfMissing: true,
      fileContent: (node) => `# ${node.label}\n\n_TODO: write content_`,
      prune: true,     // <- remove orphans
      dryRun: false,   // <- set true to preview
    })

    res.json({ success: true, data: moduleTree, error: null, })
  } catch (error) {
    res.status(500).json({ success: false, data: null, error: error.message })
  }
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`API server running at http://127.0.0.1:${PORT}`)
})
