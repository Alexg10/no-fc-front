---
name: commit
description: Create a git commit with proper gitmoji formatting
allowed-tools:
  - Bash(git add:*)
  - Bash(git status:*)
  - Bash(git diff:*)
  - Bash(git commit:*)
  - Bash(git log:*)
argument-hint: "[message]"
---

## Current Git Context

**Current branch:** `git branch --show-current`

**Current status:**
```
`git status`
```

**Changes to be committed:**
```
`git diff --cached`
```

**Unstaged changes:**
```
`git diff HEAD`
```

**Recent commits:**
```
`git log --oneline -10`
```

---

# 📝 Guide de la commande /commit

Guide pour générer des messages de commit Git professionnels et standardisés avec gitmoji.

## 🎯 Structure obligatoire

```
<emoji> <type>: <message>
```

## 📋 Types et émojis (gitmoji)

### ✨ Fonctionnalités & Code

- ✨ **feat**: Nouvelle fonctionnalité
- 🐛 **fix**: Correction de bug
- 🚑️ **hotfix**: Correction critique urgente
- ♻️ **refactor**: Refactorisation du code
- ⚡️ **perf**: Amélioration des performances
- 🔥 **remove**: Suppression de code/fichiers

### 📚 Documentation & Configuration

- 📝 **docs**: Documentation uniquement
- 💄 **style**: UI/UX et mise en forme visuelle
- 🎨 **format**: Format/structure du code (pas de logique)
- ⚙️ **config**: Fichiers de configuration
- 🔧 **chore**: Tâches diverses (build, outils)

### 🧪 Tests & Qualité

- ✅ **test**: Ajout/modification de tests
- 🧪 **experiment**: Code expérimental
- 🚨 **lint**: Corrections linter/warnings

### 🏗️ Structure & Dépendances

- 🏗️ **build**: Système de build
- 📦 **deps**: Ajout de dépendances
- ⬆️ **upgrade**: Mise à jour de dépendances
- ⬇️ **downgrade**: Downgrade de dépendances
- ➕ **add-dep**: Ajout dépendance spécifique
- ➖ **remove-dep**: Suppression dépendance

### 🔒 Sécurité & CI/CD

- 🔒️ **security**: Sécurité/vulnérabilités
- 👷 **ci**: CI/CD et intégration continue
- 🚀 **deploy**: Déploiement

### 🌐 Internationalisation & Accessibilité

- 🌐 **i18n**: Internationalisation/traduction
- ♿️ **a11y**: Accessibilité

### 💾 Base de données & Migration

- 🗃️ **db**: Base de données
- 🚚 **move**: Déplacement/renommage fichiers

### ⏪ Gestion de versions

- ⏪️ **revert**: Annulation de commit
- 🔀 **merge**: Fusion de branches
- 🏷️ **release**: Nouvelle version/tag

### 🚧 En cours

- 🚧 **wip**: Travail en cours (à éviter en prod)
- 💩 **poo**: Code temporaire à améliorer

## ✅ Règles de rédaction

1. **Message court**: 50-72 caractères maximum
2. **Impératif**: "Add" pas "Added" ou "Adds"
3. **Pas de point final** dans le titre
4. **Première lettre en majuscule** après le type
5. **Langue**: Anglais de préférence (ou français cohérent dans tout le projet)
6. **Spécifique**: Dire CE QUI change, pas comment

## ❌ Mauvais exemples

```bash
fix stuff
Updated files
feat: j'ai ajouté une nouvelle fonctionnalité super cool avec plein de trucs
🐛 Fixed the bug in the login system that was causing issues
```

## ✅ Bons exemples

```bash
✨ feat: Add user authentication
🐛 fix: Resolve memory leak in cache
📝 docs: Update installation guide
⚡️ perf: Optimize database queries
🔒️ security: Patch XSS vulnerability
♻️ refactor: Simplify user service logic
🎨 format: Apply prettier to components
✅ test: Add unit tests for API routes
🚀 deploy: Configure production environment
```

## 🎯 Utilisation

### Avec la commande `/commit`

Décrivez simplement vos changements et le système générera automatiquement le message de commit approprié.

**Exemple:**

```
/commit j'ai ajouté l'authentification par Google
→ ✨ feat: Add Google OAuth authentication
```

### Manuellement

```bash
git commit -m "✨ feat: Add user registration"
```

## 📖 Ressources

- [Gitmoji](https://gitmoji.dev/) - Guide officiel des emojis Git
- [Conventional Commits](https://www.conventionalcommits.org/) - Spécification des commits

---

**💡 Astuce**: Configurez un hook Git pre-commit pour valider automatiquement le format de vos messages de commit.
