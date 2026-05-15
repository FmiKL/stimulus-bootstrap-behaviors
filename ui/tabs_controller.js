/**
 * Tabs Controller
 *
 * Expected HTML:
 *
 * <div data-controller="ui--tabs">
 *   <a data-ui--tabs-target="tab" href="#pane1" data-action="click->ui--tabs#show">Tab</a>
 *   <div data-ui--tabs-target="panel" id="pane1" class="tab-pane fade"></div>
 * </div>
 */

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['tab', 'panel']

  show(event) {
    event.preventDefault()

    const clickedTab = event.currentTarget
    const targetSelector = clickedTab.getAttribute('href')
    const targetPanel = this.panelTargets.find(
      panel => `#${panel.id}` === targetSelector
    )

    if (!targetPanel) return

    this.tabTargets.forEach(tab => tab.classList.remove('active'))

    this.panelTargets.forEach(panel => {
      panel.classList.remove('show', 'active')
    })

    clickedTab.classList.add('active')

    targetPanel.classList.add('active')

    requestAnimationFrame(() => {
      targetPanel.classList.add('show')
    })
  }
}
