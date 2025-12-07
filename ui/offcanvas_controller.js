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
  }

  open(event) {
    event?.preventDefault()
    this.trigger = event?.currentTarget

    const panel = this.panelTarget
    if (panel.classList.contains('show')) return

    const index = ++this.constructor.openCount
    const zIndex = 1050 + index * 2

    // backdrop
    this.backdrop = document.createElement('div')
    this.backdrop.className = 'offcanvas-backdrop fade'
    this.backdrop.style.zIndex = zIndex
    document.body.appendChild(this.backdrop)

    requestAnimationFrame(() => {
      this.backdrop.classList.add('show')
    })

    // panel
    panel.style.zIndex = zIndex + 1
    panel.style.visibility = 'visible'
    panel.classList.add('show')

    document.body.style.overflow = 'hidden'

    this.backdrop.addEventListener('click', this.close)
    document.addEventListener('keydown', this.escape)
  }

  close() {
    const panel = this.panelTarget
    if (!panel.classList.contains('show')) return

    panel.classList.remove('show')
    this.backdrop?.classList.remove('show')

    setTimeout(() => {
      this.backdrop?.remove()
      this.constructor.openCount--

      if (this.constructor.openCount === 0) {
        document.body.style.overflow = ''
      }
    }, 150)

    document.removeEventListener('keydown', this.escape)

    this.trigger?.dispatchEvent(
      new CustomEvent('offcanvas:closed', { bubbles: true })
    )
  }

  escape(event) {
    if (event.key === 'Escape') this.close()
  }
}
