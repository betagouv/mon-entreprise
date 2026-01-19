# 📋 Ajout du support trimestriel au simulateur Auto-entrepreneur

## 🎯 Objectif
Ajouter un onglet "Trimestriel" au simulateur auto-entrepreneur pour permettre aux utilisateurs de saisir leur chiffre d'affaires par trimestre avec des résultats cohérents affichés par trimestre.

## ✅ Implémentation complète

### 1️⃣ Support du type unitaire `€/trimestre`

**Fichier:** `site/source/domaine/Unités.ts`
- ✅ Ajout de `'€/trimestre'` au type `UnitéMonétaireRécurrente`
- ✅ Ajout de `'€/trimestre'` à la liste `UNITÉS_MONÉTAIRES`

### 2️⃣ Fonctions de conversion et constructeurs

**Fichier:** `site/source/domaine/Montant.ts`

Ajoutées :
- ✅ `eurosParTrimestre(valeur: number)` - Crée un montant en €/trimestre
- ✅ `estEuroParTrimestre(montant)` - Type guard pour vérifier si c'est €/trimestre
- ✅ `toEurosParTrimestre(montantRécurrent)` - Convertit vers €/trimestre
- ✅ Mise à jour de `toEurosParMois()` - Ajoute la branche €/trimestre (÷3)
- ✅ Mise à jour de `toEurosParAn()` - Ajoute la branche €/trimestre (×4)
- ✅ Mise à jour de `toEurosParJour()` - Ajoute la branche €/trimestre
- ✅ Mise à jour de `toEurosParHeure()` - Ajoute la branche €/trimestre

**Logique de conversion :**
```
1 trimestre = 3 mois = 1/4 an = 365/4 jours = 24×365/4 heures
```

### 3️⃣ Adaptateur Publicodes

**Fichier:** `site/source/domaine/engine/MontantAdapter.ts`
- ✅ Import de `eurosParTrimestre`
- ✅ Ajout du case `'€/trimestre'` dans la fonction `decode`

### 4️⃣ Traductions i18n

**Fichier:** `site/source/locales/ui-fr.yaml`
```yaml
Montant trimestriel: Montant trimestriel
```

**Fichier:** `site/source/locales/ui-en.yaml`
```yaml
Montant trimestriel: Quarterly amount
```

### 5️⃣ Intégration au simulateur Auto-entrepreneur

**Fichier:** `site/source/pages/simulateurs/auto-entrepreneur/AutoEntrepreneur.tsx`

**Changements :**
- ✅ Import de `useTranslation`
- ✅ Passage d'un prop `periods` personnalisé à `PeriodSwitch` :
```tsx
<PeriodSwitch
  periods={[
    { label: t('Montant mensuel'), unit: '€/mois' },
    { label: t('Montant trimestriel'), unit: '€/trimestre' },
    { label: t('Montant annuel'), unit: '€/an' },
  ]}
/>
```

**Comportement :**
- L'onglet "Mensuel" fonctionne comme avant
- L'onglet "Trimestriel" est nouveau et affiche les résultats par trimestre
- L'onglet "Annuel" fonctionne comme avant

## 🧪 Tests

### Tests unitaires des conversions

**Fichier créé:** `site/source/domaine/Montant.trimestre.test.ts`

Couvre :
- ✅ Création d'un montant €/trimestre
- ✅ Detection avec `estEuroParTrimestre`
- ✅ Conversions trimestre → mois (÷3)
- ✅ Conversions trimestre → année (×4)
- ✅ Conversions mois → trimestre (×3)
- ✅ Conversions année → trimestre (÷4)
- ✅ Conversions croisées (conservent la valeur)
- ✅ Cas d'usage auto-entrepreneur (CA trimestriel → cotisations)

### Tests d'intégration UI

**Fichier créé:** `site/source/components/PeriodSwitch.test.tsx`

Couvre :
- ✅ Affichage des périodes par défaut (mensuel, annuel)
- ✅ Affichage des périodes personnalisées (mensuel, trimestriel, annuel)
- ✅ Sélection de la période trimestrielle
- ✅ Non-régression : fonctionnement avec 2 périodes
- ✅ Accessibilité (aria-label)

## 🔒 Garanties de cohérence

### Proportionnalité
Le calcul auto-entrepreneur est proportionnel au CA. Avec €/trimestre :

**Exemple :** CA trimestriel = 5000€
- Taux forfaitaire cotisations : 22.2%
- Cotisations trimestrielles : 5000 × 0.222 = 1110€/trimestre

**Vérification :** Même résultat en mensuel :
- CA mensuel = 5000 ÷ 3 = 1666.67€/mois
- Cotisations mensuelles = 1666.67 × 0.222 = 369.87€/mois
- Cotisations trimestrielles = 369.87 × 3 = 1109.61€ ≈ 1110€ ✓

### Pas de régression
- Tous les tests existants restent valides
- Les onglets "Mensuel" et "Annuel" ne changent pas de comportement
- Le prop `periods` de `PeriodSwitch` est optionnel (backward compatible)

## 📊 Architecture

```
Montant.ts (types + conversions)
    ↓
MontantAdapter.ts (decode Publicodes)
    ↓
Unités.ts (définition du type €/trimestre)
    ↓
Locales (traductions i18n)
    ↓
PeriodSwitch.tsx (sélecteur de période)
    ↓
AutoEntrepreneur.tsx (intégration)
```

## 🚀 Impact

- **Scope limité au simulateur auto-entrepreneur** : Les autres simulateurs n'affichent que "Mensuel" et "Annuel"
- **Pas de changement Publicodes** : Les règles de calcul existent déjà, on utilise juste une nouvelle unité
- **Pas de breakage** : `PeriodSwitch` sans prop `periods` fonctionne comme avant

## 📝 Notes pour le code review

1. Les conversions utilisent le facteur 3 pour trimestre ↔ mois et 4 pour trimestre ↔ année
2. L'arrondi au centime est géré automatiquement par `Montant.ts`
3. Le système i18n utilise la traduction existante "Montant trimestriel"
4. Les tests de conversion incluent des cas edge (valeurs non-entières)
5. Le test UI utilise `@testing-library/react` comme le reste du projet

## ✨ Prêt pour la production
Tous les fichiers ont été modifiés/créés selon les patterns du projet (types TS, i18n, tests, lint).
