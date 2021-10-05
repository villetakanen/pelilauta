import { useRouter } from 'vue-router'

export function useUxActions (): { back: CallableFunction, reroute: CallableFunction } {
  const router = useRouter()

  function back () {
    // console.debug('useUxActions', 'back()')
    router.back()
  }

  function reroute (route:string) {
    router.push(route)
  }

  return { back, reroute }
}
