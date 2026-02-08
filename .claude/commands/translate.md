---
name: translate
description: Translate messages from FR to EN and other languages
---

# 🌐 Commande `/translate` - Traducteur de Messages

Synchronise et traduit automatiquement les fichiers de messages JSON entre le français (source) et l'anglais ainsi que d'autres langues.

## 📝 Syntaxe

```bash
/translate [options]
```

## 🎯 Options

### Sans arguments (défaut)

```bash
/translate
```

**Comportement par défaut :**
- Parcourt tous les fichiers JSON dans `messages/fr/`
- Compare avec `messages/en/`
- Détecte les clés manquantes ou modifiées en EN
- Affiche les différences et propose les traductions
- Valide la structure JSON

### Vérifier une namespace spécifique

```bash
/translate --file metadata
/translate --file products
```

**Vérifie :** `messages/fr/[file].json` vs `messages/en/[file].json`

### Ajouter des langues supplémentaires

```bash
/translate --languages es,de,it
/translate --languages es,de,it,pt,pl
```

**Crée ou met à jour :**
- `messages/es/` (Espagnol)
- `messages/de/` (Allemand)
- `messages/it/` (Italien)
- etc.

### Mode synchronisation (met à jour les fichiers)

```bash
/translate --sync
/translate --sync --languages es,de
```

**Effectue :**
1. ✅ Synchronise la structure FR → EN
2. ✅ Traduit les clés manquantes en EN
3. ✅ Ajoute les nouvelles langues si `--languages` fourni
4. ✅ Valide tous les fichiers JSON
5. ✅ Crée des backups avant de modifier

### Mode strict (vérifie sans modifier)

```bash
/translate --strict
```

**Vérifie :**
- Structure JSON valide dans tous les fichiers
- Aucune clé manquante
- Format cohérent
- Aucune modification n'est apportée

### Rapport détaillé

```bash
/translate --report
```

**Génère un rapport complet :**
- Fichiers analysés
- Clés manquantes par langue
- Décalages de structure
- Fichiers à mettre à jour
- Statistiques

## 📚 Exemples d'utilisation

### Exemple 1: Vérification simple

```bash
/translate
```

**Résultat:**
```
✅ Analyse des messages...
📊 Résultats:
  ✅ messages/fr/metadata.json - OK
  ⚠️ messages/en/metadata.json - MISSING: articles
  ⚠️ messages/en/products.json - OUTDATED (structure différente)

🔧 Fichiers à mettre à jour: 2
💡 Lancez `/translate --sync` pour corriger automatiquement
```

### Exemple 2: Synchronisation automatique

```bash
/translate --sync
```

**Résultat:**
```
🔄 Synchronisation des messages...

Traitement:
  📝 messages/en/metadata.json
    ✅ Ajout de "articles" (traduit)
  📝 messages/en/products.json
    ✅ Synchronisation de la structure

✅ Synchronisation complète!
📦 Backup créé: .backup/messages-2024-12-27-19:15.tar.gz
```

### Exemple 3: Ajouter des langues

```bash
/translate --sync --languages es,de,it
```

**Résultat:**
```
🌐 Ajout des langues...

Langues traitées:
  🇪🇸 messages/es/ - Créé (8 fichiers)
  🇩🇪 messages/de/ - Créé (8 fichiers)
  🇮🇹 messages/it/ - Créé (8 fichiers)

✅ Langues ajoutées avec succès!
📊 Total: 24 fichiers traités
```

### Exemple 4: Rapport détaillé

```bash
/translate --report
```

**Résultat:**
```
📊 RAPPORT DE TRADUCTION

Langues présentes:
  ✅ FR (source)
  ✅ EN (complète)
  ❌ ES (manquante)
  ❌ DE (manquante)

Fichiers par langue:
  FR: 8 fichiers
  EN: 8 fichiers

Clés manquantes en EN:
  metadata.json:
    - articles.title
    - articles.description

Décalages détectés:
  ⚠️ footer.json: Structure différente en EN

Actions recommandées:
  1. Exécuter: /translate --sync
  2. Vérifier les traductions automatiques
  3. Ajouter ES et DE: /translate --sync --languages es,de
```

## 🔍 Détails techniques

### Structure de fichiers attendue

