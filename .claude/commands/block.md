---
name: block
description: Generate a new Strapi dynamic block component
argument-hint: "<block-name> --namespace <namespace> [--fields <fields>] [--richtext <field>]"
---

# 🚀 Commande `/block` - Générateur de Blocks Dynamiques Strapi

Génère automatiquement un block dynamique Strapi complètement fonctionnel avec type TypeScript, composant React et intégration au renderer.

## 📝 Syntaxe

```bash
/block <block-name> --namespace <namespace> [options]
```

## 🎯 Arguments

### Obligatoires

- **`<block-name>`** : Nom du block en minuscules avec tirets (ex: `hero`, `testimonial`, `feature-card`)
  - Format: kebab-case (alphanumériques + tirets)
  - Génère automatiquement le composant `{BlockName}Block`
  - Génère le chemin `src/components/dynamic-blocks/{block-name}-block.tsx`

- **`--namespace <namespace>`** : Namespace Strapi (ex: `homepage`, `article`, `common`, `products`)
  - Combine le namespace + block-name en `__component`
  - Format: `{namespace}.{block-name}` (ex: `homepage.hero`)

### Options

#### Champs simples

```bash
--fields <fields>
```

Liste des champs simples (string, number, etc.) séparés par des virgules :

```bash
/block hero --namespace homepage --fields "title,subtitle,cta-label"
```

Champs supportés :
- `fieldName` → Type simplifié automatiquement
- Utiliser des tirets pour les noms multi-mots (auto-converties en camelCase)

#### Champs richtext

```bash
--richtext <field>
```

Liste des champs richtext utilisant `BlocksContent` (pour Strapi rich text editor) :

```bash
/block description --namespace article --richtext "content"
/block hero --namespace homepage --richtext "description,body"
```

**Important:** Les champs richtext utilisent `BlocksContent` de `@strapi/blocks-react-renderer`

#### Champs image/media

```bash
--image <fields>
```

Champs d'images ou médias utilisant `StrapiImage` :

```bash
/block hero --namespace homepage --image "background,icon"
```

## 📚 Exemples d'utilisation

### Exemple 1: Block Hero simple

```bash
/block hero --namespace homepage --fields "title,subtitle" --richtext description
```

**Génère:**

- `src/types/strapi.ts` : Interface `StrapiHomepageHero` avec `__component: "homepage.hero"`
- `src/components/dynamic-blocks/hero-block.tsx` : Composant React
- Met à jour `src/components/common/block-renderer.tsx` : Case `"homepage.hero"`

**Résultat:**

```typescript
export interface StrapiHomepageHero {
  __component: "homepage.hero";
  id: number;
  title?: string;
  subtitle?: string;
  description?: BlocksContent;
}
```

### Exemple 2: Block Article Description (richtext uniquement)

```bash
/block description --namespace article --richtext content
```

**Génère le block avec un seul champ richtext `content`**

### Exemple 3: Block Testimonial avec plusieurs champs

```bash
/block testimonial --namespace common --fields "name,role,company" --richtext quote --image "avatar"
```

**Génère:**

```typescript
export interface StrapiCommonTestimonial {
  __component: "common.testimonial";
  id: number;
  name?: string;
  role?: string;
  company?: string;
  quote?: BlocksContent;
  avatar?: StrapiImage;
}
```

### Exemple 4: Block Feature Card

```bash
/block feature-card --namespace products --fields "title,badge" --richtext description --image icon
```

**Génère:**

```typescript
export interface StrapiProductsFeatureCard {
  __component: "products.feature-card";
  id: number;
  title?: string;
  badge?: string;
  description?: BlocksContent;
  icon?: StrapiImage;
}
```

## ⚙️ Fichiers générés

### Type file: `src/types/strapi.ts` (modifié)

Ajoute à la fin du fichier :

```typescript
export interface Strapi{Namespace}{BlockName} {
  __component: "{namespace}.{block-name}";
  id: number;
  // Champs simples
  {fieldName}?: string;
  // Champs richtext
  {richField}?: BlocksContent;
  // Champs images
  {imageField}?: StrapiImage;
}
```

Et met à jour le type union `StrapiBlock` pour inclure le nouveau type.

### Component file: `src/components/dynamic-blocks/{block-name}-block.tsx` (nouveau)

```typescript
import { BlockRendererClient } from "@/components/common/block-renderer-client";
import type { Strapi{Namespace}{BlockName} } from "@/types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import Image from "next/image";

interface {BlockName}BlockProps {
  block: Strapi{Namespace}{BlockName};
}

export function {BlockName}Block({ block }: {BlockName}BlockProps) {
  return (
    <section className="container mx-auto px-4 py-12">
      {/* Template automatique avec tous les champs */}
      {block.title && <h2 className="text-3xl font-bold">{block.title}</h2>}
      {block.richTextField && (
        <BlockRendererClient content={block.richTextField as BlocksContent} />
      )}
      {block.imageField && (
        <Image
          src={block.imageField.url}
          alt={block.imageField.alternativeText || ""}
          width={800}
          height={600}
        />
      )}
    </section>
  );
}
```

