import { useRouter } from 'vue-router'

export function useUxActions (): { back: CallableFunction } {
  const router = useRouter()

  function back () {
    // console.debug('useUxActions', 'back()')
    router.back()
  }

  return { back }
}
