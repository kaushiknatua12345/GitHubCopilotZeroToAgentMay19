---
name: french-translation
description: 'English to French translation skill for OctoCAT Supply French market. Use when: translating UI text, product descriptions, error messages, documentation, or any content for French-speaking customers. Handles formal/informal registers, e-commerce terminology, gender agreement, and French localization.'
argument-hint: 'Provide English text to translate to French'
user-invocable: true
---

# English to French Translation Skill

Translate English content to flawless, natural French for the French market. This skill ensures culturally appropriate, grammatically correct translations for OctoCAT Supply's expansion into France.

## When to Use

- Translating UI labels, buttons, and navigation elements
- Converting product names and descriptions for French catalog
- Localizing error messages, notifications, and alerts
- Adapting marketing copy and promotional content
- Translating documentation, help text, and FAQs
- Converting date, time, number, and currency formats for France

## Core Translation Principles

### 1. Register Selection (Tu vs. Vous)

**Default: Formal (Vous)** for OctoCAT Supply's professional e-commerce context.

| Context | Register | Example |
|---------|----------|---------|
| Customer-facing UI | Formal (Vous) | "Consultez votre panier" |
| Error messages | Formal (Vous) | "Veuillez vérifier vos informations" |
| Marketing (friendly brand) | Informal (Tu) | "Découvre nos nouveautés" |
| Legal/Terms | Formal (Vous) | "Vous acceptez nos conditions" |

### 2. Gender Agreement Rules

French nouns have grammatical gender. Ensure:

- **Articles match gender**: le (m), la (f), les (plural)
- **Adjectives agree**: petit/petite, nouveau/nouvelle, beau/belle
- **Past participles agree** with preceding direct objects
- **Common e-commerce terms**:
  - le produit (m) → product
  - la commande (f) → order
  - le panier (m) → cart
  - la livraison (f) → delivery
  - l'article (m) → item
  - la catégorie (f) → category

### 3. E-Commerce Terminology

| English | French | Notes |
|---------|--------|-------|
| Add to cart | Ajouter au panier | Standard French e-commerce |
| Checkout | Passer commande / Finaliser | Not "checkout" |
| Shopping cart | Panier | Not "chariot" |
| Wishlist | Liste de souhaits / Favoris | Both acceptable |
| Out of stock | Rupture de stock | Industry standard |
| In stock | En stock | Direct translation works |
| Free shipping | Livraison gratuite | Never "shipping gratuit" |
| Track order | Suivre ma commande | Possessive often added |
| My account | Mon compte | |
| Log in | Se connecter | Not "login" |
| Sign up | S'inscrire / Créer un compte | |
| Order history | Historique des commandes | |
| Payment method | Mode de paiement | Not "méthode" |
| Subtotal | Sous-total | |
| Total | Total | Same in French |
| Discount | Réduction / Remise | Both acceptable |
| Promo code | Code promo | |
| Reviews | Avis | Not "revues" (different meaning) |
| Rating | Note / Évaluation | Stars = étoiles |

### 4. Cat-Themed Product Translations

OctoCAT Supply uses cat-themed terminology. Maintain the playful tone:

| English | French | Style Notes |
|---------|--------|-------------|
| Cat | Chat | Use feminine "chatte" only for female cats |
| Kitten | Chaton | |
| Meow | Miaou | French onomatopoeia |
| Paw | Patte | |
| Whiskers | Moustaches | Also means human mustache |
| Purr | Ronronner (v) / Ronronnement (n) | |
| Cat bed | Panier pour chat / Couchage chat | |
| Cat food | Nourriture pour chat / Croquettes | |
| Cat toys | Jouets pour chat | |

## Translation Procedure

### Step 1: Analyze Source Content

1. Identify the content type (UI, product, error, marketing)
2. Determine the appropriate register (formal/informal)
3. Note any technical terms requiring consistent translation
4. Check for idioms or culturally specific phrases

