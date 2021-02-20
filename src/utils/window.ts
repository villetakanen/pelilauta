export function copyUrl (slug?: string):void {
  const dummy = document.createElement('input')
  document.body.appendChild(dummy)
  if (slug) dummy.value = window.location.host + slug
  else dummy.value = window.location.href
  dummy.select()
  document.execCommand('copy')
  document.body.removeChild(dummy)
}
