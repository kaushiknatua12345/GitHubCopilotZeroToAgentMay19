# French Punctuation Rules for Translation

## Spacing Rules

French typography requires specific spacing around punctuation marks. This differs significantly from English.

### Non-Breaking Space BEFORE

Add a non-breaking space (` ` or `\u00A0`) before these marks:

| Punctuation | Example |
|-------------|---------|
| Colon `:` | Prix : 29,99 € |
| Semicolon `;` | Couleur : rouge ; taille : M |
| Question mark `?` | Comment puis-je vous aider ? |
| Exclamation `!` | Commande confirmée ! |
| Closing guillemet `»` | …comme disait « Le Chat » |
| Percent `%` | 20 % de réduction |

### Non-Breaking Space AFTER

Add a non-breaking space after:

| Punctuation | Example |
|-------------|---------|
| Opening guillemet `«` | « Votre panier est vide » |

### No Special Spacing

These follow standard rules (space after only):

- Period `.`
- Comma `,`
- Parentheses `()`
- Brackets `[]`
- Ellipsis `...` or `…`

## Quotation Marks (Guillemets)

French uses « guillemets » instead of English "quotation marks":

| English | French |
|---------|--------|
| "Hello" | « Bonjour » |
| 'single quotes' | ‹ guillemets simples › (rare) |

For nested quotes:
- English: "She said 'hello'"
- French: « Elle a dit "bonjour" »

## Apostrophes and Elision

French contracts words with apostrophes in these cases:

| Full Form | Contracted | When |
|-----------|------------|------|
| le + vowel | l' | l'article |
| la + vowel | l' | l'adresse |
| de + vowel | d' | d'accord |
| que + vowel | qu' | qu'est-ce que |
| je + vowel | j' | j'ai |
| ce + est | c'est | c'est bon |
| ne + vowel | n' | n'existe pas |

## Number Formatting

### Decimals

Use **comma** as decimal separator:
- English: 19.99
- French: 19,99

### Thousands

Use **non-breaking space** as thousands separator:
- English: 1,000,000
- French: 1 000 000

### Currency

Currency symbol comes **after** the amount with a space:
- English: €29.99 or $29.99
- French: 29,99 € or 29,99 $

### Percentages

Space before the percent sign:
- English: 20%
- French: 20 %

## Dates and Times

### Date Format

| Format | Example |
|--------|---------|
| Numeric | 15/01/2025 (DD/MM/YYYY) |
| Long | 15 janvier 2025 |
| With day | lundi 15 janvier 2025 |

**Note:** Days and months are **lowercase** in French.

### Time Format

24-hour format is standard:
- English: 2:30 PM
- French: 14 h 30 or 14h30

With minutes:
- 14 h 30 (with spaces) — formal
- 14h30 (no spaces) — common

## Capitalization Differences

### Titles and Headings

Only capitalize the first word (and proper nouns):
- English: Add To Cart
- French: Ajouter au panier

### Days and Months

Always lowercase:
- English: Monday, January
- French: lundi, janvier

### Languages and Nationalities

Adjectives are lowercase; nouns may be capitalized:
- English: French, English
- French (adj): français, anglais
- French (noun): le Français, l'Anglaise

### Official Titles

Generally lowercase unless at sentence start:
- le président de la République
- le ministre des Finances

## Special Characters

Ensure proper use of accented characters:

| Character | Name | When Used |
|-----------|------|-----------|
| é | e accent aigu | café, été |
| è | e accent grave | père, mère |
| ê | e accent circonflexe | fête, être |
| ë | e tréma | Noël, naïf |
| à | a accent grave | à, déjà |
| â | a accent circonflexe | château |
| ô | o accent circonflexe | hôtel, côté |
| î | i accent circonflexe | île, dîner |
| ï | i tréma | maïs, naïf |
| ù | u accent grave | où |
| û | u accent circonflexe | sûr, dû |
| ç | c cédille | français, ça |
| œ | o-e ligature | cœur, œuf |
| æ | a-e ligature | curriculum vitæ (rare) |

## HTML/Code Considerations

When coding French translations:

```html
<!-- Non-breaking spaces -->
Prix&nbsp;: 29,99&nbsp;€

<!-- Or using CSS -->
.french-punctuation::before {
  content: "\00A0";
}

<!-- Guillemets -->
&laquo; Bonjour &raquo;
<!-- or -->
« Bonjour »
```

## Common Mistakes to Avoid

1. **Missing spaces before colons/semicolons**
   - ❌ Prix: 29,99€
   - ✅ Prix : 29,99 €

2. **English quotation marks**
   - ❌ "Bienvenue"
   - ✅ « Bienvenue »

3. **Wrong decimal separator**
   - ❌ 19.99 €
   - ✅ 19,99 €

4. **Currency before amount**
   - ❌ €29,99
   - ✅ 29,99 €

5. **Capitalized days/months**
   - ❌ Lundi, Janvier
   - ✅ lundi, janvier
