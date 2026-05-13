/**
 * Alert Controller
 *
 * Expected HTML:
 *
 * <div class="alert alert-warning alert-dismissible fade show" data-controller="ui--alert">
 *   Alert message
 *
 *   <button
 *     type="button"
 *     class="btn-close"
 *     data-action="click->ui--alert#close"
 *   ></button>
 * </div>
 */

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  disconnect() {
    clearTimeout(this.closeTimeout)
  }

  close(event) {
    event?.preventDefault()

    if (this.closing) return
    this.closing = true

    this.element.classList.remove('show')

    this.closeTimeout = setTimeout(() => {
      this.element.dispatchEvent(new CustomEvent('alert:closed', { bubbles: true }))
      this.element.remove()
    }, 150)
  }
}
