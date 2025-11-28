/**
 * Dialog Controller
 *
 * Expected HTML:
 *
 * <button
 *   data-controller="ui--dialog"
 *   data-action="click->ui--dialog#run"
 *   data-ui--dialog-message-value="Are you sure?"
 *   data-ui--dialog-confirm-value="true"
 * >
 *   Delete
 * </button>
 */

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static values = {
    message: String,
    confirm: { type: Boolean, default: false }
  }

  run(event) {
    event.preventDefault()
    this.trigger = event.currentTarget

    this.confirmValue
      ? this.openConfirm()
      : this.openAlert()
  }

  openAlert() {
    this.build({
      message: this.messageValue,
      buttons: [
        { label: 'OK', action: () => this.proceed(), class: 'btn btn-primary btn-xs' }
      ]
    })

    this.show()
  }

  openConfirm() {
    this.build({
      message: this.messageValue,
      buttons: [
        { label: 'Cancel', action: () => this.hide(), class: 'btn btn-light btn-xs' },
        { label: 'OK', action: () => this.proceed(), class: 'btn btn-primary btn-xs' }
      ]
    })

    this.show()
  }

  proceed() {
    this.hide()

    const el = this.trigger

    // form submission
    if (el.form) {
      el.form.submit()
      return
    }

    // link navigation
    if (el.tagName === 'A' && el.href) {
      window.location.href = el.href
      return
    }

    // fallback event
    el.dispatchEvent(new CustomEvent('dialog:confirmed', { bubbles: true }))
  }

  build({ message, buttons }) {
    this.root = document.createElement('div')
    this.root.className = 'ui-dialog-root'
    this.root.style.position = 'fixed'
    this.root.style.top = '0'
    this.root.style.left = '0'
    this.root.style.width = '100%'
    this.root.style.height = '100%'
    this.root.style.zIndex = '1050'
    this.root.style.pointerEvents = 'none'

    // backdrop
    this.backdrop = document.createElement('div')
    this.backdrop.className = 'position-absolute top-0 start-0 w-100 h-100'
    this.backdrop.style.background = 'rgba(0,0,0,0.1)'
    this.backdrop.style.pointerEvents = 'auto'
    this.root.appendChild(this.backdrop)

    // modal container (top alert style)
    this.modal = document.createElement('div')
    this.modal.className = 'ui-dialog-modal'
    this.modal.style.position = 'absolute'
    this.modal.style.top = '20%'
    this.modal.style.left = '50%'
    this.modal.style.maxWidth = '320px'
    this.modal.style.width = '100%'
    this.modal.style.zIndex = '1056'
    this.modal.style.opacity = '0'
    this.modal.style.transform = 'translate(-50%, -10%)'
    this.modal.style.transition = 'opacity .15s ease, transform .15s ease'
    this.modal.style.pointerEvents = 'auto'

    this.modal.innerHTML = `
      <div class="card shadow-sm border-0">
        <div class="card-body p-3">
          <div class="mb-3 js-dialog-message"></div>
          <div class="d-flex justify-content-end gap-2 js-dialog-footer"></div>
        </div>
      </div>
    `

    this.messageEl = this.modal.querySelector('.js-dialog-message')
    this.footerEl = this.modal.querySelector('.js-dialog-footer')
    this.messageEl.textContent = message

    // buttons
    buttons.forEach(btn => {
      const el = document.createElement('button')
      el.type = 'button'
      el.className = btn.class
      el.textContent = btn.label
      el.addEventListener('click', btn.action)
      this.footerEl.appendChild(el)
    })

    this.root.appendChild(this.modal)
    document.body.appendChild(this.root)
  }

  show() {
    requestAnimationFrame(() => {
      this.modal.style.opacity = '1'
      this.modal.style.transform = 'translate(-50%, 0%)'
    })
  }

  hide() {
    if (!this.root) return

    this.modal.style.opacity = '0'
    this.modal.style.transform = 'translate(-50%, -10%)'

    setTimeout(() => {
      this.root?.remove()
    }, 150)
  }
}
