/**
 * Password Visibility Controller
 *
 * Expected HTML:
 *
 * <div data-controller="ui--password-visibility" class="position-relative">
 *   <input
 *     type="password"
 *     data-ui--password-visibility-target="input"
 *   />
 *
 *   <span
 *     data-ui--password-visibility-target="toggle"
 *     data-action="click->ui--password-visibility#toggle"
 *   >
 *     <i class="ki-duotone ki-eye-slash d-none"></i>  <!-- hidden when visible -->
 *     <i class="ki-duotone ki-eye"></i>               <!-- hidden when masked -->
 *   </span>
 * </div>
 */

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ['input', 'toggle']

  toggle() {
    const isPassword = this.inputTarget.type === 'password'
    this.inputTarget.type = isPassword ? 'text' : 'password'

    // [0] eye-slash, [1] eye
    const [eyeSlash, eye] = this.toggleTarget.querySelectorAll('i')

    if (isPassword) {
      eyeSlash.classList.add('d-none')
      eye.classList.remove('d-none')
    } else {
      eyeSlash.classList.remove('d-none')
      eye.classList.add('d-none')
    }
  }
}
