/**
 * Navbar Controller
 *
 * Expected HTML:
 *
 * <nav data-controller="ui--navbar">
 *   <button
 *     class="navbar-toggler collapsed"
 *     data-ui--navbar-target="toggler"
 *     data-action="click->ui--navbar#toggle"
 *     aria-controls="navbarCollapse"
 *     aria-expanded="false"
 *   >
 *     <span class="navbar-toggler-icon"></span>
 *   </button>
 *
 *   <div class="collapse navbar-collapse" data-ui--navbar-target="collapse">
 *     ...
 *   </div>
 * </nav>
 */

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['collapse', 'toggler']

  connect() {
    this.outsideClose = this.outsideClose.bind(this)
  }

  toggle(event) {
    event.preventDefault()
    this.isOpen() ? this.close() : this.open()
  }

  open() {
    if (this.isOpen()) return

    // prepare collapse animation
    this.collapseTarget.classList.add('collapsing')
    this.collapseTarget.classList.remove('collapse')

    // set height to trigger CSS transition
    this.collapseTarget.style.height = `${this.collapseTarget.scrollHeight}px`

    // switch to .show after animation
    setTimeout(() => {
      this.collapseTarget.classList.remove('collapsing')
      this.collapseTarget.classList.add('collapse', 'show')
      this.collapseTarget.style.height = ''
    }, 150)

    // update aria state
    this.togglerTarget.classList.remove('collapsed')
    this.togglerTarget.setAttribute('aria-expanded', 'true')

    document.addEventListener('click', this.outsideClose)
  }

  close() {
    if (!this.isOpen()) return

    const height = this.collapseTarget.scrollHeight

    // start collapse animation
    this.collapseTarget.style.height = `${height}px`
    this.collapseTarget.classList.add('collapsing')
    this.collapseTarget.classList.remove('collapse', 'show')

    // force reflow
    void this.collapseTarget.offsetHeight

    // animate to height:0
    this.collapseTarget.style.height = '0px'

    // cleanup after animation
    setTimeout(() => {
      this.collapseTarget.classList.remove('collapsing')
      this.collapseTarget.classList.add('collapse')
      this.collapseTarget.style.height = ''
    }, 150)

    // update aria state
    this.togglerTarget.classList.add('collapsed')
    this.togglerTarget.setAttribute('aria-expanded', 'false')

    document.removeEventListener('click', this.outsideClose)
  }

  outsideClose(event) {
    // ignore clicks inside the navbar or toggler
    if (this.element.contains(event.target)) return
    this.close()
  }

  isOpen() {
    return this.collapseTarget.classList.contains('show')
  }
}
