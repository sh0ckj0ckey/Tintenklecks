<template>
  <div class="tk-windowing-page">
    <article>
      <header>
        <h1>Windowing</h1>
        <p>
          Windowing defines a small IPC-based model for managing Electron windows in a consistent way. If a window knows another window's
          id, it can request operations on that window. The model also lets a window control itself without knowing its own id, and
          communicate with its opener without knowing the opener's id.
        </p>
      </header>

      <section>
        <h2>Core Concepts</h2>

        <h3>Managed Window</h3>
        <p>A managed window is an Electron <code>BrowserWindow</code> created and tracked by <code>WindowingManager</code>.</p>
        <p>
          <code>managedWindows</code> only contains windows opened through <code>windowing:open</code>. The <code>mainWindow</code> is
          stored separately, but it is still part of the same control surface. In other words, <code>mainWindow</code> and managed windows
          can both be controlled by id.
        </p>

        <h3>Window Host</h3>
        <p>
          A window host is the renderer-side container loaded inside a managed window. It is responsible for sending
          <code>windowing:ready</code>, receiving <code>windowing:update</code>, and mounting or updating the actual content component.
        </p>
        <p>
          A managed window has one window host. They are closely related, but they are not the same thing: the managed window is the native
          window, while the window host is the content container running inside it.
        </p>

        <h3>Opener</h3>
        <p>
          The opener is the window that sends <code>windowing:open</code>. It can be the <code>mainWindow</code> or another managed window.
        </p>
        <p>
          The opener receives the new window id when the open request completes. Because of that, it can naturally control the window it
          opened. When that window is closed, the opener receives a
          <code>windowing:window-closed</code> notice.
        </p>

        <h3>Parent</h3>
        <p>
          The parent is the native Electron parent window relationship. The opener and the parent are related by default, but they are not
          the same concept.
        </p>
        <p>
          By default, a new managed window uses its opener as the parent. The caller can set
          <code>parentId</code> to another known window id, or set it to <code>null</code> to create a window without a parent.
        </p>
      </section>

      <section>
        <h2>Id Defaults</h2>

        <h3>Control Requests</h3>
        <p>
          For control requests such as <code>close</code>, <code>activate</code>, <code>minimize</code>, <code>maximize</code>,
          <code>restore</code>, <code>resize</code>, <code>move</code>, <code>topmost</code>, and <code>get-window-state</code>, an omitted
          <code>targetId</code> means the request applies to the sender window itself.
        </p>

        <h3>Event Requests</h3>
        <p>
          For <code>windowing:event</code>, an omitted <code>targetId</code> means the event is sent to the opener of the sender window.
        </p>

        <h3>Event Notices</h3>
        <p>For delivered event notices, an omitted <code>fromId</code> means the event came from the opener of the receiving window.</p>

        <p>
          These defaults keep common flows simple: a window does not need to know its own id to control itself, and a managed window does
          not need to know its opener id to send events back to it.
        </p>
      </section>

      <section>
        <h2>Open Flow</h2>
        <ol>
          <li>The opener sends <code>windowing:open</code>.</li>
          <li><code>WindowingManager</code> creates a new managed window.</li>
          <li>The managed window loads its window host.</li>
          <li>The window host sends <code>windowing:ready</code>.</li>
          <li><code>WindowingManager</code> resolves the original open request.</li>
          <li>The opener receives the new window id.</li>
          <li>The opener sends <code>windowing:update</code> with the content component and props.</li>
          <li>The window host mounts or updates the actual content component.</li>
          <li>Later interaction is handled through <code>windowing:event</code>.</li>
        </ol>
        <p>
          <code>windowing:ready</code> only means the window host is ready. It does not mean the final business content has already been
          mounted.
        </p>
      </section>

      <section>
        <h2>Messages</h2>

        <dl>
          <dt><code>windowing:open</code></dt>
          <dd>
            Requests the main process to create a managed window. The response is returned after the window is created and its host sends
            <code>windowing:ready</code>.
          </dd>

          <dt><code>windowing:ready</code></dt>
          <dd>
            Notifies the main process that the window host is ready. The sender window is resolved from
            <code>event.sender</code>, so no window id is needed.
          </dd>

          <dt><code>windowing:update</code></dt>
          <dd>
            Updates the content component and props mounted by a managed window host.
            <code>targetId</code> is required.
          </dd>

          <dt><code>windowing:event</code></dt>
          <dd>
            Forwards an event to another window. If <code>targetId</code> is omitted, the event is sent to the sender window's opener.
          </dd>

          <dt><code>windowing:close</code></dt>
          <dd>Closes a window. If <code>targetId</code> is omitted, the sender window is closed.</dd>

          <dt><code>windowing:activate</code></dt>
          <dd>Activates a window. If <code>targetId</code> is omitted, the sender window is activated.</dd>

          <dt><code>windowing:minimize</code></dt>
          <dd>Minimizes a window. If <code>targetId</code> is omitted, the sender window is minimized.</dd>

          <dt><code>windowing:maximize</code></dt>
          <dd>Maximizes a window. If <code>targetId</code> is omitted, the sender window is maximized.</dd>

          <dt><code>windowing:restore</code></dt>
          <dd>Restores a window. If <code>targetId</code> is omitted, the sender window is restored.</dd>

          <dt><code>windowing:resize</code></dt>
          <dd>Resizes a window. If <code>targetId</code> is omitted, the sender window is resized.</dd>

          <dt><code>windowing:move</code></dt>
          <dd>Moves a window. If <code>targetId</code> is omitted, the sender window is moved.</dd>

          <dt><code>windowing:topmost</code></dt>
          <dd>Sets whether a window is always on top. If <code>targetId</code> is omitted, the sender window is updated.</dd>

          <dt><code>windowing:get-window-state</code></dt>
          <dd>Queries the current state of a window. If <code>targetId</code> is omitted, the sender window is queried.</dd>

          <dt><code>windowing:window-state-changed</code></dt>
          <dd>Notifies a window that its state has changed. The notice contains a <code>state</code> object.</dd>

          <dt><code>windowing:window-closed</code></dt>
          <dd>Notifies the opener that one of the windows it opened has been closed.</dd>
        </dl>
      </section>

      <section>
        <h2>Data Model</h2>

        <dl>
          <dt><code>WindowId</code></dt>
          <dd>A number mapped to <code>Electron.BrowserWindow.id</code>.</dd>

          <dt><code>WindowContentProps</code></dt>
          <dd>A generic property object passed to a window content component.</dd>

          <dt><code>WindowPosition</code></dt>
          <dd>
            Supports <code>'center-screen'</code>, <code>'center-parent'</code>, or an absolute <code>{ x, y }</code> screen position.
          </dd>

          <dt><code>WindowState</code></dt>
          <dd>
            Describes <code>bounds</code>, <code>minimized</code>, <code>maximized</code>, <code>fullscreen</code>, <code>visible</code>,
            <code>alwaysOnTop</code>, and <code>focused</code>.
          </dd>

          <dt><code>WindowingOpenRequest</code></dt>
          <dd>
            Describes how to create a managed window, including size, taskbar behavior, resizability, topmost state, modal behavior, parent,
            position, and inactive showing.
          </dd>

          <dt><code>WindowingOpenResponse</code></dt>
          <dd>Returned after the managed window is created and ready. It contains the new window id.</dd>

          <dt><code>WindowingUpdateRequest</code></dt>
          <dd>Updates the content mounted by a managed window host.</dd>

          <dt><code>WindowingEventRequest</code></dt>
          <dd>Forwards an action and optional payload to another window.</dd>

          <dt><code>WindowingEventNotice</code></dt>
          <dd>Delivered when a forwarded event reaches its target window.</dd>

          <dt><code>WindowingClosedNotice</code></dt>
          <dd>Contains the id of a closed window.</dd>
        </dl>
      </section>

      <section>
        <h2>Summary</h2>
        <p>
          The model keeps window management explicit but lightweight. A window can open another window, the opener owns that relationship
          logically, the parent controls the native Electron parent relationship, and the window host manages the renderer-side content.
          Sender-based defaults keep self-control and opener communication simple.
        </p>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.tk-windowing-page {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
