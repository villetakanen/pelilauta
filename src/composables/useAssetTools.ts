import downscale from 'downscale'

const DOWNSCALED_MIMETYPES = [
  'image/jpeg',
  'image/png'
]

async function getHeightAndWidthFromDataUrl (dataURL:string): Promise<number[]> {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      resolve([
        img.height,
        img.width
      ])
    }
    img.src = dataURL
  })
}

async function getDataUrl (file:File): Promise<string> {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(
        reader.result as string
      )
    }
    reader.readAsDataURL(file)
  })
}

export async function processAsset (e:Event): Promise<{ name: string, mimetype: string, dataURL: string }> {
  const element = (e.target as HTMLInputElement)
  if (!element.files || !element.files[0]) throw new Error('No file to process')

  const file = element.files[0]

  let dataURL = ''

  if (DOWNSCALED_MIMETYPES.includes(file.type)) {
    let height = 1
    let width = 1
    const s = await getHeightAndWidthFromDataUrl(await getDataUrl(file))
    if (s.length > 1) {
      width = s[1]
      height = s[0]
    }
    if (height > width) {
      width = width / height * 720
      height = 720
    } else {
      height = height / width * 720
      width = 720
    }
    dataURL = await downscale(element.files[0], width, height)
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
