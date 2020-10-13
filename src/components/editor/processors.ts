const patternStart = '(<div>|<br>| |^|&nbsp;)'
const patternEnd = '(&nbsp;| |<div>|</div>|<br>|$)'

function processLinks (content: string): string {
  const r = new RegExp(patternStart + '(https?:\\/\\/[a-zA-Z0-9#:\\/_\\.-]*)' + patternEnd, 'gmu')
  content = content.replace(r, (match, p1, p2, p3) => {
    return `${p1}<a href="${p2.trim()}">${p2.trim()}</a>${p3}`
  })
  return content
}

export function processContent (content: string): string {
  content = processLinks(content)
  return content
}
