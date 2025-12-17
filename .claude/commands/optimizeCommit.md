---
name: optimizeCommit
description: Optimize files staged for commit (staged changes only)
---

# ⚡ Commande `/optimizeCommit` - Optimiser les fichiers à committer

Analyse et optimise **uniquement les fichiers prêts à être commitées** (staged changes) en suivant les best practices Next.js 16 et React.

## 🎯 Objectif

Examiner les changements qui vont être committés et proposer des optimisations ciblées avant de finaliser le commit. Cela évite de committer du code non optimisé.

## 📋 Processus d'analyse

### 1. 🔍 Identification des fichiers staged

Récupère uniquement les fichiers en staging area:
```bash
git diff --cached --name-only
```

Affiche les différences staged:
```bash
git diff --cached
```

### 2. 📊 Analyse ciblée des changements

Pour chaque fichier staged, vérifie:

#### 🖥️ Server vs Client Components
- **'use client' abusif** dans les changements
- **Props drilling** qui pourrait être évité
- **Hydration inutile** introduite
- **Interactivité mal placée**

#### 🚀 App Router & Routing
- **Pas de parallel routes** dans les nouvelles pages
- **Pas d'intercepting routes** pour modales
- **Loading states absents** (loading.tsx/error.tsx)
- **Suspense boundaries manquants**

#### 📦 Data Fetching
- **Fetch waterfall** vs parallel fetching
- **Pas de cache** sur les nouvelles requêtes
- **Over-fetching** de données
- **N+1 queries** en boucle

#### 🎨 Rendering & Performance
- **Composants trop gros** (> 200 lignes)
- **Re-renders inutiles** par dépendances
- **Pas de Streaming** avec Suspense
- **Bundle size** - imports lourds côté client
- **Images non optimisées** - pas de next/image

#### 🗃️ Type Safety
- **Types insuffisants** sur les nouvelles données
- **any** utilisé inutilement
- **Null checks** manquants

### 3. ⚡ Priorité des recommandations

Ordonne par impact décroissant:
1. 🔴 **Élevé** - Blockers de performance critique
2. 🟡 **Moyen** - Améliorations importantes
3. 🟢 **Faible** - Optimisations mineures/nettoyage

## 📝 Format de réponse

````markdown
## 🔍 Analyse des changements à committer

**Fichiers staged:** X fichiers, YYY lignes de changements

### ⚠️ Problèmes identifiés

1. **[Type de problème]** dans `path/to/file.tsx`
   - Description du problème
   - Impact sur les performances
   - Violation des best practices Next.js 16

### ⚡ Optimisations proposées

#### Optimisation 1: [Titre]
**Fichier:** `path/to/file.tsx` | **Impact:** 🔴/🟡/🟢 | **Effort:** 🔴/🟡/🟢

**Avant:**
```typescript
// Code non optimisé (extrait du staging)
```

**Après:**
```typescript
// Code optimisé
```

**Gains:**
- Métrique: +/-XX%
- Métrique: +/-XX%

**Explication:**
- Pourquoi cette optimisation fonctionne
- Comment l'appliquer avant commit

### 📊 Résumé des impacts

| Métrique | Impact | Priorité |
| -------- | ------ | -------- |
| Metrique | Xx% | 🔴🟡🟢 |

### ✅ Recommandations

- [ ] Appliquer optimisation 1
- [ ] Appliquer optimisation 2
- [ ] Vérifier lint/type-check avant commit

### 💡 Comment utiliser cette analyse

1. Appliquez les optimisations proposées
2. Lancez `pnpm check` pour valider
3. Stagez à nouveau vos changements
4. Committez les changements optimisés

**Aucune optimisation requise?** → Vous pouvez committer ! 🚀

### ⏭️ Prochaines étapes

Pour chaque fichier modifié:
1. Lisez le changement dans le staging
2. Appliquez les optimisations
3. Relancez `/optimizeCommit` pour confirmation
4. Une fois satisfait, utilisez `/commit "message"`
````

## 🎯 Cas d'usage

### ✅ Utilisation recommandée

```bash
# Après avoir stagé vos fichiers avec git add
git add src/components/MyComponent.tsx
git add src/lib/api.ts

# Analysez avant de committer
/optimizeCommit

# Appliquez les optimisations proposées, puis:
/commit "feat: Add new feature"
```

### Workflow idéal

1. Modifiez vos fichiers
2. `git add` les fichiers prêts
3. `/optimizeCommit` → analyse
4. Appliquez optimisations → `git add` à nouveau
5. `/commit` → committez

## 🔍 Comportement

- ✅ Analyse **uniquement** les fichiers staged
- ✅ Ignore les fichiers unstaged/untracked
- ✅ Affiche les diffs réels du staging
- ✅ Propose des optimisations ciblées
- ✅ Pas de modification automatique
- ❌ Ne commit pas automatiquement (recommande simplement)

## 📋 Différences vs `/optimize`

| Aspect | `/optimize` | `/optimizeCommit` |
| ------ | ----------- | ----------------- |
| Portée | Codebase entière | Fichiers staged uniquement |
| Objectif | Audit complet | Pré-commit check |
| Scope | Toutes les files | Changements à committer |
| Vitesse | Plus long | Rapide et ciblé |

## 🚀 Quick Wins Next.js 16 (check avant commit)

1. ✅ Pas d'imports côté client inutiles
2. ✅ Pas de 'use client' abusif
3. ✅ Pas de fetch() sans cache (sauf SSR)
4. ✅ Composants < 200 lignes
5. ✅ Pas d'images sans next/image
6. ✅ Pas de N+1 queries
7. ✅ Types stricts (pas d'any)
8. ✅ Suspense pour le streaming

## 📚 Ressources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [Core Web Vitals](https://web.dev/vitals/)

---

**💡 Astuce**: Lancez `/optimizeCommit` juste avant de lancer `/commit` pour un code optimisé et des commits propres.
