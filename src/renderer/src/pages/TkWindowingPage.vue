<template>
  <div class="tk-windowing-page">
    <section class="windowing-demo">
      <h2>Windowing Demo</h2>

      <div class="demo-group">
        <h3>Open Options</h3>
        <div class="demo-controls">
          <TkToggleSwitch v-model="useParent" theme="primary" size="small" :disabled="isOpening || isOpened">Use Parent</TkToggleSwitch>
          <TkToggleSwitch v-model="showInTaskbar" theme="primary" size="small" :disabled="isOpening || isOpened">
            Show in Taskbar
          </TkToggleSwitch>
          <TkToggleSwitch v-model="isModal" theme="primary" size="small" :disabled="isOpening || isOpened || !useParent">
            Modal
          </TkToggleSwitch>
          <TkToggleSwitch v-model="isResizable" theme="primary" size="small" :disabled="isOpening || isOpened">Resizable</TkToggleSwitch>
          <TkToggleSwitch v-model="isAlwaysOnTop" theme="primary" size="small" :disabled="isOpening || isOpened">
            Always on Top
          </TkToggleSwitch>
          <TkToggleSwitch v-model="showInactive" theme="primary" size="small" :disabled="isOpening || isOpened || isModal">
            Show Without Focus
          </TkToggleSwitch>
        </div>
        <p class="demo-note">Options apply when opening a new window. Modal requires a parent and blocks interaction with its opener.</p>
        <p v-if="useParent" class="demo-note">
          On Windows, a parented window normally has no separate taskbar entry and can minimize to a small native bar. See the notes below.
        </p>
      </div>

      <div class="demo-group">
        <h3>Window Control</h3>
        <div class="demo-controls">
          <TkButton theme="primary" :disabled="isOpening || isOpened" @click="openWindow">Open Window</TkButton>
          <TkButton theme="danger" :disabled="!isOpened" @click="managedWindow?.close()">Close</TkButton>
          <TkButton theme="secondary" :disabled="!isOpened" @click="managedWindow?.activate()">Activate</TkButton>
          <TkButton theme="secondary" :disabled="!isOpened" @click="managedWindow?.minimize()">Minimize</TkButton>
          <TkButton theme="secondary" :disabled="!isOpened" @click="managedWindow?.maximize()">Maximize</TkButton>
          <TkButton theme="secondary" :disabled="!isOpened" @click="managedWindow?.restore()">Restore</TkButton>
        </div>
        <div class="demo-controls">
          <TkButton theme="secondary" :disabled="!isOpened" @click="managedWindow?.move('center-screen')">Center on Screen</TkButton>
          <TkButton theme="secondary" :disabled="!isOpened || !useParent" @click="managedWindow?.move('center-parent')">
            Center on Parent
          </TkButton>
          <TkButton theme="secondary" :disabled="!isOpened" @click="toggleWindowSize">Toggle Size</TkButton>
          <TkButton theme="secondary" :disabled="!isOpened" @click="managedWindow?.enterFullscreen()">Enter Fullscreen</TkButton>
          <TkButton theme="secondary" :disabled="!isOpened" @click="managedWindow?.exitFullscreen()">Exit Fullscreen</TkButton>
        </div>
        <p role="status">Status: {{ windowStatus }}</p>
        <p v-if="openError" class="demo-error" role="alert">{{ openError }}</p>
      </div>

      <div class="demo-group">
        <h3>Content and Props</h3>
        <div class="demo-controls">
          <TkButton
            :theme="activeComponent === 'windowing-demo-message' ? 'primary' : 'secondary'"
            :disabled="!isOpened || !isContentReady || activeComponent === 'windowing-demo-message'"
            @click="switchContent('windowing-demo-message')"
          >
            Message
          </TkButton>
          <TkButton
            :theme="activeComponent === 'windowing-demo-counter' ? 'primary' : 'secondary'"
            :disabled="!isOpened || !isContentReady || activeComponent === 'windowing-demo-counter'"
            @click="switchContent('windowing-demo-counter')"
          >
            Counter
          </TkButton>
          <TkButton theme="success" :disabled="!isOpened || !isContentReady" @click="updateProps">
            {{ activeComponent === 'windowing-demo-message' ? 'Change Message' : 'Change Step' }}
          </TkButton>
        </div>
        <template v-if="activeComponent === 'windowing-demo-message'">
          <p>Title: {{ messageProps.title }}</p>
          <p>Message: {{ messageProps.message }}</p>
        </template>
        <p v-else>Step: {{ counterStep }}. Updating props keeps the current count; switching components resets it.</p>
      </div>

      <div class="demo-group">
        <h3>Events</h3>
        <TkCheckBox v-model="isChecked" :disabled="!isOpened || !isContentReady" @change="sendChecked">
          Shared checkbox: {{ isChecked ? 'checked' : 'unchecked' }}
        </TkCheckBox>
        <p class="demo-note">
          Check either window to update the other through events. The value also stays in sync after switching content.
        </p>
      </div>
    </section>

    <article>
      <header>
        <h2>Windowing</h2>
        <p>
          Windowing provides a small IPC-based model for creating, controlling, and connecting Electron windows. Windows can target known
          window IDs, control themselves without knowing their own IDs, and communicate with their openers through sender-based routing
          defaults.
        </p>
      </header>

      <section>
        <h3>Core Concepts</h3>

        <h4>Managed Window and Window Host</h4>
        <p>
          A managed window is an Electron <code>BrowserWindow</code> created and tracked by <code>WindowingManager</code>. It loads a shared
          renderer-side window host that receives content updates and renders the requested component.
        </p>
        <p>
          The managed window is the native Electron window; the window host is its renderer-side content container. The main window also
          supports window-control requests, but content updates only target managed windows.
        </p>

        <h4>Opener and Parent</h4>
        <p>
          The opener is the window that creates a managed window. The manager records this relationship for event routing and closure
          notifications.
        </p>
        <p>
          The parent is Electron's native parent-window relationship. It defaults to the opener but can be configured independently. At the
          IPC level, <code>parentId</code> can reference another known window ID or be set to <code>null</code>. The higher-level
          <code>useWindowing()</code> API exposes the common <code>opener</code> and <code>none</code> choices.
        </p>

        <h4>Windows Platform Note</h4>
        <p>
          On Windows, an owned window with <code>parent</code> normally has no separate taskbar entry, even with
          <code>skipTaskbar: false</code>. It hides when its parent is minimized and reappears when the parent is restored.
        </p>
        <p>
          Minimizing a non-modal owned window itself can leave a small native bar at the desktop's lower-left corner. This is Windows
          behavior by design; custom renderer title-bar buttons do not appear in that bar.
        </p>
        <p>
          Prefer omitting the minimize button or hiding instead of minimizing, with a way to show the window again. Use
          <code>parent: 'none'</code> for independent taskbar and minimization behavior.
        </p>
        <p>
          References: Electron
          <a href="https://github.com/electron/electron/issues/8637#issuecomment-306391785" target="_blank" rel="noreferrer">#8637</a> and
          <a href="https://github.com/electron/electron/issues/38425" target="_blank" rel="noreferrer">#38425</a>.
        </p>
      </section>

      <section>
        <h3>Lifecycle</h3>

        <ol>
          <li>The opener requests a managed window.</li>
          <li><code>WindowingManager</code> creates the hidden window and loads its window host.</li>
          <li>The host registers its update listener and sends <code>windowing:ready</code>.</li>
          <li>The manager shows the window and returns its ID to the opener.</li>
          <li>The opener sends the initial content component and props.</li>
          <li>The host loads and renders the content component.</li>
        </ol>

        <p>
          Readiness indicates that the host can receive content updates; it does not indicate that the content component has already been
          rendered. The open request is rejected if host initialization fails or times out.
        </p>
      </section>

      <section>
        <h3>Routing Rules</h3>

        <ul>
          <li>For window-control requests, an omitted <code>targetId</code> targets the sender window.</li>
          <li>
            For event requests, an omitted <code>targetId</code> routes the event to the sender's opener. The sender must therefore have an
            opener.
          </li>
          <li>
            In a delivered event notification, an omitted <code>fromId</code> indicates that the event was sent by the receiving window's
            opener.
          </li>
        </ul>

        <p>
          Events sent from a managed window to its opener include the managed window's ID as <code>fromId</code>, allowing the opener to
          route each event to the corresponding managed-window handle.
        </p>
        <p>These defaults let managed windows control themselves and communicate with their openers without knowing either window ID.</p>
      </section>

      <section>
        <h3>Renderer APIs</h3>

        <h4><code>useWindowing()</code></h4>
        <p>
          Opens and controls one managed window. The returned handle stores the window ID, tracks its lifecycle, updates its content, routes
          its events, and reports when it closes.
        </p>

        <h4><code>useWindowingHost()</code></h4>
        <p>
          Gives a managed-window content component access to its own state and window commands. It also exchanges events with the opener
          without exposing either window ID to the component.
        </p>

        <p>Application components should normally use these composables instead of accessing <code>window.windowingAPI</code> directly.</p>
      </section>

      <section>
        <h3>IPC Protocol</h3>

        <dl>
          <dt>Lifecycle</dt>
          <dd><code>windowing:open</code> creates a managed window, and <code>windowing:ready</code> completes host initialization.</dd>

          <dt>Content</dt>
          <dd>
            <code>windowing:update</code> sends a component and props to a managed window host. Its <code>targetId</code> is required.
          </dd>

          <dt>Events</dt>
          <dd><code>windowing:event</code> forwards application events and optional payloads between windows.</dd>

          <dt>Window Control</dt>
          <dd>
            <code>windowing:close</code>, <code>windowing:activate</code>, <code>windowing:minimize</code>, <code>windowing:maximize</code>,
            <code>windowing:restore</code>, <code>windowing:resize</code>, <code>windowing:move</code>, <code>windowing:topmost</code>,
            <code>windowing:enter-fullscreen</code>, and <code>windowing:exit-fullscreen</code> apply native window operations.
          </dd>

          <dt>State</dt>
          <dd>
            <code>windowing:get-window-state</code> retrieves the current state, and <code>windowing:window-state-changed</code> reports
            state changes.
          </dd>

          <dt>Closure</dt>
          <dd><code>windowing:window-closed</code> notifies the opener when one of its managed windows closes.</dd>
        </dl>
      </section>

      <section>
        <h3>Core Types</h3>

        <dl>
          <dt><code>WindowId</code></dt>
          <dd>A number mapped to Electron <code>BrowserWindow.id</code>.</dd>

          <dt><code>WindowContentProps</code></dt>
          <dd>A property object passed to a window content component.</dd>

          <dt><code>WindowPosition</code></dt>
          <dd>
            Supports <code>center-screen</code>, <code>center-parent</code>, or an absolute <code>{ x, y }</code> position in screen
            coordinates.
          </dd>

          <dt><code>WindowState</code></dt>
          <dd>Describes the window's bounds, minimized, maximized, fullscreen, visibility, always-on-top, and focus states.</dd>
        </dl>

        <p>
          Content props and event payloads must be serializable by Electron IPC. Generic payload types are compile-time contracts and are
          not validated at runtime.
        </p>
        <p>Request, response, and notification definitions are available in <code>shared/windowing-types.ts</code>.</p>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, effectScope, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import type { EffectScope } from 'vue'
