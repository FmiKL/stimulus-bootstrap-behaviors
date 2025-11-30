/**
 * Modal Controller
 *
 * Expected HTML:
 *
 * <div data-controller="ui--modal">
 *   <button
 *     data-action="ui--modal#open"
 *     data-ui--modal-content-value="Message"
 *     data-ui--modal-size-value="lg"
 *   >
 *     Open
 *   </button>
 *
 *   <div class="modal fade" tabindex="-1" data-ui--modal-target="modal">
 *     <div class="modal-dialog js-modal-dialog">
 *       <div class="modal-content">
 *         <button type="button" class="btn-close position-absolute end-0 m-3"
 *                 data-action="ui--modal#close"></button>
 *
 *         <div class="modal-body js-modal-message"></div>
 *         <div class="modal-footer js-modal-footer"></div>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 */

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static openCount = 0

  static targets = ['modal']
  static values = {
    content: String,
    confirm: { type: Boolean, default: false },
    size: String
  }

  connect() {
    this.close = this.close.bind(this)
    this.escape = this.escape.bind(this)
  }

  open(event) {
    event?.preventDefault()
    this.trigger = event?.currentTarget

    this.messageEl = this.modalTarget.querySelector('.js-modal-message')
    this.footerEl = this.modalTarget.querySelector('.js-modal-footer')
    this.dialogEl = this.modalTarget.querySelector('.js-modal-dialog')

    this.messageEl.textContent = this.contentValue
    this.footerEl.innerHTML = ''

    // size
    this.dialogEl.className = 'modal-dialog js-modal-dialog'
    if (this.hasSizeValue) {
      this.dialogEl.classList.add(`modal-${this.sizeValue}`)
    }

    // cancel
    if (this.confirmValue) {
      const cancel = document.createElement('button')
      cancel.type = 'button'
      cancel.className = 'btn btn-light btn-sm'
      cancel.textContent = 'Cancel'
      cancel.addEventListener('click', () => {
        this.close()
        this.trigger?.dispatchEvent(new CustomEvent('modal:cancelled', { bubbles: true }))
      })
      this.footerEl.appendChild(cancel)
    }

    // ok
    const ok = document.createElement('button')
    ok.type = 'button'
    ok.className = 'btn btn-primary btn-sm'
    ok.textContent = 'OK'
    ok.addEventListener('click', () => this.proceed())
    this.footerEl.appendChild(ok)

    this.show()
  }

  show() {
    const index = ++this.constructor.openCount
    const zIndex = 1050 + index * 2

    this.backdrop = document.createElement('div')
    this.backdrop.className = 'modal-backdrop fade'
    this.backdrop.style.zIndex = zIndex
    document.body.appendChild(this.backdrop)

    requestAnimationFrame(() => this.backdrop.classList.add('show'))

    const modal = this.modalTarget
    modal.style.zIndex = zIndex + 1
    modal.style.display = 'block'
    document.body.style.overflow = 'hidden'

    requestAnimationFrame(() => modal.classList.add('show'))

    this.backdrop.addEventListener('click', this.close)
    document.addEventListener('keydown', this.escape)
  }

  close() {
    const modal = this.modalTarget

    modal.classList.remove('show')
    this.backdrop.classList.remove('show')

    setTimeout(() => {
      modal.style.display = 'none'
      this.backdrop.remove()
      this.constructor.openCount--

      if (this.constructor.openCount === 0) {
        document.body.style.overflow = ''
      }
    }, 150)

    document.removeEventListener('keydown', this.escape)
  }

  escape(event) {
    if (event.key === 'Escape') this.close()
  }

  proceed() {
    this.close()

    const el = this.trigger

    // form
    if (el?.form) {
      el.form.submit()
      return
    }

    // link
    if (el?.tagName === 'A' && el.href) {
      window.location.href = el.href
      return
    }

    // event
    el?.dispatchEvent(new CustomEvent('modal:confirmed', { bubbles: true }))
  }
}
