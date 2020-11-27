/**
 * Extracts tags, and adds a-href's to them. Run on save of reply, wikipage, and thread
 *
 * @param htmlContent a string from Quill editor, containing HTML
 */
export function extractTags (htmlContent:string): { formattedContent: string, tags: string[] } {
  return { formattedContent: htmlContent, tags: new Array<string>() }
}

/**
 * Extracts wikilinks, and adds a-href's to them. Run on save of reply, wikipage, and thread
 *
 * @param htmlContent a string from Quill editor, containing HTML
 */
export function extractWikilinks (htmlContent:string): { formattedContent: string } {
  return { formattedContent: htmlContent }
}
