/**
 * Toast Controller
 *
 * Expected HTML:
 *
 * <div
 *   class="toast fade"
 *   data-controller="ui--toast"
 *   data-ui--toast-autohide-value="true"
 *   data-ui--toast-delay-value="5000"
 * >
 *   <div class="toast-body">
 *     Toast message
 *   </div>
 * </div>
 */

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static values = {
    autohide: { type: Boolean, default: true },
    delay: { type: Number, default: 5000 }
  }

  connect() {
    if (this.isShown()) {
      this.scheduleHide()
    }
  }

  disconnect() {
    this.clearTimers()
  }

  toggle(event) {
    event?.preventDefault()
    this.isShown() ? this.hide() : this.show()
  }

  show(event) {
    event?.preventDefault()
    this.clearTimers()

    this.element.style.display = 'block'

    requestAnimationFrame(() => {
      this.element.classList.add('show')
      this.element.dispatchEvent(
        new CustomEvent('toast:shown', { bubbles: true })
      )
      this.scheduleHide()
    })
  }

  hide(event) {
    event?.preventDefault()
    this.clearTimers()

    if (!this.isShown()) return

    this.element.classList.remove('show')

    this.hideTimeout = setTimeout(() => {
      this.element.style.display = 'none'
      this.element.dispatchEvent(
        new CustomEvent('toast:hidden', { bubbles: true })
      )
    }, 150)
  }

  scheduleHide() {
    if (!this.autohideValue) return

    this.autoHideTimeout = setTimeout(() => {
      this.hide()
    }, this.delayValue)
  }

  clearTimers() {
    clearTimeout(this.autoHideTimeout)
    clearTimeout(this.hideTimeout)
  }

  isShown() {
    return this.element.classList.contains('show')
  }
}
