# Stimulus Bootstrap Behaviors

Stimulus controllers for Bootstrap interfaces, without Bootstrap JavaScript.

## Features

- Bootstrap CSS only
- No jQuery
- No Bootstrap JavaScript
- Hotwire/Turbo friendly
- Standalone controllers

## Controllers

- Accordion
- Alert
- Collapse
- Dropdown
- Modal
- Offcanvas
- Popover
- Tabs
- Toast
- Tooltip
- Password visibility

## Usage

Register only the controllers you need.

```js
import DropdownController from './ui/dropdown_controller'

application.register('ui--dropdown', DropdownController)
```

```html
<div class="dropdown" data-controller="ui--dropdown">
  <button
    class="btn btn-secondary dropdown-toggle"
    data-ui--dropdown-target="trigger"
    data-action="click->ui--dropdown#toggle"
  >
    Menu
  </button>

  <div class="dropdown-menu" data-ui--dropdown-target="menu">
    <a class="dropdown-item" href="#">Action</a>
  </div>
</div>
```

Each controller includes a minimal expected HTML example in the file.

## Requirements

- Stimulus 3+
- Bootstrap 5 CSS

## License

[MIT](LICENSE)
