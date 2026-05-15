/**
 * Collapse Controller
 *
 * Expected HTML:
 *
 * <div data-controller="ui--collapse">
 *   <button
 *     data-ui--collapse-target="trigger"
 *     data-action="click->ui--collapse#toggle"
 *     aria-controls="collapseExample"
 *     aria-expanded="false"
 *   >
 *     Toggle
 *   </button>
 *
 *   <div id="collapseExample" class="collapse" data-ui--collapse-target="panel">
 *     Content
 *   </div>
 * </div>
 */

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['trigger', 'panel']

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

    const panel = this.findPanel(event?.currentTarget)
    if (!panel) return

    this.isOpen(panel) ? this.close(panel) : this.open(panel)
  }

  open(panel = this.panelTarget) {
    if (this.isOpen(panel)) return

    panel.classList.add('collapsing')
    panel.classList.remove('collapse')
    panel.style.height = '0px'

    void panel.offsetHeight // force reflow

    panel.style.height = `${panel.scrollHeight}px`
    this.updateTriggers(panel, true)

    this.setTimer(panel, () => {
      panel.classList.remove('collapsing')
      panel.classList.add('collapse', 'show')
      panel.style.height = ''
    })
  }

  close(panel = this.panelTarget) {
    if (!this.isOpen(panel)) return

    panel.style.height = `${panel.scrollHeight}px`
    panel.classList.add('collapsing')
    panel.classList.remove('collapse', 'show')

    void panel.offsetHeight // force reflow

    panel.style.height = '0px'
    this.updateTriggers(panel, false)

    this.setTimer(panel, () => {
      panel.classList.remove('collapsing')
      panel.classList.add('collapse')
      panel.style.height = ''
    })
  }

  findPanel(trigger) {
    if (!trigger) return this.panelTarget

    const id = trigger.getAttribute('aria-controls')
    const href = trigger.getAttribute('href')

    if (id) return this.panelTargets.find(panel => panel.id === id)
    if (href?.startsWith('#'))
      return this.panelTargets.find(panel => `#${panel.id}` === href)

    return this.panelTarget
  }

  updateTriggers(panel, expanded) {
    this.triggerTargets.forEach(trigger => {
      if (!this.controlsPanel(trigger, panel)) return

      trigger.setAttribute('aria-expanded', expanded.toString())
      trigger.classList.toggle('collapsed', !expanded)
    })
  }

  controlsPanel(trigger, panel) {
    const id = trigger.getAttribute('aria-controls')
    const href = trigger.getAttribute('href')

    if (id && panel.id === id) return true
    if (href?.startsWith('#') && `#${panel.id}` === href) return true

    return this.panelTargets.length === 1
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
    this.panelTargets.forEach(panel => {
      this.updateTriggers(panel, this.isOpen(panel))
    })
  }
}
