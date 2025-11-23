/**
 * Popover Controller
 *
 * Expected HTML:
 *
 * <button
 *   data-controller="ui--popover"
 *   data-ui--popover-content-value="Popover text..."
 *   data-ui--popover-title-value="Optional title"
 *   data-ui--popover-placement-value="right"
 * >
 *   Trigger
 * </button>
 */

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static values = {
    title: String,
    content: String,
    placement: { type: String, default: 'right' }
  }

  connect() {
    this.toggle = this.toggle.bind(this)
    this.outside = this.outside.bind(this)

    this.element.addEventListener('click', this.toggle)
  }

  disconnect() {
    this.close()

    this.element.removeEventListener('click', this.toggle)
    document.removeEventListener('click', this.outside)
  }

  toggle(event) {
    event.preventDefault()
    this.popover ? this.close() : this.open()
  }

  open() {
    if (this.popover) return

    // create popover element
    this.popover = document.createElement('div')
    this.popover.className = `popover bs-popover-${this.placementValue} fade`
    this.popover.role = 'tooltip'
    this.popover.style.position = 'absolute'
    this.popover.style.zIndex = '9999'

    // optional title
    if (this.hasTitleValue && this.titleValue.trim() !== '') {
      const header = document.createElement('h3')
      header.className = 'popover-header'
      header.textContent = this.titleValue
      this.popover.appendChild(header)
    }

    // add body
    const body = document.createElement('div')
    body.className = 'popover-body'
    body.textContent = this.contentValue
    this.popover.appendChild(body)

    document.body.appendChild(this.popover)

    // compute initial position
    this.position()

    // fade animation
    requestAnimationFrame(() => {
      this.popover.classList.add('show')
    })

    // close on outside click
    document.addEventListener('click', this.outside)
  }

  close() {
    if (!this.popover) return

    this.popover.classList.remove('show')

    // wait for fade-out
    setTimeout(() => {
      this.popover?.remove()
      this.popover = null
    }, 150)

    document.removeEventListener('click', this.outside)
  }

  outside(event) {
    // ignore clicks on trigger or popover
    if (this.element.contains(event.target)) return
    if (this.popover?.contains(event.target)) return

    this.close()
  }

  position() {
    const rect = this.element.getBoundingClientRect()
    const tip = this.popover
    const margin = 8

    const w = tip.offsetWidth
    const h = tip.offsetHeight

    // simple placement logic
    const placements = {
      top: () => {
        tip.style.top = `${rect.top - h - margin + window.scrollY}px`
        tip.style.left = `${rect.left + rect.width / 2 - w / 2 + window.scrollX}px`
      },
      bottom: () => {
        tip.style.top = `${rect.bottom + margin + window.scrollY}px`
        tip.style.left = `${rect.left + rect.width / 2 - w / 2 + window.scrollX}px`
      },
      left: () => {
        tip.style.top = `${rect.top + rect.height / 2 - h / 2 + window.scrollY}px`
        tip.style.left = `${rect.left - w - margin + window.scrollX}px`
      },
      right: () => {
        tip.style.top = `${rect.top + rect.height / 2 - h / 2 + window.scrollY}px`
        tip.style.left = `${rect.right + margin + window.scrollX}px`
      }
    }

    // apply placement
    ;(placements[this.placementValue] || placements.right)()
  }
}
