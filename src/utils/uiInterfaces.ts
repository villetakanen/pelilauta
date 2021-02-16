export interface MenuItem {
  text: string;
  to?: string;
  action?: () => void
  icon?: string;
  admin?: boolean;
}
