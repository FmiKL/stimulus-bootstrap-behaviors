/**
 * Tooltip Controller
 *
 * Expected HTML:
 *
 * <button
 *   data-controller="ui--tooltip"
 *   data-ui--tooltip-content-value="Tooltip text"
 *   data-ui--tooltip-placement-value="top"
 * >
 *   Hover me
 * </button>
 */

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static values = {
    content: String,
    placement: { type: String, default: 'top' }
  }

  connect() {
    this.showTooltip = this.showTooltip.bind(this)
    this.hideTooltip = this.hideTooltip.bind(this)

    this.element.addEventListener('mouseenter', this.showTooltip)
    this.element.addEventListener('focus', this.showTooltip)
    this.element.addEventListener('mouseleave', this.hideTooltip)
    this.element.addEventListener('blur', this.hideTooltip)
  }

  disconnect() {
    this.element.removeEventListener('mouseenter', this.showTooltip)
    this.element.removeEventListener('focus', this.showTooltip)
    this.element.removeEventListener('mouseleave', this.hideTooltip)
    this.element.removeEventListener('blur', this.hideTooltip)

    this.removeTooltip()
  }

  showTooltip() {
    if (this.tooltip) return

    this.tooltip = document.createElement('div')
    this.tooltip.className = 'tooltip bs-tooltip-auto fade'
    this.tooltip.role = 'tooltip'
    this.tooltip.style.position = 'absolute'
    this.tooltip.style.zIndex = '9999'

    // inner content
    const inner = document.createElement('div')
    inner.className = 'tooltip-inner'
    inner.textContent = this.contentValue
    this.tooltip.appendChild(inner)

    document.body.appendChild(this.tooltip)

    // position before show animation
    this.positionTooltip()

    // show animation
    requestAnimationFrame(() => {
      this.tooltip.classList.add('show')
    })
  }

  hideTooltip() {
    if (!this.tooltip) return

    this.tooltip.classList.remove('show')

    // remove after fade-out
    setTimeout(() => this.removeTooltip(), 150)
  }

  removeTooltip() {
    if (!this.tooltip) return
    this.tooltip.remove()
    this.tooltip = null
  }

  positionTooltip() {
    const rect = this.element.getBoundingClientRect()
    const tip = this.tooltip
    const placement = this.placementValue

    const margin = 8

    switch (placement) {
      case 'bottom':
        tip.style.top = `${rect.bottom + margin + window.scrollY}px`
        tip.style.left = `${rect.left + rect.width / 2 - tip.offsetWidth / 2 + window.scrollX}px`
        break

      case 'left':
        tip.style.top = `${rect.top + rect.height / 2 - tip.offsetHeight / 2 + window.scrollY}px`
        tip.style.left = `${rect.left - tip.offsetWidth - margin + window.scrollX}px`
        break

      case 'right':
        tip.style.top = `${rect.top + rect.height / 2 - tip.offsetHeight / 2 + window.scrollY}px`
        tip.style.left = `${rect.right + margin + window.scrollX}px`
        break

      default: // top
        tip.style.top = `${rect.top - tip.offsetHeight - margin + window.scrollY}px`
        tip.style.left = `${rect.left + rect.width / 2 - tip.offsetWidth / 2 + window.scrollX}px`
    }
  }
}
