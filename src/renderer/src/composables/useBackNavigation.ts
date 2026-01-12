import { ref, onMounted, onBeforeUnmount, Ref } from 'vue'
import { useRouter } from 'vue-router'

export function useBackNavigation(): {
  canGoBack: Ref<boolean>
  tryGoBack: () => void
} {
  const router = useRouter()
  const canGoBack = ref<boolean>(false)

  let removeGuard: (() => void) | null = null

  const update = (): void => {
    canGoBack.value = !!window.history.state?.back
  }

  const tryGoBack = (): void => {
    if (canGoBack.value) {
      router.back()
    }
  }

  onMounted(() => {
    update()
    removeGuard = router.afterEach(update)
  })

  onBeforeUnmount(() => {
    removeGuard?.()
  })

  return {
    canGoBack,
    tryGoBack
  }
}
