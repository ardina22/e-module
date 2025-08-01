/**
 * @file FileManager.js
 * @description Manage, (re)order, and *create* module files/folders from a ModuleTree.
 */

import fs from 'fs/promises'
import path from 'path'

/**
 * @typedef {Object} ModuleTree
 * @property {string} label
 * @property {string} [file]
 * @property {ModuleTree[]} [children]
 */
export default class FileManager {
  /**
   * Create a new file manager instance.
   *
   * @param {string} baseDir Absolute path to public/modules
   */
  constructor(baseDir) {
    this.baseDir = baseDir
    this.indexEntries = []
  }

  /**
   * Slugifies a string label.
   *
   * @param {string} text
   * @returns {string} The slugify label.
   */
  toSlug(text) {
    return text
      .trim()
      .replace(/[^\w\s-]/g, '') // remove special chars
      .replace(/\s+/g, '-') // spaces to dashes
      .replace(/--+/g, '-') // collapse multiple dashes
      .replace(/^-+|-+$/g, '') // trim leading/trailing dashes
  }

  /**
   * Check whether the given path is exists.
   *
   * @param {string} p
   * @return {Promise<boolean>} A promise that resolves true when the path is exists otherwise false.
   */
  async pathExists(p) {
    try {
      await fs.access(p)
      return true
    } catch {
      return false
    }
  }

