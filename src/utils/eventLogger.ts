import { getAnalytics, logEvent as logAnalyticsEvent } from '@firebase/analytics'

export function logEvent (source: string, info?:{ [key: string]:unknown }):void {
  // eslint-disable-next-line
  if (process.env.VUE_APP_DEBUG_LOGS) console.debug('### analytics debug ###', source, info)
  logAnalyticsEvent(getAnalytics(), source, info)
}
