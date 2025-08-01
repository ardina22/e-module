import express from 'express'
import cors from 'cors'
import path from 'path'
import { exec } from 'child_process'
import { platform } from 'os'
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
 * POST /api/modules/structure/update
 *
 * Updates the module directory structure on the filesystem based on the provided module tree.
 * Automatically creates missing files and directories, prunes removed items, and writes default
 * content if a file does not yet exist.
 *
 * @param {import('express').Request} req - Express request object containing the module tree
 * @param {import('express').Response} res - Express response object
 *
 * @returns {void} Sends a JSON response with the result of the sync operation
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
 * POST /api/modules/content/update
 *
 * Updates the content of a specific module file entry. The request must include the relative path
 * to the file (`entry`) and the new content as a string.
 *
 * @param {import('express').Request} req - Express request with `entry` and `content` in the body
 * @param {import('express').Response} res - Express response object
 *
 * @returns {void} Sends a JSON response indicating success or failure
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
 * POST /api/modules/publish
 *
 * Publishes the current module to GitHub Pages by running build and deploy commands.
 * Assumes a valid `npm run build` and `npm run deploy` configuration is defined.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 *
 * @returns {void} Sends a JSON response indicating success or failure of the publish process
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

/**
 * POST /api/modules/sync
 *
 * Synchronizes the local module content by running the appropriate clone script
 * based on the current operating system. The script clones the GitHub `gh-pages`
 * branch, copies required files (modules and images) to the `public` directory,
 * and cleans up temporary files afterward.
 *
 * On Windows, it executes `clone-script.bat`.
 * On macOS/Linux, it executes `clone-script.sh` via bash.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 *
 * @returns {void} Sends a JSON response indicating success or failure.
 */
app.post('/api/modules/sync', async (req, res) => {
  try {
    const isWindows = platform() === 'win32'
    const scriptPath = path.join(
      process.cwd(),
      'scripts',
      isWindows ? 'clone-script.bat' : 'clone-script.sh',
    )
    const command = isWindows ? scriptPath : `bash ${scriptPath}`

    await runCommand(command)

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
