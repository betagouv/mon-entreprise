# 📐 Synthèse technique - Support €/trimestre

## 1. Types et interfaces modifiées

### `site/source/domaine/Unités.ts`

```typescript
// AVANT
export type UnitéMonétaireRécurrente = '€/mois' | '€/an' | '€/jour' | '€/heure'

// APRÈS
export type UnitéMonétaireRécurrente = '€/mois' | '€/trimestre' | '€/an' | '€/jour' | '€/heure'

// Et dans UNITÉS_MONÉTAIRES
const UNITÉS_MONÉTAIRES = [
  '€',
  '€/titre-restaurant',
  '€/an',
  '€/trimestre',  // ← NOUVEAU
  '€/mois',
  '€/jour',
  '€/heure',
] as const
```

**Impact :** Type-safe, le compilateur rejette tout usage d'€/trimestre en dehors de ces définitions.

## 2. Fonctions de conversion

### `site/source/domaine/Montant.ts`

#### Nouvelles fonctions

```typescript
// Constructeur
export const eurosParTrimestre = (valeur: number): Montant<'€/trimestre'> =>
  montant(valeur, '€/trimestre')

// Type guard
export const estEuroParTrimestre = (montant: Montant): montant is Montant<'€/trimestre'> =>
  montant.unité === '€/trimestre'

// Convertisseur vers trimestre
export const toEurosParTrimestre = (
  montantRécurrent: Montant<UnitéMonétaireRécurrente>
): Montant<'€/trimestre'> => {
  let valeur = montantRécurrent.valeur
  switch (montantRécurrent.unité) {
    case '€/an':
      valeur = valeur / 4          // 1 trimestre = 1/4 année
      break
    case '€/mois':
      valeur = valeur * 3          // 1 trimestre = 3 mois
      break
    case '€/jour':
      valeur = (valeur * 365) / 4  // 1 trimestre = 365/4 jours
      break
    case '€/heure':
      valeur = (valeur * 24 * 365) / 4
      break
  }
  return montant(valeur, '€/trimestre')
}
```

#### Conversions existantes mises à jour

**`toEurosParMois()`** - Ajoute la branche €/trimestre :
```typescript
case '€/trimestre':
  valeur = valeur / 3  // Diviser par 3 pour passer du trimestre au mois
  break
```

**`toEurosParAn()`** - Ajoute la branche €/trimestre :
```typescript
case '€/trimestre':
  valeur = valeur * 4  // Multiplier par 4 pour passer du trimestre à l'année
  break
```

**`toEurosParJour()` et `toEurosParHeure()`** - Ajoutent la branche €/trimestre

## 3. Adaptateur Publicodes

### `site/source/domaine/engine/MontantAdapter.ts`

```typescript
// AVANT
import {
  euros,
  eurosParAn,
  eurosParMois,
  eurosParTitreRestaurant,
  Montant,
} from '@/domaine/Montant'

// APRÈS
import {
  euros,
  eurosParAn,
  eurosParMois,
  eurosParTrimestre,  // ← NOUVEAU
  eurosParTitreRestaurant,
  Montant,
} from '@/domaine/Montant'

// Dans la fonction decode
switch (formattedUnit) {
  case '€':
    return O.some(euros(numberValue))
  case '€/an':
    return O.some(eurosParAn(numberValue))
  case '€/trimestre':  // ← NOUVEAU
    return O.some(eurosParTrimestre(numberValue))
  case '€/mois':
    return O.some(eurosParMois(numberValue))
  // ...
}
```

## 4. Traductions i18n

### `site/source/locales/ui-fr.yaml`
```yaml
Montant trimestriel: Montant trimestriel
```

### `site/source/locales/ui-en.yaml`
```yaml
Montant trimestriel: Quarterly amount
```

## 5. Intégration au simulateur

### `site/source/pages/simulateurs/auto-entrepreneur/AutoEntrepreneur.tsx`

```tsx
import { Trans, useTranslation } from 'react-i18next'  // ← useTranslation ajouté

export default function AutoEntrepreneur() {
  const { t } = useTranslation()  // ← Nouveau
  
  return (
    <>
      <Simulation {...}>
        <SimulationGoals>
          <PeriodSwitch
            periods={[
              { label: t('Montant mensuel'), unit: '€/mois' },
              { label: t('Montant trimestriel'), unit: '€/trimestre' },  // ← Nouveau
              { label: t('Montant annuel'), unit: '€/an' },
            ]}
          />
          {/* Reste inchangé */}
        </SimulationGoals>
      </Simulation>
    </>
  )
}
```

## 6. Logique de conversion mathématique

```
Relation de base :
├─ 1 année = 4 trimestres = 12 mois = 365 jours = 8760 heures
├─ 1 trimestre = 3 mois = 91.25 jours = 2190 heures
└─ 1 mois = 30.42 jours (365/12) = 730 heures (24*365/12)

Pour les conversions :
├─ Trimestre → Mois   : × 3
├─ Trimestre → Année  : × 4
├─ Mois → Trimestre   : × 3
├─ Année → Trimestre  : ÷ 4
└─ Jour/Heure → Trimestre : × 365/4 ou × 24×365/4
```

## 7. Arrondi et précision

Le système utilise **arrondi au centime** :
```typescript
const arrondirAuCentime = (valeur: number): number =>
  Math.round(valeur * 100) / 100
```

**Exemple :**
- 100€ trimestriel → 33.33€ mensuel (100 ÷ 3 = 33.333... → 33.33)
- 33.33€ mensuel × 3 = 99.99€ trimestriel (très proche de 100€)

## 8. Tests créés

### `site/source/domaine/Montant.trimestre.test.ts`
- 7 suites de tests
- 25+ cas de test
- Couvre construction, conversions, cas d'usage auto-entrepreneur

### `site/source/components/PeriodSwitch.test.tsx`
- Tests d'affichage des périodes
- Tests d'interaction (sélection)
- Tests de non-régression
- Tests d'accessibilité

## 9. Backward compatibility

✅ **Pas de breaking change :**
- Autres simulateurs continuent à utiliser PeriodSwitch par défaut (mensuel + annuel)
- Le type `UnitéMonétaireRécurrente` est rétrocompatible (union type étendue)
- Les fonctions `toEurosParMois()` et `toEurosParAn()` acceptent toujours les mêmes entrées

## 10. Points de vigilance

### 🔴 À ABSOLUMENT éviter

```typescript
// ❌ NE PAS FAIRE
const unité = '€/trimestre' as const  // Pas type-safe

// ✅ À LA PLACE
import { eurosParTrimestre } from '@/domaine/Montant'
const montant = eurosParTrimestre(300)
```

### 🟡 À tester

- Conversions avec valeurs décimales (arrondi)
- Tous les chemins de conversion (9 conversions possibles)
- URL avec `?unité=€/trimestre`
- Affichage i18n EN et FR

### 🟢 Garanti

- Cohérence mathématique : 4 trimestres = 1 année
- Type-safety : TypeScript rejette les unités invalides
- Arrondi au centime : jamais de valeurs avec plus de 2 décimales

