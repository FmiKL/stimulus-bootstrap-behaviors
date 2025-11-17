/**
 * Multiselect Controller
 *
 * Expected HTML:
 *
 * <div
 *   data-controller="ui--multiselect"
 *   data-ui--multiselect-selected-value='["2"]'
 * >
 *   <select
 *     name="options"
 *     data-ui--multiselect-target="select"
 *     data-action="change->ui--multiselect#updateButton"
 *   >
 *     <option value="">Choose...</option>
 *     <option value="1">Option 1</option>
 *     <option value="2">Option 2</option>
 *   </select>
 *
 *   <button
 *     type="button"
 *     data-ui--multiselect-target="addButton"
 *     data-action="ui--multiselect#add"
 *     disabled
 *   >
 *     Add
 *   </button>
 *
 *   <div data-ui--multiselect-target="badges"></div>
 * </div>
 *
 * Behavior:
 *  - Hidden input created automatically (select keeps UI only)
 *  - Adding creates a badge + disables option
 *  - Removing restores option + updates hidden field
 *  - Select resets to placeholder or first enabled option
 */

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['select', 'addButton', 'badges']
  static values = { selected: Array }

  connect() {
    this.createHiddenInput()
    this.renderInitialSelection()
    this.resetSelect()
  }

  createHiddenInput() {
    // move <select> "name" to a new hidden <input>
    const name = this.selectTarget.getAttribute('name')

    this.hiddenInput = document.createElement('input')
    this.hiddenInput.type = 'hidden'
    this.hiddenInput.name = name

    this.element.appendChild(this.hiddenInput)
    this.selectTarget.removeAttribute('name')
  }

  renderInitialSelection() {
    if (!this.hasSelectedValue) return

    this.selectedValue.forEach(value => {
      const option = this.findOption(value)
      if (!option) return

      // recreate badge on load (form re-rendering)
      this.createBadge(option.value, option.textContent)

      // prevent selecting again
      option.disabled = true
      option.selected = true

      // sync hidden field
      this.addHiddenValue(option.value)
    })
  }

  updateButton() {
    // only enable if a valid option is chosen
    this.addButtonTarget.disabled = (this.selectTarget.value === '')
  }

  add() {
    const option = this.selectTarget.selectedOptions[0]
    if (!option) return

    const value = option.value
    if (this.hasValue(value)) return

    this.createBadge(value, option.textContent)

    // disable in UI to prevent re-selection
    option.disabled = true
    option.selected = true

    // sync data
    this.addHiddenValue(value)

    // reset UI
    this.resetSelect()
  }

  remove(event) {
    const value = event.currentTarget.dataset.value

    // remove badge from DOM
    this.badgesTarget
      .querySelector(`[data-value="${value}"]`)
      ?.remove()

    // re-enable option in <select>
    const option = this.findOption(value)
    if (option) {
      option.disabled = false
      option.selected = false
    }

    // update hidden field
    this.removeHiddenValue(value)

    // reset UI
    this.resetSelect()
  }

  // --------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------

  resetSelect() {
    const options = Array.from(this.selectTarget.options)

    // placeholder first (value="")
    const placeholder = options.find(o => o.value === '' && !o.disabled)
    if (placeholder) {
      this.selectTarget.value = ''
      this.updateButton()
      return
    }

    // first enabled option
    const firstEnabled = options.find(o => !o.disabled)
    if (firstEnabled) {
      this.selectTarget.value = firstEnabled.value
    } else {
      this.selectTarget.value = ''
    }

    this.updateButton()
  }

  createBadge(value, label) {
    const badge = document.createElement('span')
    badge.dataset.value = value
    badge.className = 'badge bg-secondary d-inline-flex align-items-center gap-2'

    // add text label safely
    const textNode = document.createTextNode(label)
    badge.appendChild(textNode)

    // remove button
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'btn-close'
    btn.dataset.action = 'ui--multiselect#remove'
    btn.dataset.value = value
    badge.appendChild(btn)

    this.badgesTarget.appendChild(badge)
  }

  findOption(value) {
    return Array.from(this.selectTarget.options).find(o => o.value === value)
  }

  hasValue(value) {
    return this.hiddenValues().includes(value)
  }

  addHiddenValue(value) {
    const values = this.hiddenValues()
    values.push(value)
    this.hiddenInput.value = values.join(',')
  }

  removeHiddenValue(value) {
    this.hiddenInput.value = this.hiddenValues()
      .filter(v => v !== value)
      .join(',')
  }

  hiddenValues() {
    return this.hiddenInput.value
      ? this.hiddenInput.value.split(',')
      : []
  }
}
