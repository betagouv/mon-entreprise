# 🔍 Diffs détaillés - Code review rapide

Ce fichier montre les changements exacts fichier par fichier.

---

## 1️⃣ `site/source/domaine/Unités.ts`

```diff
  export type UnitéMonétairePonctuelle = '€' | '€/titre-restaurant'
- export type UnitéMonétaireRécurrente = '€/mois' | '€/an' | '€/jour' | '€/heure'
+ export type UnitéMonétaireRécurrente = '€/mois' | '€/trimestre' | '€/an' | '€/jour' | '€/heure'
  export type UnitéMonétaire = UnitéMonétairePonctuelle | UnitéMonétaireRécurrente

  const UNITÉS_MONÉTAIRES = [
    '€',
    '€/titre-restaurant',
    '€/an',
+   '€/trimestre',
    '€/mois',
    '€/jour',
    '€/heure',
  ] as const
```

---

## 2️⃣ `site/source/domaine/Montant.ts`

### Ajout de type guards

```diff
  export const estEuroParMois = (
    montant: Montant
  ): montant is Montant<'€/mois'> => montant.unité === '€/mois'
+ export const estEuroParTrimestre = (
+   montant: Montant
+ ): montant is Montant<'€/trimestre'> => montant.unité === '€/trimestre'
  export const estEuroParAn = (montant: Montant): montant is Montant<'€/an'> =>
    montant.unité === '€/an'
```

### Ajout de constructeur

```diff
  export const eurosParMois = (valeur: number): Montant<'€/mois'> =>
    montant(valeur, '€/mois')
+
+ export const eurosParTrimestre = (valeur: number): Montant<'€/trimestre'> =>
+   montant(valeur, '€/trimestre')
+
  export const eurosParAn = (valeur: number): Montant<'€/an'> =>
    montant(valeur, '€/an')
```

### Mise à jour toEurosParMois

```diff
  export const toEurosParMois = (
    montantRécurrent: Montant<UnitéMonétaireRécurrente>
  ): Montant<'€/mois'> => {
    let valeur = montantRécurrent.valeur
    switch (montantRécurrent.unité) {
      case '€/an':
        valeur = valeur / 12
        break
+     case '€/trimestre':
+       valeur = valeur / 3
+       break
      case '€/jour':
        valeur = (valeur * 365) / 12
        break
      case '€/heure':
        valeur = (valeur * 24 * 365) / 12
        break
    }
    return montant(valeur, '€/mois')
  }
```

### Ajout toEurosParTrimestre

```diff
+ export const toEurosParTrimestre = (
+   montantRécurrent: Montant<UnitéMonétaireRécurrente>
+ ): Montant<'€/trimestre'> => {
+   let valeur = montantRécurrent.valeur
+   switch (montantRécurrent.unité) {
+     case '€/an':
+       valeur = valeur / 4
+       break
+     case '€/mois':
+       valeur = valeur * 3
+       break
+     case '€/jour':
+       valeur = (valeur * 365) / 4
+       break
+     case '€/heure':
+       valeur = (valeur * 24 * 365) / 4
+       break
+   }
+   return montant(valeur, '€/trimestre')
+ }
+
  export const toEurosParAn = (
```

### Mise à jour toEurosParAn

```diff
  export const toEurosParAn = (
    montantRécurrent: Montant<UnitéMonétaireRécurrente>
  ): Montant<'€/an'> => {
    let valeur = montantRécurrent.valeur
    switch (montantRécurrent.unité) {
      case '€/mois':
        valeur = valeur * 12
        break
+     case '€/trimestre':
+       valeur = valeur * 4
+       break
      case '€/jour':
        valeur = valeur * 365
        break
      case '€/heure':
        valeur = valeur * 24 * 365
        break
    }
    return montant(valeur, '€/an')
  }
```

### Mise à jour toEurosParJour

```diff
  export const toEurosParJour = (
    montantRécurrent: Montant<UnitéMonétaireRécurrente>
  ): Montant<'€/jour'> => {
    let valeur = montantRécurrent.valeur
    switch (montantRécurrent.unité) {
      case '€/an':
        valeur = valeur / 365
        break
+     case '€/trimestre':
+       valeur = (valeur * 4) / 365
+       break
      case '€/mois':
        valeur = (valeur * 12) / 365
        break
      case '€/heure':
        valeur = valeur * 24
        break
    }
    return montant(valeur, '€/jour')
  }
```

### Mise à jour toEurosParHeure