### Step 2: Translate with French Conventions

Apply these French-specific rules:

**Punctuation:**
- Add non-breaking space before : ; ? ! » and after «
- Use « guillemets » for quotes, not "English quotes"
- Decimal separator: comma (5,99 €)
- Thousands separator: space or non-breaking space (1 000)

**Capitalization:**
- Only first word of titles capitalized (French style)
- Days and months: lowercase (lundi, janvier)
- Languages and nationalities: lowercase adjectives (français, anglais)

**Numbers and Dates:**
- Currency after amount: 29,99 €
- Date format: JJ/MM/AAAA or "15 janvier 2025"
- Time: 24-hour format (14h30, not 2:30 PM)
- Phone numbers: +33 1 23 45 67 89

### Step 3: Localization Checks

- [ ] Gender agreement on all adjectives
- [ ] Proper accents on all characters (é, è, ê, ë, à, â, ô, ù, û, ç, œ, æ)
- [ ] Consistent terminology throughout
- [ ] Appropriate register (tu/vous)
- [ ] French punctuation spacing
- [ ] Currency/number formatting
- [ ] Date format localization

### Step 4: Quality Assurance

Avoid these common errors:

| Error Type | Wrong | Correct |
|------------|-------|---------|
| False cognate | "actuellement" for "actually" | "en fait" / "réellement" |
| False cognate | "assister" for "assist" | "aider" |
| False cognate | "attendre" for "attend" | "assister à" |
| Anglicism | "checker" | "vérifier" |
| Anglicism | "email" | "courriel" (formal) / "e-mail" (common) |
| Gender error | "le problème" | ✓ (masculine despite -e ending) |
| Register mixing | "Connecte-vous" | "Connectez-vous" (vous form) |

## Common UI Translations

### Navigation

```
English                    French
─────────────────────────────────────────
Home                       Accueil
Products                   Produits
Categories                 Catégories
About                      À propos
Contact                    Contact
Search                     Rechercher
Menu                       Menu
Back                       Retour
Next                       Suivant
Previous                   Précédent
```

### Actions

```
English                    French
─────────────────────────────────────────
Save                       Enregistrer
Cancel                     Annuler
Delete                     Supprimer
Edit                       Modifier
Submit                     Envoyer / Soumettre
Confirm                    Confirmer
Continue                   Continuer
Apply                      Appliquer
Reset                      Réinitialiser
Update                     Mettre à jour
```

### Messages

```
English                              French
───────────────────────────────────────────────────────────
Item added to cart                   Article ajouté au panier
Order confirmed                      Commande confirmée
Payment successful                   Paiement effectué
Please fill all required fields      Veuillez remplir tous les champs obligatoires
Invalid email address                Adresse e-mail invalide
Password must be at least 8 chars    Le mot de passe doit contenir au moins 8 caractères
Are you sure?                        Êtes-vous sûr(e) ?
Loading...                           Chargement...
No results found                     Aucun résultat trouvé
```

## Translation Output Format

When providing translations, use this format:

```
## Translation Result

**Source (EN):** [Original English text]

**Translation (FR):** [French translation]

**Register:** Formal (Vous) / Informal (Tu)

**Notes:**
- [Any relevant notes about terminology choices]
- [Gender considerations]
- [Cultural adaptations made]
```

## References

- [French Punctuation Rules](./references/punctuation.md)
- [E-commerce Glossary FR](./references/ecommerce-glossary.md)
- [Cat Product Terminology](./references/cat-terminology.md)

## Example Prompts

Try these prompts to use this skill:

1. "Translate our checkout page to French"
2. "Convert this product description to French: Premium cat food bowl"
3. "Translate these error messages for French users"
4. "How would we say 'Your order has been shipped' in French?"
5. "Localize the navigation menu for France"

---

*Skill maintained for OctoCAT Supply's French market expansion. For questions about specific terminology or regional variations (Belgian French, Swiss French, Canadian French), consult the team.*
