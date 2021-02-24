const urlPatternStart = '(<div>|<br>|<p>| |^|&nbsp;)'
const urlPatternEnd = '(&nbsp;| |<div>|</div>|<br>|</p>|$)'

// This is taken from https://github.com/sindresorhus/linkify-urls
// MIT licensed by Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
const urlPattern = '((?:https?(?::\\/\\/))(?:www\\.)?(?:[a-zA-Z\\d/-_.]+(?:(?:\\.|@)[a-zA-Z\\d]{2,})|localhost)(?:(?:[-a-zA-Z\\d:%_+.~#*$!?&//=@]*)(?:[,](?![\\s]))*)*)'
// This was the old regexp: '(https?:\\/\\/[a-zA-Z0-9=\\?#:\\/_\\.-]*)'

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
  // eslint-disable-next-line
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
  const r = new RegExp(urlPatternStart + urlPattern + urlPatternEnd, 'gmu')
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
  // eslint-disable-next-line
  const re = new RegExp('[^a-öA-Ö0-9]', 'gmu')
  let r = s.replace(re, '-')
  while (r.includes('--')) {
    r = r.split('--').join('-')
  }
  return r.toLowerCase()
}

/**
 * Exported from Skald 2.0
 *
 * @param siteid slug for the site
 * @param htmlContent the payload to be rendered on screen
 * @returns the htmlContent with [wiki:link] replaced with <a href="siteid/link">link</a>
 * etc. See Skaldmd in Skald 2.x for reference
 */
export function renderWikiLinks (siteid:string, htmlContent:string): string {
  /* console.log('rendWikiLinks', siteLinkStub, line) */
  // eslint-disable-next-line
  const re = new RegExp('([\\[(]wiki:)(.+?)([\\])])', 'gmu')
  let siteslug = siteid
  const content = htmlContent.replace(re, (match, p1, p2) => {
    p2 = p2.trim()
    const link = p2.includes('|') ? p2.substring(p2.indexOf('|') + 1).trim() : p2
    let url = p2.split('|')[0]
    if (url.includes('/')) {
      siteslug = toMekanismiURI(url.split('/')[0].trim())
      url = url.split('/')[1]
    }
    url = toMekanismiURI(url.trim())
    return `<a href="/mekanismi/view/${siteslug}/${url}">${link}</a>`// '<a href' + p2 + '-'
  })
  return content
}

export const minLength = (value:any) => (value.length > 1)
export const maxLength = (value:any) => (value.toString().trim().length < 36)