### BlockRenderer update: `src/components/common/block-renderer.tsx` (modifié)

Ajoute automatiquement:

```typescript
import { {BlockName}Block } from "@/components/dynamic-blocks/{block-name}-block";

// Dans le switch:
case "{namespace}.{block-name}":
  return <{BlockName}Block block={block} />;
```

## 🔍 Comportements par défaut

| Option   | Défaut        | Notes                           |
| -------- | ------------- | ------------------------------- |
| Fields   | Aucun         | Optionnel, peut être vide       |
| Richtext | Aucun         | Optionnel, peut être multiple   |
| Image    | Aucun         | Optionnel, peut être multiple   |
| Classe   | `py-12`       | Spacing standard Tailwind       |

## ✅ Validation

- ✔️ Vérifie si `{namespace}` est fourni
- ✔️ Vérifie si `{block-name}` est valide (kebab-case)
- ✔️ Vérifie si l'interface existe déjà dans `src/types/strapi.ts`
- ✔️ Vérifie si le fichier composant existe déjà
- ✔️ Valide que au moins un type de champ est fourni (fields, richtext, ou image)
- ✔️ Vérifie que le block n'est pas déjà enregistré dans block-renderer.tsx

## 🚨 Cas d'erreur

```bash
# ❌ Erreur: namespace manquant
/block hero --fields title

# ❌ Erreur: block-name invalide (doit être kebab-case)
/block heroSection --namespace homepage

# ❌ Erreur: aucun champ fourni
/block hero --namespace homepage

# ⚠️ Avertissement: block existe déjà
/block description --namespace article --richtext content
# → Demande: Voulez-vous écraser les fichiers existants? (y/n)
```

## 💡 Conseils

### Nommage des blocks

```bash
# ✅ BON: kebab-case court et descriptif
/block feature-card --namespace products
/block testimonial --namespace common
/block hero-section --namespace homepage

# ❌ MAUVAIS: camelCase, PascalCase, noms trop longs
/block heroSection --namespace homepage
/block HeroSection --namespace homepage
/block main-hero-section-with-cta --namespace homepage
```

### Organisation par namespace

```bash
# Homepage blocks
/block hero --namespace homepage
/block featured-products --namespace homepage
/block cta-section --namespace homepage

# Article blocks
/block description --namespace article
/block author-bio --namespace article
/block related-articles --namespace article

# Common blocks (réutilisables)
/block testimonial --namespace common
/block team-member --namespace common
/block faq-item --namespace common

# Products blocks
/block feature-comparison --namespace products
/block price-card --namespace products
```

### Types de champs par cas d'usage

```bash
# Simple content + richtext
/block text-section --namespace common --fields "title" --richtext content

# Card avec image et informations
/block product-card --namespace products --fields "title,price,badge" --image cover

# Testimonial complet
/block testimonial --namespace common --fields "name,role,company" --richtext quote --image avatar

# Feature section
/block feature --namespace homepage --fields "icon-label" --richtext description --image icon
```

## 🔗 Prochaines étapes

Après génération d'un block:

1. **Éditer le composant** pour affiner le rendu (styles, layout)
2. **Utiliser le block dans Strapi** en créant une nouvelle instance du block type
3. **Tester le rendu** dans la page qui utilise les blocks

Exemple après création:

```typescript
// Le block est automatiquement disponible dans les articles/pages avec blocks
// Pas besoin d'importer - le BlockRenderer gère tout !

// Dans n'importe quelle page avec des blocks:
{blocks?.map((block) => (
  <BlockRenderer key={`${block.__component}-${block.id}`} block={block} />
))}
```

## 📖 Ressources

- **Strapi Rich Text Editor**: https://docs.strapi.io/user-docs/latest/plugins/installing-plugins-via-marketplace#rich-text-editor
- **BlocksContent Type**: https://www.npmjs.com/package/@strapi/blocks-react-renderer
- **Tailwind CSS**: https://tailwindcss.com/docs/
- **React Components**: https://react.dev/

## 🎓 Bonnes pratiques

### Styles recommandés

```bash
# Spacing
py-12        # Padding vertical standard pour les sections
px-4         # Padding horizontal standard
gap-8        # Spacing entre les éléments internes

# Typography
text-3xl     # Titre h2/h3
text-lg      # Description
text-sm      # Détails secondaires

# Colors (dark mode compatible)
text-black dark:text-white           # Texte principal
text-zinc-600 dark:text-zinc-400    # Texte secondaire
```

### Composant minimal recommended

```typescript
export function CustomBlock({ block }: CustomBlockProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 space-y-4">
        {/* Utiliser BlockRendererClient pour les richtext */}
        <BlockRendererClient content={block.content as BlocksContent} />
      </div>
    </section>
  );
}
```

---

**💡 Astuce:** Utilisez `/block` pour générer rapidement la structure, puis affinez les styles et interactions dans le composant généré.

**🎯 Objectif:** Gagner du temps sur la boilerplate (types + registrations) pour vous concentrer sur le design et l'UX.
