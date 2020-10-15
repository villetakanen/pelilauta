const patternStart = '(<div>|<br>| |^|&nbsp;)'
const patternEnd = '(&nbsp;| |<div>|</div>|<br>|$)'

function processImages (content: string): { content: string, images: string[] } {
  const r = new RegExp(patternStart + '(https?:\\/\\/[a-zA-Z0-9#:\\/_\\.-]*\\.(jpg|png|gif|svg|jpeg))' + patternEnd, 'gmu')
  const images = new Array<string>()
  content = content.replace(r, (match, p1, p2, p3, p4) => {
    images.push(p2.trim())
    return `${p1}<span class="image-url">${p2.trim()}</span>${p4}`
  })
  return { content, images }
}

function processLinks (content: string): string {
  const r = new RegExp(patternStart + '(https?:\\/\\/[a-zA-Z0-9#:\\/_\\.-]*)' + patternEnd, 'gmu')
  content = content.replace(r, (match, p1, p2, p3) => {
    return `${p1}<a href="${p2.trim()}">${p2.trim()}</a>${p3}`
  })
  return content
}

export function processContent (content: string): { update: string, newImages: string[]} {
  const { content: postImagesContent, images: newImages } = processImages(content)
  content = postImagesContent
  content = processLinks(content)
  return { update: content, newImages }
}
