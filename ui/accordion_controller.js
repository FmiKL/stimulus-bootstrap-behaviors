/**
 * Accordion Controller
 *
 * Expected HTML:
 *
 * <div data-controller="ui--accordion" data-ui--accordion-auto-close-value="true">
 *   <button data-ui--accordion-target="trigger" data-action="ui--accordion#toggle">
 *     Section 1
 *   </button>
 *   <div class="accordion-collapse collapse" data-ui--accordion-target="panel">
 *     <div class="accordion-body">Content 1</div>
 *   </div>
 *
 *   <button data-ui--accordion-target="trigger" data-action="ui--accordion#toggle">
 *     Section 2
 *   </button>
 *   <div class="accordion-collapse collapse" data-ui--accordion-target="panel">
 *     <div class="accordion-body">Content 2</div>
 *   </div>
 * </div>
 */

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['trigger', 'panel']
  static values = {
    autoClose: { type: Boolean, default: true }
  }

  connect() {
    this.timers = new Map()
    this.syncTriggers()
  }

  disconnect() {
    this.timers.forEach(timer => clearTimeout(timer))
    this.timers.clear()
  }

  toggle(event) {
    event?.preventDefault()

    const index = this.triggerTargets.indexOf(event.currentTarget)
    const panel = this.panelTargets[index]
    if (!panel) return

    this.isOpen(panel) ? this.close(panel) : this.open(panel, index)
  }

  open(panel, index) {
    if (this.autoCloseValue) {
      this.panelTargets.forEach((p, i) => {
        if (i !== index) this.close(p)
      })
    }

    if (this.isOpen(panel)) return

    panel.classList.add('collapsing')
    panel.classList.remove('collapse')

    panel.style.height = `${panel.scrollHeight}px`
    this.updateTrigger(index, true)

    this.setTimer(panel, () => {
      panel.classList.remove('collapsing')
      panel.classList.add('collapse', 'show')
      panel.style.height = ''
    })
  }

  close(panel) {
    if (!this.isOpen(panel)) return

    const height = panel.scrollHeight

    panel.style.height = `${height}px`
    panel.classList.add('collapsing')
    panel.classList.remove('collapse', 'show')

    void panel.offsetHeight // force reflow

    panel.style.height = '0px'
    this.updateTrigger(this.panelTargets.indexOf(panel), false)

    this.setTimer(panel, () => {
      panel.classList.remove('collapsing')
      panel.classList.add('collapse')
      panel.style.height = ''
    })
  }

  isOpen(panel) {
    return panel.classList.contains('show')
  }

  setTimer(panel, callback) {
    this.clearTimer(panel)

    const timer = setTimeout(() => {
      this.timers.delete(panel)
      callback()
    }, 150)

    this.timers.set(panel, timer)
  }

  clearTimer(panel) {
    const timer = this.timers.get(panel)
    if (!timer) return

    clearTimeout(timer)
    this.timers.delete(panel)
  }

  syncTriggers() {
    this.panelTargets.forEach((panel, index) => {
      this.updateTrigger(index, this.isOpen(panel))
    })
  }

  updateTrigger(index, expanded) {
    const trigger = this.triggerTargets[index]
    if (!trigger) return

    trigger.setAttribute('aria-expanded', expanded.toString())
    trigger.classList.toggle('collapsed', !expanded)
  }
}
