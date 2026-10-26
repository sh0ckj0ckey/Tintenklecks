<template>
  <div class="tk-windowing-page">
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

<style scoped>
.tk-windowing-page {
  width: 100%;
  height: 100%;
  margin: 0 4px 0 0;
  padding: 0 16px 0 20px;
  overflow: auto;
}

.tk-windowing-page > article {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
}
</style>
