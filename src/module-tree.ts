import StringUtils from '@/string-utils'

export interface ModuleTree {
  label: string
  file?: string
  children?: ModuleTree[]
}

interface InternalModuleTree extends ModuleTree {
  _raw: string
  children?: InternalModuleTree[]
}

/**
 * Builds a nested tree structure from a flat array of markdown file paths (e.g., from `public/modules/`).
 *
 * This function mirrors the directory structure of provided `.md` files into a hierarchical format
 * suitable for rendering sidebars, tree navigation, or route-based content loaders.
 *
 * Each markdown file becomes a leaf node with a `label` and `file` path. Directories are recursively
 * grouped as parent nodes with `children`. Items are sorted numerically if prefixed with digits
 * (e.g., `2-hello.md`), allowing for manual ordering.
 *
 * ### Example File Input:
 * ```ts
 * [
 *   'modules/1-intro.md',
 *   'modules/2-basics/1-hello.md',
 *   'modules/3-advanced/1-tips.md',
 *   'modules/3-advanced/2-tricks.md'
 * ]
 * ```
 *
 * ### Output:
 * ```ts
 * [
 *   { label: 'Intro', file: 'modules/1-intro.md' },
 *   {
 *     label: 'Basics',
 *     children: [
 *       { label: 'Hello', file: 'modules/2-basics/1-hello.md' }
 *     ]
 *   },
 *   {
 *     label: 'Advanced',
 *     children: [
 *       { label: 'Tips', file: 'modules/3-advanced/1-tips.md' },
 *       { label: 'Tricks', file: 'modules/3-advanced/2-tricks.md' }
 *     ]
 *   }
 * ]
 * ```
 *
 * @param paths - A flat list of file paths from the `public/` directory (e.g., `modules/*.md`).
 * @returns A sorted, nested array of `ModuleTree` entries representing the structure.
 */
export const createModuleTrees = (paths: string[]): ModuleTree[] => {
  const formatLabel = (name: string): string => {
    return StringUtils.toTitleCase(name.replace(/^\d+-/, '').replace(/\.md$/, ''))
  }

  const extractOrder = (raw: string = ''): number => {
    const match = raw.match(/^(\d+)-/)
    return match ? parseInt(match[1], 10) : Infinity
  }

  const sortTree = (node: InternalModuleTree): void => {
    if (!node.children) return
    node.children.sort((a, b) => extractOrder(a._raw) - extractOrder(b._raw))
    node.children.forEach(sortTree)
  }

  const pruneInternalProps = (nodes: InternalModuleTree[]): ModuleTree[] =>
    nodes.map(({ _raw, children, ...rest }) => ({
      ...rest,
      children: children ? pruneInternalProps(children) : undefined,
    }))

  const root: InternalModuleTree = { label: 'root', _raw: 'root', children: [] }

  for (const fullPath of paths) {
    const relativePath = fullPath.replace(/^modules\//, '')
    const pathParts = relativePath.split('/')
    const fileName = pathParts.pop()!

    let currentNode = root

    for (const folder of pathParts) {
      currentNode.children ??= []

      let folderNode = currentNode.children.find((child) => child._raw === folder)

      if (!folderNode) {
        folderNode = {
          label: formatLabel(folder),
          _raw: folder,
          children: [],
        }
        currentNode.children.push(folderNode)
      }

      currentNode = folderNode
    }

    currentNode.children ??= []
    currentNode.children.push({
      label: formatLabel(fileName),
      file: fullPath,
      _raw: fileName,
    })
  }

  sortTree(root)
  return pruneInternalProps(root.children ?? [])
}

/**
 * Recursively finds the label of a given file in a module tree.
 *
 * @param tree - The module tree to search.
 * @param file - The file path to look for (e.g., 'modules/1-intro.md').
 * @returns The label of the matching node, or null if not found.
 */
export const findLabelByFile = (tree: ModuleTree[], file: string): string | null => {
  for (const node of tree) {
    if (node.file === file) return node.label
    if (node.children) {
      const found = findLabelByFile(node.children, file)
      if (found) return found
    }
  }
  return null
}
