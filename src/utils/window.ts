export function copyUrl (slug: string):void {
  const dummy = document.createElement('input')
  document.body.appendChild(dummy)
  dummy.value = window.location.host + slug
  dummy.select()
  document.execCommand('copy')
  document.body.removeChild(dummy)
}
