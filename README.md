# Stimulus Bootstrap Behaviors

A lightweight collection of Stimulus controllers designed to provide interactive behaviors for Bootstrap-based interfaces without using Bootstrap JavaScript.

This project relies entirely on **Bootstrap CSS** for visuals and layout, while Stimulus handles the interactive logic. 
The goal is to keep your UI dynamic, minimal, and fully compatible with Hotwire/Turbo.

---

## Purpose

Bootstrap delivers excellent styling, but its JavaScript layer can be heavy and not aligned with modern, server-driven UI flows such as Hotwire/Turbo.

This repository offers a simple alternative:

- Use Bootstrap CSS for appearance
- Use Stimulus controllers for interaction
- No jQuery
- No Bootstrap JavaScript
- Turbo-friendly
- Framework-agnostic logic with Bootstrap class conventions

---

## Available Components

The following behaviors are currently implemented and maintained:

- **Password Visibility**
    Show/hide password fields by toggling input type and icon states.

- **Password Strength Meter**
    Simple, visual strength evaluation (0-4) integrated with Bootstrap utility classes.

- **Dropdown Toggle**
    Minimal dropdown opening/closing logic that respects Bootstrap’s `.show` class.

- **Tabs Navigation**
    Switch tab content using Bootstrap’s tab layout conventions.

- **Tooltip Visibility**
    Show/hide simple tooltips based on events, styled purely with Bootstrap CSS.

- **Popover Behavior**
    Display popovers with dynamic positioning and optional headers.

- **Scroll Behavior**
    Dynamically calculates available height for scrolling areas, considering dependencies like headers.

- **Multiselect Dropdown**
    Manage multiple selections with badges and hidden inputs.

- **Accordion**
    Expand/collapse sections with smooth animation, following Bootstrap accordion conventions.

- **Dialog Modal**
    Display alert and confirmation dialogs (OK/Cancel) using Bootstrap CSS only.

- **Content Modal**
    Show classic modal windows for any custom content, with size options and flexible layout.

- **Offcanvas**
    Show and hide side panels with backdrop, keyboard and click-to-close support, following Bootstrap offcanvas conventions.

Each behavior is implemented as a standalone Stimulus controller and can be used independently.

---

## Updating / Extending

This project is intended to evolve with Bootstrap CSS conventions and additional UI needs.  
New components or improvements are added incrementally following these principles:

- Minimal JavaScript
- No styling or overrides
- Bootstrap CSS compatibility
- Stimulus-native lifecycle and structure
- Clean and maintainable code

Contributions and suggestions are welcome as long as they follow the same design philosophy.

---

## Compatibility

- Bootstrap **5+** (CSS only)
- Stimulus **3+**
- Hotwire / Turbo
- Any build system (Vite, ESBuild, Importmap, Webpacker, etc.)

---

## License

MIT License - feel free to use, modify, and distribute.