import TkButton from '../components/TkButtons/TkButton.vue'
import TkCheckBox from '../components/TkCheckBox/TkCheckBox.vue'
import TkToggleSwitch from '../components/TkToggleSwitch/TkToggleSwitch.vue'
import { useWindowing } from '../composables/useWindowing'
import type { ManagedWindowHandle } from '../composables/useWindowing'

type DemoComponent = 'windowing-demo-message' | 'windowing-demo-counter'

const useParent = ref(false)
const showInTaskbar = ref(true)
const isModal = ref(false)
const isResizable = ref(true)
const isAlwaysOnTop = ref(false)
const showInactive = ref(false)

const managedWindow = shallowRef<ManagedWindowHandle | null>(null)
const activeComponent = ref<DemoComponent>('windowing-demo-message')
const isContentReady = ref(false)
const isChecked = ref(false)
const isAlternateMessage = ref(false)
const counterStep = ref(1)
const isLargeWindow = ref(false)
const openError = ref('')
let windowScope: EffectScope | null = null
let disposed = false

const isOpening = computed(() => managedWindow.value?.isOpening.value ?? false)
const isOpened = computed(() => managedWindow.value?.isOpened.value ?? false)
const windowStatus = computed(() => {
  if (isOpening.value) return 'Opening'
  if (isOpened.value) return isContentReady.value ? 'Opened' : 'Loading content'
  return managedWindow.value?.isClosed.value ? 'Closed' : 'Not opened'
})

