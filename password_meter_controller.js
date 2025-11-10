/**
 * Password Meter Controller
 *
 * Expected HTML:
 *
 * <input data-ui--password-meter-target="input"
 *        data-action="input->ui--password-meter#update">
 *
 * <div data-ui--password-meter-target="bars">
 *   <div></div><div></div><div></div><div></div>
 * </div>
 *
 * Behavior:
 *  - Evaluates password strength from 0 to 4
 *  - Activates bar segments by toggling "active" classes
 */

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['input', 'bars']

  update() {
    const password = this.inputTarget.value
    const score = this.calculateStrength(password)

    const segments = this.barsTarget.children

    // reset styles
    Array.from(segments).forEach((bar, i) => {
      if (i < score) {
        bar.classList.add('bg-success')
        bar.classList.remove('bg-secondary')
      } else {
        bar.classList.add('bg-secondary')
        bar.classList.remove('bg-success')
      }
    })
  }

  calculateStrength(value) {
    let score = 0

    if (value.length >= 8) score++
    if (/[A-Z]/.test(value)) score++
    if (/[0-9]/.test(value)) score++
    if (/[^A-Za-z0-9]/.test(value)) score++

    return Math.min(score, 4)
  }
}
