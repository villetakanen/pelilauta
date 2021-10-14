import downscale from 'downscale'

const DOWNSCALED_MIMETYPES = [
  'image/jpeg',
  'image/png'
]

export async function processAsset (e:Event): Promise<{ name: string, mimetype: string, dataURL: string }> {
  const element = (e.target as HTMLInputElement)
  if (!element.files || !element.files[0]) throw new Error('No file to process')

  const file = element.files[0]

  let dataURL = ''

  if (DOWNSCALED_MIMETYPES.includes(file.type)) {
    dataURL = await downscale(element.files[0], 720, 720)
  } else {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      dataURL = reader.result as string
    }
  }
  return {
    name: file.name,
    mimetype: file.type,
    dataURL: dataURL
  }
}
