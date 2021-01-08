
const urlPatternStart = '(<div>|<br>|<p>| |^|&nbsp;)'
const urlPatternEnd = '(&nbsp;| |<div>|</div>|<br>|</p>|$)'

export interface Quote {
  content: string
  author: string
}

/**
 * Extracts tags, and adds a-href's to them. Run on save of reply, wikipage, and thread
 *
 * @param htmlContent a string from Quill editor, containing HTML
 */
export function extractTags (htmlContent:string): { formattedContent: string, tags: string[] } {
  const tags = new Array<string>()
  const regex = new RegExp('( |>|,|,|\\.)(#[a-zA-Z]+)(<| )(?!\\/a)', 'gmu')
  const formattedContent = htmlContent.replace(regex, (match, p1, p2, p3) => {
    tags.push(p2.trim().toLowerCase())
    return `${p1}<a href="/stream/tag/${p2.trim().substring(2, p1.length)}">${p2.trim()}</a>${p3}`
  })
  return { formattedContent, tags }
}

/**
 * Extracts wikilinks, and adds a-href's to them. Run on save of reply, wikipage, and thread
 *
 * @param htmlContent a string from Quill editor, containing HTML
 */
export function extractLinks (htmlContent:string): { formattedContent: string } {
  const r = new RegExp(urlPatternStart + '(https?:\\/\\/[a-zA-Z0-9=\\?#:\\/_\\.-]*)' + urlPatternEnd, 'gmu')
  const formattedContent = htmlContent.replace(r, (match, p1, p2, p3) => {
    return `${p1}<a href="${p2.trim()}">${p2.trim()}</a>${p3}`
  })
  return { formattedContent }
}
/**
 * Replaces a String with a skald uri compatible slug
 * @param {string} s a String to be converted
 */
export function toMekanismiURI (s: string): string {
  if (s === null) return ''
  const re = new RegExp('[^a-öA-Ö0-9]', 'gmu')
  let r = s.replace(re, '-')
  while (r.includes('--')) {
    r = r.split('--').join('-')
  }
  return r.toLowerCase()
}
