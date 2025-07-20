# Technické specifikace projektu

## Optimalizace obrázků a Lazy Load

Pro optimalizaci obrázků a implementaci lazy loadingu v projektu Next.js doporučujeme používat vestavěnou komponentu `next/image`. Tato komponenta poskytuje automatickou optimalizaci velikosti, formátu a lazy loadingu obrázků, což vede ke zlepšení výkonu a rychlejšímu načítání stránek.

### Jak používat `next/image`

1.  **Importujte komponentu:** Na začátku souboru, kde chcete použít obrázek, importujte `Image` z `next/image`:

    ```jsx
    import Image from 'next/image';
    ```

2.  **Nahraďte `<img>` tag:** Nahraďte standardní `<img>` tag komponentou `Image`. Místo atributu `src` použijte prop `src`. Dále je nutné specifikovat `width` a `height` obrázku.

    ```jsx
    // Místo:
    // <img src="/path/to/your/image.jpg" alt="Popis obrázku" />

    // Použijte:
    <Image
      src="/path/to/your/image.jpg"
      alt="Popis obrázku"
      width={500} // Zadejte šířku obrázku v pixelech
      height={300} // Zadejte výšku obrázku v pixelech
    />
    ```

3.  **Konfigurace domén obrázků (pokud načítáte z externích zdrojů):** Pokud načítáte obrázky z externích URL, musíte nakonfigurovat domény v souboru `next.config.js`:

    ```javascript
    module.exports = {
      images: {
        domains: ['example.com', 'anotherdomain.com'],
      },
    };
    ```

### Přínosy použití `next/image`

*   **Automatický Lazy Load:** Obrázky se načtou až v momentě, kdy se objeví v zobrazení uživatele (viewportu), což zrychluje počáteční načítání stránky.
*   **Optimalizace velikosti a formátu:** `next/image` automaticky servíruje obrázky v optimalizované velikosti a moderních formátech (např. WebP), pokud je prohlížeč podporuje.
*   **Prevence CLS (Cumulative Layout Shift):** Zadáním `width` a `height` se před načtením obrázku vyhradí místo, což zabraňuje posunu obsahu stránky.
*   **Prioritní načítání:** Pomocí prop `priority` můžete určit, které obrázky jsou klíčové pro počáteční zobrazení stránky a měly by se načíst s vyšší prioritou.

Použitím `next/image` zajistíte, že vaše ilustrace a obrázky budou načítány efektivně a pozitivně ovlivní výkon a SEO vašeho webu.