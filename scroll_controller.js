/**
 * Scroll Controller
 *
 * Expected HTML:
 *
 * <div
 *   data-controller="ui--scroll"
 *   data-ui--scroll-dependencies-value="#header,#toolbar"
 *   data-ui--scroll-activate-value='{"default": false, "lg": true}'
 *   data-ui--scroll-offset-value="5"
 * >
 *   <!-- scrollable content -->
 * </div>
 *
 * Behavior:
 *  - Dynamically calculates available height for scrolling
 *  - Takes dependencies height into account (header, footer, etc.)
 *  - Activates based on viewport breakpoint
 *  - Recalculates on window resize
 */

import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static values = {
    dependencies: { type: String, default: '' },
    activate: { type: Object, default: { default: true } },
    offset: { type: Number, default: 0 }
  }

  connect() {
    this.handleResize = this.handleResize.bind(this)
    
    // wait for dom to be fully loaded
    requestAnimationFrame(() => {
      this.calculateHeight()
    })
    
    window.addEventListener('resize', this.handleResize)
  }

  disconnect() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize() {
    this.calculateHeight()
  }

  calculateHeight() {
    // check if scroll should be active for current breakpoint
    if (this.hasActivateValue && !this.shouldActivate()) {
      this.element.style.maxHeight = ''
      this.element.style.overflowY = ''
      return
    }

    // get element's position in viewport
    const rect = this.element.getBoundingClientRect()
    const elementTop = rect.top
    
    // calculate available height from element to bottom of viewport
    const windowHeight = window.innerHeight
    const availableHeight = (windowHeight - elementTop - this.offsetValue)

    // apply max height with scroll
    if (availableHeight > 0) {
      this.element.style.maxHeight = `${availableHeight}px`
      this.element.style.overflowY = 'auto'
    }
  }

  shouldActivate() {
    const activateConfig = this.activateValue
    
    // detect current breakpoint
    const width = window.innerWidth
    let currentBreakpoint = 'default'
    
    if (width >= 1400) {
      currentBreakpoint = 'xxl'
    } else if (width >= 1200) {
      currentBreakpoint = 'xl'
    } else if (width >= 992) {
      currentBreakpoint = 'lg'
    } else if (width >= 768) {
      currentBreakpoint = 'md'
    } else if (width >= 576) {
      currentBreakpoint = 'sm'
    }

    // check config for this breakpoint
    if (activateConfig[currentBreakpoint] !== undefined) {
      return activateConfig[currentBreakpoint]
    }
    
    if (activateConfig.default !== undefined) {
      return activateConfig.default
    }

    return true
  }
}
