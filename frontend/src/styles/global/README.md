# Global styles

Global styles (styles that apply, un-scoped, to all pages and components) go in this folder. This is
great for things like resets and for styling the page body, but this isn't right for styling pages
or components; those should always be styled with CSS modules so that the styles are properly
encapsulated.

To add new global styles, add new partials to this `global` folder (stylesheets whose names start
with `_`) and add new `@use` directives to `base.scss` to make sure they're included in the set of
global styles
