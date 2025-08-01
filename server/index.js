import express from 'express'
import cors from 'cors'
import path from 'path'
import { exec } from 'child_process'
import FileManager from './file-manager.js'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Base directory where modules are stored
const BASE_DIR = path.join(process.cwd(), 'public/modules')

/**
 * Executes a shell command asynchronously.
 *
 * @param {string} command - The command to execute in the shell.
 * @returns {Promise<void>} - Resolves if the command succeeds, rejects on failure.
 *
 * @example
 * await runCommand('npm run build')
 */
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error running "${command}":`, stderr || error.message)
        return reject(stderr)
      }
      console.log(`✅ "${command}" Output:\n`, stdout)
      resolve()
    })
  })
}

/**
 * Updates the module directory structure from a provided module tree.
 */
app.post('/api/modules/structure/update', async (req, res) => {
  const moduleTree = req.body
  const fm = new FileManager(BASE_DIR)

  try {
    await fm.syncFromTree(moduleTree, {
      createIfMissing: true,
      fileContent: (node) => `# ${node.label}\n\n_TODO: write content_`,
      prune: true,
      dryRun: false,
    })

    res.json({ success: true, data: moduleTree, error: null })
  } catch (error) {
    res.status(500).json({ success: false, data: null, error: error.message })
  }
})

/**
 * Updates the content of a specific module entry file.
 */
app.post('/api/modules/content/update', async (req, res) => {
  const { entry, content } = req.body

  if (typeof entry !== 'string' || typeof content !== 'string') {
    return res.status(400).json({ error: 'Invalid payload' })
  }

  const fm = new FileManager(BASE_DIR)

  try {
    await fm.updateContent(entry, content)
    res.status(200).json({ message: 'Content updated' })
  } catch (err) {
    console.error('Error updating content:', err.message)
    res.status(500).json({ error: err.message })
  }
})

/**
 * Publishes the module by executing the clone, build, and deploy steps.
 */
app.post('/api/modules/publish', async (req, res) => {
  try {
    await runCommand('npm run build')
    await runCommand('npm run deploy')

    res.status(200).json({ message: 'E-Module Published' })
  } catch (err) {
    console.error('Publish failed:', err)
    res.status(500).json({ error: 'Failed to publish module' })
  }
})

app.post('/api/modules/sync', async (req, res) => {
  try {
    await runCommand(`sh ${path.join(process.cwd(), 'clone-script.local.sh')}`)
    res.status(200).json({ message: 'E-Module Synchronized' })
  } catch (err) {
    console.error('Sync failed:', err)
    res.status(500).json({ error: 'Failed to sync module' })
  }
})

// Start the server
const PORT = 3001
app.listen(PORT, () => {
  console.log(`🚀 API server running at http://127.0.0.1:${PORT}`)
})
