# Utility styles

Repeatable styles (SASS mixins, SASS variables, etc.) go here. You can import the full set of utils
from any stylesheet by starting your file and use them with ease:

```scss
@use 'styles/utils' .my-class {
  background-color: utils.$color-red;
}
```

Add new utility modules for things like “colors” “fonts” “mixins” and more. Be careful about putting
global styles in here, because they’ll be duplicated in every file you import `utils` into. Instead,
define variables functions and mixins here. For more on the SCSS module system, see SASS's
[documentation for `@use`](https://sass-lang.com/documentation/at-rules/use), or hit up Luke in
Slack for a fun and spirited discussion.
