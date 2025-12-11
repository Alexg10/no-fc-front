---
name: service
description: Generate strapi service
---

# 🚀 Commande `/service` - Générateur de services Strapi

Génère automatiquement un service Strapi complètement fonctionnel avec type TypeScript associé.

## 📝 Syntaxe

```bash
/service <entity-name> [options]
```

## 🎯 Arguments

### Obligatoire

- **`<entity-name>`** : Nom de l'entité à créer (ex: `footer`, `navigation`, `testimonial`)
  - Génère automatiquement la fonction `get{EntityName}()`
  - Génère le type `Strapi{EntityName}`
  - Format: alphanumériques uniquement

### Options

#### Populate (relations)

```bash
--populate <relations>
```

**Formats supportés:**

1. **Simple** (tous les champs populés) :

   ```bash
   /service footer --populate links,socialMedia
   ```

   Génère: `{ links: { populate: "*" }, socialMedia: { populate: "*" } }`

2. **Avec champs spécifiques** (séparés par `:`, relations par `;`) :

   ```bash
   /service footer --populate "links:label,url,target;socialMedia:icon,platform"
   ```

   Génère:

   ```typescript
   {
     links: { fields: ["label", "url", "target"] },
     socialMedia: { fields: ["icon", "platform"] }
   }
   ```

3. **Tous les champs** :
   ```bash
   /service product --populate "images:*;category;blocks:*"
   ```
   Génère: `{ images: { populate: "*" }, category: { populate: "*" }, blocks: { populate: "*" } }`

#### Champs simples

```bash
--fields <fields>
```

Ajoute des champs simples à documenter dans le type (séparés par virgules) :

```bash
/service footer --fields title,copyright,year
```

#### Cache

```bash
--revalidate <seconds>
```

Temps de cache en secondes (défaut: `86400` = 24h) :

```bash
/service product --revalidate 3600
```

#### Endpoint custom

```bash
--endpoint <path>
```

Endpoint API Strapi personnalisé (défaut: nom de l'entité en minuscules) :

```bash
/service customFooter --endpoint footer
```

#### Configuration JSON complète

```bash
--json '<json-config>'
```

Pour des configurations avancées avec imbrication complexe :

```bash
/service navigation --json '{
  "populate": {
    "menuItems": {
      "populate": {
        "children": {
          "fields": ["label", "link", "icon"]
        }
      }
    }
  },
  "revalidate": 86400
}'
```

## 📚 Exemples

### Exemple 1: Footer simple

```bash
/service footer --populate "links:label,url,target"
```

**Génère:**

- `src/services/strapi/footerService.ts`
- `src/types/strapi/footer.ts`

**Fonction:**

```typescript
export async function getFooter(): Promise<StrapiFooter | null>;
```

### Exemple 2: Navigation complexe

```bash
/service navigation --populate "menuItems:label,icon;subItems:label,url" --revalidate 3600
```

### Exemple 3: Produit avec images et catégories

```bash
/service product --populate "images:url,alt;category:name,slug;blocks:*" --revalidate 1800
```

### Exemple 4: Configuration JSON pour structure imbriquée

```bash
/service header --json '{
  "endpoint": "header",
  "populate": {
    "logo": {
      "fields": ["url", "alt", "width", "height"]
    },
    "navigation": {
      "populate": {
        "items": {
          "fields": ["label", "link"]
        }
      }
    },
    "cta": {
      "fields": ["text", "url", "style"]
    }
  },
  "revalidate": 86400
}'
```

## ⚙️ Fichiers générés

### Service file: `src/services/strapi/{entityName}Service.ts`

```typescript
import { strapiFetch } from "@/lib/strapi";
import { Strapi{EntityName} } from "@/types/strapi/{entityName}";
import qs from "qs";

export async function get{EntityName}(): Promise<Strapi{EntityName} | null> {
  const query = qs.stringify({
    populate: {
      // Configuration auto-générée basée sur vos arguments
    },
  });

  const result = await strapiFetch(`/{endpoint}?${query}`, {
    next: { revalidate: {revalidateTime} },
  });
  return result.data?.data as Strapi{EntityName};
}
```

**Caractéristiques:**

- ✅ Auto-détection automatique de la locale via `strapiFetch()`
- ✅ Cache configurable
- ✅ Gestion d'erreur gracieuse
- ✅ Types TypeScript stricts

### Type file: `src/types/strapi/{entityName}.ts`

```typescript
export interface Strapi {
  EntityName;
}
{
  id: number;
  // Champs auto-générés basés sur --fields
  // Relations auto-documentées basés sur --populate
}
```

## 🔍 Comportements par défaut

| Option     | Défaut                    | Notes                             |
| ---------- | ------------------------- | --------------------------------- |
| Endpoint   | Nom d'entité (minuscules) | Ex: `footer` pour entité `footer` |
| Populate   | `*` (tous les champs)     | Si `--populate` non spécifié      |
| Revalidate | `86400` (24h)             | Comme pour le menu                |
| Type       | Single Type               | Non-collection                    |

## ✅ Validation

- ✔️ Vérifie si le fichier service existe déjà (demande confirmation)
- ✔️ Vérifie si le fichier type existe déjà (demande confirmation)
- ✔️ Valide le nom d'entité (alphanumériques + tirets/underscores)
- ✔️ Valide le JSON si fourni
- ✔️ Valide que revalidate est un nombre positif

## 🚨 Cas d'erreur

```bash
# ❌ Erreur: nom d'entité vide
/service --populate links

# ❌ Erreur: JSON invalide
/service footer --json '{populate: {links}}'

# ❌ Erreur: revalidate n'est pas un nombre
/service footer --revalidate "not-a-number"

# ⚠️ Avertissement: fichiers existent déjà
/service footer --populate links
# → Demande: Voulez-vous écraser les fichiers existants? (y/n)
```

## 💡 Conseils

### Populate avec wildcard

Utilisez `:*` pour populer tous les champs d'une relation :

```bash
/service product --populate "images:*;category:name,slug"
```

### Revalidate par type de données

- **Données statiques** (menu, footer) : `86400` (24h)
- **Données semi-dynamiques** (produits) : `3600` (1h)
- **Données très dynamiques** (promotions) : `300` (5 min)
- **Données temps réel** : Pas de revalidate (`0`)

### Locale auto-détectée

Tous les services générés héritent automatiquement de:

- ✅ Auto-détection de la locale courante
- ✅ Fallback à `fr` si locale non trouvée
- ✅ Fallback à défaut si `fr` non trouvé

Aucun paramètre locale à passer manuellement !

## 🔗 Prochaines étapes

Après génération, vous pouvez immédiatement utiliser :

```typescript
// Dans vos pages/composants
const footer = await getFooter();
const navigation = await getNavigation();
const product = await getProduct();
```

## 📖 En savoir plus

- **Strapi Populate** : https://docs.strapi.io/dev-docs/api/rest/guides/using-graphql#populate
- **qs.stringify()** : https://github.com/ljharb/qs#stringifying
- **Next.js ISR** : https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating
