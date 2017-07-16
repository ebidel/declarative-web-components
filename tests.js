assert = console.assert;

// <shadow-root>
assert(document.querySelector('#sd-simple-host').shadowRoot,
       'attaches shadow root to host');
assert(!document.querySelector('#sd-simple-host > shadow-root'),
       'removes itself from host element');

// <custom-element-definition>
assert(document.querySelector('my-element').shadowRoot,
       'attaches a <shadow-root> if one is defined');
assert(!document.querySelector('basic-element').shadowRoot,
       'does not create a shadow root when not defined');
assert(document.querySelector('basic-element').children.length > 1,
       'attaches <template> DOM as light dom');

const addedEl = document.body.appendChild(document.createElement('my-element'));
addedEl.style.display = 'none';
// Wait a tick. Mutation observer timing.
setTimeout(() => {
  assert(addedEl.shadowRoot, 'element added to DOM after page load has a shadow root');
}, 0);