const messageProps = computed(() =>
  isAlternateMessage.value
    ? { title: 'Updated from the opener', message: 'The same component is displaying a different set of props.' }
    : { title: 'Hello from a managed window', message: 'Change this message or switch to the counter from the opener.' }
)

watch(useParent, (value) => {
  if (!value) isModal.value = false
})

watch(isModal, (value) => {
  if (value) showInactive.value = false
})

const getContentProps = (): Record<string, unknown> => {
  return activeComponent.value === 'windowing-demo-message'
    ? { ...messageProps.value }
    : { title: 'Counter window', step: counterStep.value }
}

const openWindow = async (): Promise<void> => {
  if (isOpening.value || isOpened.value) return

  windowScope?.stop()
  const scope = effectScope()
  const handle = scope.run(() => {
    const handle = useWindowing()

    handle.onClosed(() => {
      isContentReady.value = false
      scope.stop()
      if (windowScope === scope) windowScope = null
    })

    handle.onEvent<boolean>('demo:checked', (value) => {
      if (typeof value === 'boolean') isChecked.value = value
    })

    handle.onEvent<DemoComponent>('demo:ready', (component) => {
      if (!handle.isOpened.value || component !== activeComponent.value) return
      isContentReady.value = true
      handle.emitEvent('demo:checked', isChecked.value)
    })

    return handle
  })

  if (!handle) return

  windowScope = scope
  managedWindow.value = handle
  isContentReady.value = false
  isLargeWindow.value = false
  openError.value = ''

  try {
    await handle.open(
      { component: activeComponent.value, props: getContentProps() },
      {
        width: 560,
        height: 420,
        parent: useParent.value ? 'opener' : 'none',
        skipTaskbar: !showInTaskbar.value,
        modal: isModal.value,
        resizable: isResizable.value,
        alwaysOnTop: isAlwaysOnTop.value,
        showInactive: showInactive.value,
        position: useParent.value ? 'center-parent' : 'center-screen'
      }
    )
  } catch (error) {
    if (!disposed) openError.value = error instanceof Error ? error.message : String(error)
    scope.stop()
    if (windowScope === scope) windowScope = null
  }
}

