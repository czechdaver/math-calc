# i18n & Localization Rules for Math-Calc

These rules must be followed for all changes involving text or user-facing content.

## 1. Core Philosophy: "Localization First"
- **Strict No-Hardcoding Policy**: Never hardcode strings in components, pages, or layouts. All text must be tokenized.
- **Reference Locale**: `cs` (Czech) is the source of truth. All keys must exist in `src/messages/cs.json` first.
- **Supported Locales**: `cs` (default), `en`, `sk`, `pl`, `hu`.

## 2. Workflow for Adding New Text
1.  **Add to Reference (`cs.json`)**:
    -   Open `src/messages/cs.json`.
    -   Add the new key under the appropriate namespace (e.g., `calculators.my_calc.title`).
    -   Use logical nesting: `feature.section.element`.
2.  **Sync to Other Locales**:
    -   Run: `npm run sync:translations`
    -   This script automatically adds the key to `en.json`, `sk.json`, etc., with a `[MISSING]` prefix.
3.  **Translate (AI Function)**:
    -   Update the other JSON files with valid translations, removing the `[MISSING]` prefix.
    -   Ensure placeholders (e.g., `{value}`) are preserved.
4.  **Implement in Code**:
    -   Use `next-intl`:
        ```tsx
        import { useTranslations } from 'next-intl';
        // ...
        const t = useTranslations('calculators.my_calc');
        return <h1>{t('title')}</h1>;
        ```

## 3. Validation (Mandatory)
Before finishing any task, you **MUST** run:
```bash
npm run validate:translations
```
This script checks:
-   **JSON Syntax**: Validates all message files.
-   **Key Parity**: Ensures all keys in `cs.json` exist in other locales.
-   **Hardcoded Strings**: Uses AST parsing to find text literals in JSX.
-   **Unused Keys**: Identifies keys defined in JSON but not used in `src/`.
-   **Interpolation**: Checks that variables like `{name}` match across languages.

## 4. Best Practices
-   **Keys**: use `snake_case` for keys (e.g., `submit_button`, not `submitButton`).
-   **Variables**: Use named interpolation (e.g., `{count} items`), not string concatenation.
-   **Plurals**: Use ICU format for plurals:
    ```json
    "items": "{count, plural, =0 {No items} one {1 item} other {# items}}"
    ```
-   **Rich Text**: For HTML inside translations (like `<b>`), use `t.rich()`.

## 5. Common Commands
-   `npm run dev`: Starts dev server.
-   `npm run sync:translations`: Propagates keys from `cs.json`.
-   `npm run validate:translations`: Runs full validation suite.
