export interface MenuItem {
  text: string
  to?: string
  action?: () => void
  icon?: string
  admin?: boolean
}

export interface PostImage {
  url: string
}

export interface Player {
  uid: string
  nick: string
}
