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

  toggle(event) {
    const index = this.triggerTargets.indexOf(event.currentTarget)
    const panel = this.panelTargets[index]

    this.isOpen(panel) ? this.close(panel) : this.open(panel, index)
  }

  open(panel, index) {
    if (this.autoCloseValue) {
      this.panelTargets.forEach((p, i) => {
        if (i !== index) this.close(p)
      })
    }

    if (this.isOpen(panel)) return

    // open animation
    panel.classList.add('collapsing')
    panel.classList.remove('collapse')

    panel.style.height = `${panel.scrollHeight}px`

    setTimeout(() => {
      panel.classList.remove('collapsing')
      panel.classList.add('collapse', 'show')
      panel.style.height = ''
    }, 150)
  }

  close(panel) {
    if (!this.isOpen(panel)) return

    const height = panel.scrollHeight

    // close animation
    panel.style.height = `${height}px`
    panel.classList.add('collapsing')
    panel.classList.remove('collapse', 'show')

    void panel.offsetHeight // reflow

    panel.style.height = '0px'

    setTimeout(() => {
      panel.classList.remove('collapsing')
      panel.classList.add('collapse')
      panel.style.height = ''
    }, 150)
  }

  isOpen(panel) {
    return panel.classList.contains('show')
  }
}
