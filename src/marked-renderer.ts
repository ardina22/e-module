import { Marked, Renderer } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
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

  const marked = new Marked(
    markedHighlight({
      emptyLangClass: 'hljs',
      langPrefix: 'hljs language-',
      highlight(code, lang, _info) {
        console.log(lang)
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return hljs.highlight(code, { language }).value
      },
    }),
  )

  return await marked.parse(markdown, { renderer })
}
