# Language Homepage

A Discourse theme component by [Communiteq](https://www.communiteq.com) that sets the default homepage based on the user's interface language.

Different homepages can be configured for logged-in users and anonymous (logged-out) visitors. This is useful for multilingual communities where each language group has its own category, tag, or topic list.

## How it works

On every full page reload the component reads the active Discourse locale, extracts the two-letter language code (e.g. `de`, `fr`), and looks it up in the configured list. If a matching entry is found, `setDefaultHomepage` is called with the configured path. If no match is found, the **first entry in the list** is used as the default fallback.

## Installation

Install as a theme component and include it in your active theme. See [How do I install a theme or theme component?](https://meta.discourse.org/t/how-do-i-install-a-theme-or-theme-component/63682) for details.

## Settings

Both settings are **object lists**. Each entry has two properties:

| Property | Description | Example |
|---|---|---|
| `language_code` | Two-letter ISO 639-1 language code | `de`, `fr`, `nl` |
| `homepage` | Discourse path to use as the homepage | `c/category-de/6676`, `tag/de/l/latest?order=created&ascending=false` |

### `logged_in_homepages`

Homepage routes for **logged-in users**, matched by language code.

Example configuration:

| language_code | homepage |
|---|---|
| `de` | `c/category-de/6676` |
| `fr` | `c/category-fr/6675` |

### `anonymous_homepages`

Homepage routes for **anonymous (logged-out) visitors**, matched by language code.

Example configuration:

| language_code | homepage |
|---|---|
| `de` | `tag/de/l/latest?order=created&ascending=false` |
| `fr` | `tag/fr/l/latest?order=created&ascending=false` |

## Notes

- The first entry in each list acts as the **default fallback** when no entry matches the current language.
- Leading slashes are stripped automatically from the homepage path.
- A trailing `&` is appended automatically when the path contains a `?` query string, which is required for Discourse to correctly apply default sort/filter parameters.
- The component uses `PreloadStore.remove("topic_list")` to ensure the topic list is reloaded with the correct parameters when the homepage changes.
