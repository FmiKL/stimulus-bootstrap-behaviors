/**
 * Tabs Controller
 *
 * Expected HTML:
 *
 * <div data-controller="ui--tabs">
 *   <a data-ui--tabs-target="tab" href="#pane1" data-action="click->ui--tabs#show">Tab</a>
 *   <div data-ui--tabs-target="panel" id="pane1" class="tab-pane fade"></div>
 * </div>
 *
 * Behavior:
 *  - Mimics Bootstrap's tab switching logic
 *  - Applies .active/.show classes to tabs and panels
 *  - Supports .fade transitions (Bootstrap CSS)
 */

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['tab', 'panel']

  show(event) {
    event.preventDefault()

    const clickedTab = event.currentTarget
    const targetSelector = clickedTab.getAttribute('href')
    const targetPanel = this.panelTargets.find(panel => `#${panel.id}` === targetSelector)

    if (!targetPanel) return

    // deactivate all tabs
    this.tabTargets.forEach(tab => tab.classList.remove('active'))

    // deactivate all panels
    this.panelTargets.forEach(panel => {
      panel.classList.remove('show', 'active')
    })

    // activate clicked tab
    clickedTab.classList.add('active')

    // activate panel
    targetPanel.classList.add('active')
    
    // fade animation is handled by Bootstrap's CSS
    requestAnimationFrame(() => {
      targetPanel.classList.add('show')
    })
  }
}
