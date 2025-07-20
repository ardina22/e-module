import { marked, Renderer } from 'marked'
import StringUtils from './string-utils'

/**
 * Render markdown into HTML with headings that include slugified IDs.
 * Useful for linking via a Table of Contents.
 *
 * @param markdown - The markdown source string
 * @returns Rendered HTML string with IDs on headings
 */
export async function renderMarkdown(markdown: string): Promise<string> {
  const renderer = new Renderer()

  renderer.heading = ({ text, depth, raw }) => {
    const id = StringUtils.slugify(raw)
    return `<h${depth} id="${id}" class="scroll-mt-24">${text}</h${depth}>`
  }

  return await marked(markdown, { renderer })
}