```diff
  export const toEurosParHeure = (
    montantRécurrent: Montant<UnitéMonétaireRécurrente>
  ): Montant<'€/heure'> => {
    let valeur = montantRécurrent.valeur
    switch (montantRécurrent.unité) {
      case '€/an':
        valeur = valeur / (365 * 24)
        break
+     case '€/trimestre':
+       valeur = (valeur * 4) / (365 * 24)
+       break
      case '€/mois':
        valeur = (valeur * 12) / (365 * 24)
        break
      case '€/jour':
        valeur = valeur / 24
        break
    }
    return montant(valeur, '€/heure')
  }
```

---

## 3️⃣ `site/source/domaine/engine/MontantAdapter.ts`

### Import

```diff
  import {
    euros,
    eurosParAn,
    eurosParMois,
+   eurosParTrimestre,
    eurosParTitreRestaurant,
    Montant,
  } from '@/domaine/Montant'
```

### Decode

```diff
    switch (formattedUnit) {
      case '€':
        return O.some(euros(numberValue))
      case '€/an':
        return O.some(eurosParAn(numberValue))
+     case '€/trimestre':
+       return O.some(eurosParTrimestre(numberValue))
      case '€/mois':
        return O.some(eurosParMois(numberValue))
      case '€/titre-restaurant':
        return O.some(eurosParTitreRestaurant(numberValue))
```

---

## 4️⃣ `site/source/locales/ui-fr.yaml`

```diff
  Montant annuel: Montant annuel
  Montant mensuel: Montant mensuel
+ Montant trimestriel: Montant trimestriel
  Montant net des HC/HS exonérées: Montant net des HC/HS exonérées
```

---

## 5️⃣ `site/source/locales/ui-en.yaml`

```diff
  Montant annuel: Annual amount
  Montant mensuel: Monthly amount
+ Montant trimestriel: Quarterly amount
  Montant net des HC/HS exonérées: Net amount of exempt HC/HS
```

---

## 6️⃣ `site/source/pages/simulateurs/auto-entrepreneur/AutoEntrepreneur.tsx`

### Import

```diff
- import { Trans } from 'react-i18next'
+ import { Trans, useTranslation } from 'react-i18next'

  import ChiffreAffairesActivitéMixte from '@/components/ChiffreAffairesActivitéMixte'
```

### Fonction

```diff
  export default function AutoEntrepreneur() {
+   const { t } = useTranslation()
+
    return (
      <>
        <Simulation
          explanations={<AutoEntrepreneurDétails />}
          afterQuestionsSlot={<YearSelectionBanner />}
        >
          <SimulateurWarning ...>
          <SimulationGoals>
-           <PeriodSwitch />
+           <PeriodSwitch
+             periods={[
+               { label: t('Montant mensuel'), unit: '€/mois' },
+               { label: t('Montant trimestriel'), unit: '€/trimestre' },
+               { label: t('Montant annuel'), unit: '€/an' },
+             ]}
+           />
            <ChiffreAffairesActivitéMixte dottedName="dirigeant . auto-entrepreneur . chiffre d'affaires" />
```

---

## Fichiers créés (code minimal)

### Test Montant

**Fichier :** `site/source/domaine/Montant.trimestre.test.ts`
- 224 lignes
- 17 tests
- Couvre : constructeurs, conversions, cas d'usage

### Test PeriodSwitch

**Fichier :** `site/source/components/PeriodSwitch.test.tsx`
- 68 lignes
- 5 tests
- Couvre : affichage, interaction, accessibilité

---

## Statistiques

| Métrique | Nombre |
|----------|--------|
| Lignes modifiées | ~50 |
| Lignes ajoutées | ~80 |
| Fichiers modifiés | 6 |
| Fichiers créés | 2 |
| Tests ajoutés | 22 |

---

## Points critiques pour la review

1. ✅ **Types** (`Unités.ts`) : Vérifier que `'€/trimestre'` est partout
2. ✅ **Conversions** (`Montant.ts`) : Vérifier la logique (÷3, ×3, ÷4, ×4)
3. ✅ **Adapter** (`MontantAdapter.ts`) : Vérifier le case dans decode
4. ✅ **i18n** (yaml) : Vérifier les traductions FR et EN
5. ✅ **UI** (`AutoEntrepreneur.tsx`) : Vérifier le prop periods

---

## Commandes de vérification

```bash
# Vérifier les types
yarn tsc --skipLibCheck --noEmit

# Lancer les tests
yarn test domaine/Montant.trimestre.test.ts
yarn test components/PeriodSwitch.test.tsx

# Vérifier le lint
yarn lint:eslint site/source/domaine/Montant.ts
yarn lint:prettier --check

# Tester manuellement
yarn start  # http://localhost:5173/simulateurs/auto-entrepreneur
```