```
messages/
├── fr/                          # Source (français)
│   ├── metadata.json
│   ├── products.json
│   ├── navigation.json
│   ├── cart.json
│   ├── footer.json
│   ├── common.json
│   ├── collections.json
│   └── homepage.json
├── en/                          # Anglais
│   └── (mêmes fichiers que FR)
├── es/                          # Espagnol (optionnel)
│   └── (mêmes fichiers que FR)
└── [autre-langue]/
    └── (mêmes fichiers que FR)
```

### Format JSON attendu

```json
{
  "namespace": {
    "key": "Texte simple",
    "nested": {
      "key": "Texte avec clé imbriquée"
    },
    "withPlaceholder": "Texte avec {placeholder}"
  }
}
```

**Notes:**
- Les placeholders `{placeholder}` sont conservés
- Les espaces et sauts de ligne sont importants
- Les emojis sont supportés

### Langues supportées

| Code | Langue | Flag |
|------|--------|------|
| fr | Français | 🇫🇷 |
| en | Anglais | 🇬🇧 |
| es | Espagnol | 🇪🇸 |
| de | Allemand | 🇩🇪 |
| it | Italien | 🇮🇹 |
| pt | Portugais | 🇵🇹 |
| pl | Polonais | 🇵🇱 |
| nl | Néerlandais | 🇳🇱 |
| ja | Japonais | 🇯🇵 |
| zh | Chinois | 🇨🇳 |

## ✅ Contrôles d'intégrité

La commande vérifie automatiquement:

- ✅ Structure JSON valide
- ✅ Toutes les clés du FR sont présentes en EN
- ✅ Pas de clés orphelines en EN
- ✅ Aucun texte vide
- ✅ Placeholders cohérents
- ✅ Encodage UTF-8 correct
- ✅ Pas de fichiers dupliqués

## 🚨 Codes d'erreur

```bash
/translate
# Erreur: Le répertoire messages/fr n'existe pas
# Solution: Créez d'abord les fichiers de messages

/translate --sync
# Erreur: Impossible de créer le backup
# Solution: Vérifiez les permissions sur le disque

/translate --languages xyz
# Erreur: Langue 'xyz' non supportée
# Solution: Utilisez les codes ISO 639-1 (ex: es, de, it)
```

## 💡 Bonnes pratiques

1. **Toujours vérifier d'abord :**
   ```bash
   /translate --report  # Voir les changements
   /translate --sync     # Appliquer les changements
   ```

2. **Ajouter des langues progressivement :**
   ```bash
   /translate --sync --languages es    # Espagnol d'abord
   /translate --sync --languages de    # Puis allemand
   ```

3. **Revoir les traductions automatiques :**
   - Les traductions IA ne sont jamais 100% parfaites
   - Toujours vérifier le contexte métier
   - Adapter aux termes de votre domaine

4. **Committer séparément :**
   ```bash
   git add messages/
   git commit -m "🌐 i18n: Synchronize translations"
   ```

## 🔗 Intégration avec le workflow

**Workflow recommandé:**

1. Modifier `messages/fr/[namespace].json` (source)
2. Exécuter `/translate --sync` pour propager les changements
3. Vérifier les traductions dans `messages/en/`
4. Committer avec `/commit "🌐 i18n: Update translations"`

**Exemple complet:**

```bash
# 1. Modifiez les textes français
vim messages/fr/products.json

# 2. Synchronisez les traductions
/translate --sync

# 3. Vérifiez les fichiers modifiés
git status

# 4. Committez les changements
/commit "🌐 i18n: Update product messages"
```

## 📊 Statistiques

Après chaque exécution, la commande affiche:

```
📈 Statistiques:
  📁 Fichiers traités: 8
  🔤 Clés totales: 127
  ✅ Clés complètes: 127
  ⚠️ Clés manquantes: 0
  🔄 Clés mises à jour: 3
  ⏱️ Temps d'exécution: 1.2s
```

## 🆘 Dépannage

**Q: Les traductions semblent mauvaises?**
A: Les traductions IA sont une première étape. Editez manuellement `messages/en/` selon vos besoins.

**Q: Comment ajouter une nouvelle clé?**
A: Ajoutez-la à `messages/fr/`, puis exécutez `/translate --sync`.

**Q: Peut-on utiliser d'autres langues?**
A: Oui! Utilisez `--languages xx` où `xx` est le code ISO 639-1 de la langue.

## 📚 Ressources

- [ISO 639-1 Language Codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [JSON Format Specification](https://www.json.org/)

---

**💡 Astuce:** Lancez régulièrement `/translate --report` pour vérifier la cohérence de vos messages dans toutes les langues.