  /**
   * Ensures a directory exists.
   *
   * @param {string} dir
   * @returns {Promise<void>}
   */
  async ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true })
  }

  /**
   * Move/rename a file if it exists; otherwise (optionally) create it.
   *
   * @param {string} from
   * @param {string} to
   * @param {object} opts
   * @param {boolean} opts.createIfMissing
   * @param {string} [opts.content]
   * @returns {Promise<void>}
   */
  async moveOrCreateFile(from, to, { createIfMissing, content = '' } = {}) {
    await this.ensureDir(path.dirname(to))

    const fromExists = await this.pathExists(from)
    if (fromExists) {
      try {
        await fs.rename(from, to)
        console.log(`✔ Moved: ${from} → ${to}`)
      } catch (err) {
        console.warn(`⚠ Could not move ${from} → ${to}: ${err.message}`)
      }
    } else if (createIfMissing) {
      try {
        await fs.writeFile(to, content, 'utf-8')
        console.log(`✔ Created: ${to}`)
      } catch (err) {
        console.warn(`⚠ Could not create ${to}: ${err.message}`)
      }
    } else {
      console.warn(`⚠ Source not found and createIfMissing=false: ${from}`)
    }
  }

  /**
   * Add path to index.json list.
   *
   * @param {string} relativePath
   * @returns {void}
   */
  addIndexEntry(relativePath) {
    this.indexEntries.push(relativePath.replace(/\\/g, '/'))
  }

  /**
   * Write the index file.
   *
   * @returns {Promise<void>}
   */
  async writeIndexFile() {
    const output = path.join(this.baseDir, 'index.json')
    await fs.writeFile(output, JSON.stringify(this.indexEntries, null, 2), 'utf-8')
    console.log(`📦 Generated index.json with ${this.indexEntries.length} entries.`)
  }

  /**
   * @param {ModuleTree[]} tree
   * @param {object} opts
   * @param {boolean} [opts.createIfMissing=true]
   * @param {string|((node: ModuleTree)=>string)} [opts.fileContent='']
   * @param {boolean} [opts.prune=true]
   * @param {boolean} [opts.dryRun=false]
   */
  async syncFromTree(tree, {
    createIfMissing = true,
    fileContent = '',
    prune = true,
    dryRun = false
  } = {}) {
    this.indexEntries = []
    await this.ensureDir(this.baseDir)
    await this._reorderTree(tree, { createIfMissing, fileContent })
    await this.writeIndexFile()

    if (prune) {
      await this.pruneOrphans(tree, { dryRun })
    }
  }

  /**
   * Build sets of *expected* file & directory paths from the tree
   * (relative to baseDir).
   * @param {ModuleTree[]} tree
   * @returns {{ files:Set<string>, dirs:Set<string> }}
   */
  collectPlannedPaths(tree) {
    const files = new Set()
    const dirs = new Set()

    const walk = (nodes, prefixIndices = []) => {
      nodes.forEach((node, i) => {
        const idx = i + 1
        const slug = this.toSlug(node.label)
        const prefix = [...prefixIndices, `${idx}-${slug}`]

        if (node.file && !node.children?.length) {
          // top-level file
          const rel = `${idx}-${slug}.md`
          files.add(rel)
        }

        if (node.children && node.children.length) {
          const folder = prefix.join('-')   // or just prefix[prefix.length-1]
          dirs.add(folder)

          node.children.forEach((child, ci) => {
            const childSlug = this.toSlug(child.label)
            const rel = path.join(folder, `${ci + 1}-${childSlug}.md`)
            files.add(rel.replace(/\\/g, '/'))
          })
        }
      })
    }

    walk(tree)
    // Always keep index.json
    files.add('index.json')

    return { files, dirs }
  }

  /**
   * Recursively scan the baseDir for files/folders.
   * Returns paths relative to baseDir.
   * @returns {Promise<{ files: string[], dirs: string[] }>}
   */
  async scanDisk() {
    const files = []
    const dirs = []

    const walk = async (dirRel = '') => {
      const dirAbs = path.join(this.baseDir, dirRel)
      const entries = await fs.readdir(dirAbs, { withFileTypes: true })

      for (const entry of entries) {
        const rel = path.join(dirRel, entry.name).replace(/\\/g, '/')

        if (entry.isDirectory()) {
          dirs.push(rel)
          await walk(rel)
        } else if (entry.isFile()) {
          files.push(rel)
        }
      }
    }

    await walk()

    return { files, dirs }
  }

  /**
   * Delete files/dirs that are NOT present in the provided tree.
   *
   * @param {ModuleTree[]} tree
   * @param {{ dryRun?: boolean }} opts
   */
  async pruneOrphans(tree, { dryRun = false } = {}) {
    const planned = this.collectPlannedPaths(tree)
    const onDisk = await this.scanDisk()

    // Orphan files
    const orphanFiles = onDisk.files.filter(f => !planned.files.has(f))
    // Orphan dirs (delete deepest first)
    const orphanDirs = onDisk.dirs
      .filter(d => !planned.dirs.has(d))
      .sort((a, b) => b.length - a.length)

    if (orphanFiles.length === 0 && orphanDirs.length === 0) {
      console.log('✅ No orphans to prune.')
      return
    }

    console.log(`🧹 Pruning orphans (dryRun=${dryRun})`)
    for (const f of orphanFiles) {
      const abs = path.join(this.baseDir, f)
      if (dryRun) {
        console.log(`(dry) rm file: ${f}`)
      } else {
        await fs.rm(abs, { force: true })
        console.log(`🗑 removed file: ${f}`)
      }
    }

    for (const d of orphanDirs) {
      const abs = path.join(this.baseDir, d)
      try {
        const stat = await fs.stat(abs)
        if (!stat.isDirectory()) continue
        const contents = await fs.readdir(abs)
        if (contents.length === 0) {
          if (dryRun) {
            console.log(`(dry) rmdir: ${d}`)
          } else {
            await fs.rmdir(abs)
            console.log(`🗑 removed dir: ${d}`)
          }
        }
      } catch {
        // ignore
      }
    }
  }

  /**
   * Internal recursive reorder/create.
   *
   * @param {ModuleTree[]} tree
   * @param {{ createIfMissing: boolean, fileContent: string|Function }} opts
   * @returns {Promise<void>}
   */
  async _reorderTree(tree, { createIfMissing, fileContent }) {
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i]
      const indexPrefix = `${i + 1}-`
      const slugLabel = this.toSlug(node.label)

      // Top-level file
      if (node.file && !node.children?.length) {
        const oldPath = path.resolve(this.baseDir, node.file)
        const newFilename = `${indexPrefix}${slugLabel}.md`
        const newPath = path.join(this.baseDir, newFilename)

        const content =
          typeof fileContent === 'function' ? fileContent(node) : fileContent

        await this.moveOrCreateFile(oldPath, newPath, {
          createIfMissing,
          content,
        })

        this.addIndexEntry(newFilename)
      }

      // Folder with children
      if (node.children && node.children.length > 0) {
        const oldFolderFromFile = node.children.find(c => c.file)?.file?.split('/')?.[0]
        const oldFolderName = oldFolderFromFile ?? ''
        const newFolderName = `${indexPrefix}${slugLabel}`
        const oldFolderPath = oldFolderName ? path.join(this.baseDir, oldFolderName) : null
        const newFolderPath = path.join(this.baseDir, newFolderName)

        if (oldFolderPath && (await this.pathExists(oldFolderPath))) {
          if (oldFolderName !== newFolderName) {
            try {
              await fs.rename(oldFolderPath, newFolderPath)
              console.log(`✔ Renamed folder: ${oldFolderName} → ${newFolderName}`)
            } catch (err) {
              console.warn(`⚠ Could not rename folder: ${err.message}`)
              await this.ensureDir(newFolderPath)
            }
          }
        } else {
          if (createIfMissing) {
            await this.ensureDir(newFolderPath)
            console.log(`✔ Created folder: ${newFolderName}`)
          } else {
            console.warn(`⚠ Folder missing and createIfMissing=false: ${newFolderName}`)
          }
        }

        for (let j = 0; j < node.children.length; j++) {
          const child = node.children[j]
          const childSlug = this.toSlug(child.label)
          const childIndex = `${j + 1}-`
          const newChildName = `${childIndex}${childSlug}.md`
          const newChildPath = path.join(newFolderPath, newChildName)

          const oldChildPath = child.file
            ? path.resolve(this.baseDir, child.file)
            : path.join(newFolderPath, newChildName)

          const content =
            typeof fileContent === 'function' ? fileContent(child) : fileContent

          await this.moveOrCreateFile(oldChildPath, newChildPath, {
            createIfMissing,
            content,
          })

          this.addIndexEntry(path.join(newFolderName, newChildName))
        }
      }
    }
  }
}
