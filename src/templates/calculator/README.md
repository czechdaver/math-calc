# Calculator Scaffold

Use this scaffold as a starting point for new calculators. Copy the files into a new route under `src/app/[locale]/calculator/<slug>/` and a component under `src/components/calculators/`.

## Files
- `page.template.tsx` — minimal Next.js page wrapper (dynamic import + suspense + error boundary)
- `CalculatorTemplateComponent.tsx` — sample calculator component using `SimpleCalculatorLayout`

## Steps
1. Duplicate the scaffold files and rename:
   - Move `page.template.tsx` to `src/app/[locale]/calculator/<slug>/page.tsx`
   - Move `CalculatorTemplateComponent.tsx` to `src/components/calculators/<Name>Calculator.tsx`
2. Replace `<slug>` and `<Name>` in filenames and imports.
3. Add i18n keys to `src/messages/cs.json` and `src/messages/en.json` under `calculators.<slug>` (see docs/templates/calculator-template.md).
4. Implement calculator-specific logic and UI inside the component.
5. Verify ads render via `AdSlot` positions (calc-header, calc-in-content, calc-sidebar, calc-sticky-bottom) if you add them.
6. Add basic tests for logic and rendering.

## Notes
- Prefer real-time calculation without a submit button.
- Validate inputs with clear inline messages.
- Keep component state minimal and serializable.
- Use `PanelHeader` for sections when `enhanced` is enabled.
- Keep SEO props filled (title, description, keywords).
