export function copyUrl (slug?: string):void {
  const dummy = document.createElement('input')
  document.body.appendChild(dummy)
  if (slug) dummy.value = window.location.host + slug
  else dummy.value = window.location.href
  dummy.select()
  document.execCommand('copy')
  document.body.removeChild(dummy)
}

export function getNavigatorLocale (): string {
  const navigatorLocale =
    navigator.languages !== undefined
      ? navigator.languages[0]
      : navigator.language
  console.debug('Navigator locale is', navigatorLocale?.trim().split(/-|_/)[0] || 'forced to fi')
  if (!navigatorLocale) return 'fi'
  return navigatorLocale.trim().split(/-|_/)[0]
}
