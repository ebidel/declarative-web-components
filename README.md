# Author web components, declaratively

Custom elements and shadow DOM should be declarative. Unfortunately, both APIs
are JavaScript-based.

This repo shows how to define two custom elements, `<shadow-root>` and `<custom-element-definition>` which can be used to declaratively author a web component. Custom elements should be declarative

See [demo](demo/index.html) for full examples and live demos.

## Examples

**Example** - `<shadow-root>` tag

```
<div id="shadow-host">
  <b slot="name">Eric's</b>
  <shadow-root>
    <template>
      <slot name="name"></slot> declarative shadow dom!
    </template>
  </shadow-root>
</div>
```

What this does:

- Creates Shadow DOM from a child `<template>` and attaches the shadow root to the parent element. In this example, `<div id="shadow-host">`.

**Example** - `<custom-element-definition>` tag:

```html
<custom-element-definition name="basic-element">
  <template>
    <span>content appended by element's author (in light dom)</span>
  </template>
</custom-element-definition>
```

What this does:

- Element does not use Shadow DOM
- Element does not register itself. The page should called `customElements.define('basic-element')`.


**Example** - `<custom-element-definition>` with styles

```html
<custom-element-definition name="basic-element-styles">
  <template>
    <style>
      /* CSS selectors are prefixed/scoped b/c we're not using shadow dom. */
      basic-element h2 {
        color: blue
      }
    </style>
    <h2>basic-element: some content should be blue</h2>
  </template>
</custom-element-definition>
```

What this does:

- Element does not use Shadow DOM
- Element does not register itself. The page should called `customElements.define('basic-element-styles')`.
- Element defines styles for its light dom.

**Example** - `<custom-element-definition>` that uses shadow dom and registers itself

```html
<custom-element-definition name="my-element">
  <shadow-root>
    <template>
      <style>
        :host {
          display: block;
          color: red;
        }
        ::slotted(span) {
          color: blue;
        }
      </style>
      <div>
        <b>click me (in shadow dom)</b><br>
        <slot></slot>
      </div>
    </template>
  </shadow-root>
  <script>
    (class extends HTMLElement {
      constructor() {
        super();
        this.addEventListener('click', this.sayHi);
      }
      sayHi() {
        alert('Hi!');
      }
    })
  </script>
</custom-element-definition>
```

What this does:

- Element uses Shadow DOM
- Element auto-registers itself when defining a script in `<custom-element-definition>`.

