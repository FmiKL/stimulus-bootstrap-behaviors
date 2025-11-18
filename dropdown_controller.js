/**
 * Dropdown Controller
 *
 * Expected HTML:
 *
 * <div class="dropdown"
 *      data-controller="ui--dropdown"
 *      data-ui--dropdown-placement-value="bottom-end">
 *
 *   <a href="#"
 *      data-ui--dropdown-target="trigger"
 *      data-action="click->ui--dropdown#toggle">Toggle</a>
 *
 *   <div class="dropdown-menu fade"
 *        data-ui--dropdown-target="menu">
 *     <button data-action="click->ui--dropdown#close">Close</button>
 *   </div>
 *
 * </div>
 *
 * Behavior:
 *  - Pure Bootstrap CSS dropdown (no Bootstrap JS required)
 *  - Toggles .show on the dropdown menu
 *  - Supports placement: bottom-start, bottom-end, bottom-center
 *  - Click inside menu does NOT close it unless explicitly calling close()
 *  - Closes on outside click and Escape key
 */

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['trigger', 'menu']

  static values = {
    placement: { type: String, default: 'bottom-end' }
  }

  connect() {
    this.closeOnOutsideClick = this.closeOnOutsideClick.bind(this)
    this.closeOnEscape = this.closeOnEscape.bind(this)

    this.applyPlacement()
  }

  toggle(event) {
    event.preventDefault()
    this.menuTarget.classList.contains('show') ? this.close() : this.open()
  }

  open() {
    this.menuTarget.classList.add('show')

    // global listeners to close dropdown
    document.addEventListener('click', this.closeOnOutsideClick)
    document.addEventListener('keydown', this.closeOnEscape)
  }

  close(event) {
    if (event) event.preventDefault()

    this.menuTarget.classList.remove('show')

    // remove global listeners
    document.removeEventListener('click', this.closeOnOutsideClick)
    document.removeEventListener('keydown', this.closeOnEscape)
  }

  closeOnOutsideClick(event) {
    if (!this.element.contains(event.target)) {
      this.close()
    }
  }

  closeOnEscape(event) {
    if (event.key === 'Escape') {
      this.close()
    }
  }

  applyPlacement() {
    const menu = this.menuTarget

    // reset styles
    menu.style.position = 'absolute'
    menu.style.top = '100%'
    menu.style.left = ''
    menu.style.right = ''
    menu.style.transform = ''

    switch (this.placementValue) {
      case 'bottom-start':
        menu.style.left = '0'
        menu.style.right = 'auto'
        break

      case 'bottom-end':
        menu.style.right = '0'
        menu.style.left = 'auto'
        break

      case 'bottom-center':
        menu.style.left = '50%'
        menu.style.transform = 'translateX(-50%)'
        break
    }
  }
}