const switchContent = (component: DemoComponent): void => {
  if (!isOpened.value || !isContentReady.value || component === activeComponent.value) return
  isContentReady.value = false
  activeComponent.value = component
  managedWindow.value?.updateContent({ component, props: getContentProps() })
}

const updateProps = (): void => {
  if (!isOpened.value || !isContentReady.value) return

  if (activeComponent.value === 'windowing-demo-message') {
    isAlternateMessage.value = !isAlternateMessage.value
  } else {
    counterStep.value = counterStep.value === 1 ? 5 : counterStep.value === 5 ? 10 : 1
  }

  managedWindow.value?.updateContent({ props: getContentProps() })
}

const toggleWindowSize = (): void => {
  if (!isOpened.value) return
  isLargeWindow.value = !isLargeWindow.value
  managedWindow.value?.resize(isLargeWindow.value ? 760 : 560, isLargeWindow.value ? 560 : 420)
}

const sendChecked = (value: boolean): void => {
  if (isOpened.value && isContentReady.value) managedWindow.value?.emitEvent('demo:checked', value)
}

onBeforeUnmount(() => {
  disposed = true
  if (managedWindow.value?.isOpened.value) managedWindow.value.close()
  windowScope?.stop()
})
</script>

<style scoped>
.tk-windowing-page {
  width: 100%;
  height: 100%;
  margin: 0 4px 0 0;
  padding: 0 16px 0 20px;
  overflow: auto;
}

.tk-windowing-page > .windowing-demo,
.tk-windowing-page > article {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
}

.windowing-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 0;
  border-bottom: 1px solid var(--tk-color-background-deep);

  h2,
  h3,
  p {
    margin: 0;
  }

  .demo-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .demo-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .demo-note {
    font-size: 13px;
    opacity: 0.7;
  }

  .demo-error {
    color: #ffb4b4;
  }
}
</style>
