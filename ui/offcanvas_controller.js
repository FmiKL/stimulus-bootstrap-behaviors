/**
 * Offcanvas Controller
 *
 * Expected HTML:
 *
 * <div data-controller="ui--offcanvas">
 *   <button
 *     data-action="click->ui--offcanvas#open"
 *     data-ui--offcanvas-target="trigger"
 *   >
 *     Open
 *   </button>
 *
 *   <div class="offcanvas offcanvas-end fade" tabindex="-1" data-ui--offcanvas-target="panel">
 *     <div class="offcanvas-header">
 *       <h5 class="offcanvas-title">Title</h5>
 *       <button type="button" class="btn-close" data-action="ui--offcanvas#close"></button>
 *     </div>
 *     <div class="offcanvas-body">
 *       Content
 *     </div>
 *   </div>
 * </div>
 */

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static openCount = 0

  static targets = ['panel', 'trigger']

  connect() {
    this.close = this.close.bind(this)
    this.escape = this.escape.bind(this)
    this.opened = false
    this.closing = false
  }

  disconnect() {
    clearTimeout(this.closeTimeout)
    document.removeEventListener('keydown', this.escape)
    this.backdrop?.removeEventListener('click', this.close)
    this.backdrop?.remove()

    if (this.opened) {
      this.constructor.openCount = Math.max(0, this.constructor.openCount - 1)
    }

    if (this.constructor.openCount === 0) {
      document.body.style.overflow = ''
    }

    this.panelTarget.classList.remove('show')
    this.panelTarget.style.visibility = ''
    this.opened = false
    this.closing = false
  }

  open(event) {
    event?.preventDefault()
    this.trigger = event?.currentTarget

    const panel = this.panelTarget
    if (this.opened || this.closing || panel.classList.contains('show')) return

    this.opened = true

    const index = ++this.constructor.openCount
    const zIndex = 1050 + index * 2

    this.backdrop = document.createElement('div')
    this.backdrop.className = 'offcanvas-backdrop fade'
    this.backdrop.style.zIndex = zIndex
    document.body.appendChild(this.backdrop)

    requestAnimationFrame(() => {
      this.backdrop.classList.add('show')
    })

    panel.style.zIndex = zIndex + 1
    panel.style.visibility = 'visible'
    panel.classList.add('show')

    document.body.style.overflow = 'hidden'

    this.backdrop.addEventListener('click', this.close)
    document.addEventListener('keydown', this.escape)
  }

  close() {
    const panel = this.panelTarget
    if (!this.opened || this.closing || !panel.classList.contains('show'))
      return

    this.closing = true

    panel.classList.remove('show')
    this.backdrop?.classList.remove('show')

    this.closeTimeout = setTimeout(() => {
      panel.style.visibility = ''
      this.backdrop?.remove()
      this.backdrop = null
      this.constructor.openCount = Math.max(0, this.constructor.openCount - 1)
      this.opened = false
      this.closing = false

      if (this.constructor.openCount === 0) {
        document.body.style.overflow = ''
      }

      this.trigger?.dispatchEvent(
        new CustomEvent('offcanvas:closed', { bubbles: true })
      )
    }, 150)

    this.backdrop?.removeEventListener('click', this.close)
    document.removeEventListener('keydown', this.escape)
  }

  escape(event) {
    if (event.key === 'Escape') this.close()
  }
}
