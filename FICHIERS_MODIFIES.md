# 📝 Liste des fichiers modifiés / créés

## Fichiers modifiés (6 fichiers)

### 1. `site/source/domaine/Unités.ts`
**Changement :** Ajout de `'€/trimestre'` au type `UnitéMonétaireRécurrente`
```diff
- export type UnitéMonétaireRécurrente = '€/mois' | '€/an' | '€/jour' | '€/heure'
+ export type UnitéMonétaireRécurrente = '€/mois' | '€/trimestre' | '€/an' | '€/jour' | '€/heure'

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
**Lignes modifiées :** 2, 9

---

### 2. `site/source/domaine/Montant.ts`
**Changement :** Ajout de 3 nouvelles fonctions + mise à jour de 4 fonctions de conversion

```diff
+ export const estEuroParTrimestre = (montant: Montant): montant is Montant<'€/trimestre'> =>
+   montant.unité === '€/trimestre'

+ export const eurosParTrimestre = (valeur: number): Montant<'€/trimestre'> =>
+   montant(valeur, '€/trimestre')

+ export const toEurosParTrimestre = (montantRécurrent: Montant<UnitéMonétaireRécurrente>): Montant<'€/trimestre'> => {
+   // ... implémentation avec switch case pour €/an (÷4), €/mois (×3), €/jour, €/heure
+ }

  // Mise à jour de toEurosParMois() pour inclure le case €/trimestre
+   case '€/trimestre':
+     valeur = valeur / 3
+     break

  // Mise à jour de toEurosParAn() pour inclure le case €/trimestre
+   case '€/trimestre':
+     valeur = valeur * 4
+     break

  // Mise à jour de toEurosParJour() pour inclure le case €/trimestre
+   case '€/trimestre':
+     valeur = (valeur * 4) / 365
+     break

  // Mise à jour de toEurosParHeure() pour inclure le case €/trimestre
+   case '€/trimestre':
+     valeur = (valeur * 4) / (365 * 24)
+     break
```
**Lignes modifiées :** ~50 (insertion + 4 updates dans les switch)

---

### 3. `site/source/domaine/engine/MontantAdapter.ts`
**Changement :** Import de `eurosParTrimestre` + ajout du case dans decode

```diff
  import {
    euros,
    eurosParAn,
    eurosParMois,
+   eurosParTrimestre,
    eurosParTitreRestaurant,
    Montant,
  } from '@/domaine/Montant'

  // Dans la fonction decode, dans le switch
  switch (formattedUnit) {
    case '€':
      return O.some(euros(numberValue))
    case '€/an':
      return O.some(eurosParAn(numberValue))
+   case '€/trimestre':
+     return O.some(eurosParTrimestre(numberValue))
    case '€/mois':
      return O.some(eurosParMois(numberValue))
    case '€/titre-restaurant':
      return O.some(eurosParTitreRestaurant(numberValue))
```
**Lignes modifiées :** Import (ligne 8) + switch (insertion)

---

### 4. `site/source/locales/ui-fr.yaml`
**Changement :** Ajout de la traduction française

```diff
  Montant annuel: Montant annuel
  Montant mensuel: Montant mensuel
+ Montant trimestriel: Montant trimestriel
  Montant net des HC/HS exonérées: Montant net des HC/HS exonérées
```
**Ligne ajoutée :** Entre lignes 151-152

---

### 5. `site/source/locales/ui-en.yaml`
**Changement :** Ajout de la traduction anglaise

```diff
  Montant annuel: Annual amount
  Montant mensuel: Monthly amount
+ Montant trimestriel: Quarterly amount
  Montant net des HC/HS exonérées: Net amount of exempt HC/HS
```
**Ligne ajoutée :** Entre lignes 143-144

---

### 6. `site/source/pages/simulateurs/auto-entrepreneur/AutoEntrepreneur.tsx`
**Changement :** Import `useTranslation` + passage du prop `periods` à PeriodSwitch

```diff
- import { Trans } from 'react-i18next'
+ import { Trans, useTranslation } from 'react-i18next'

  export default function AutoEntrepreneur() {
+   const { t } = useTranslation()
+
    return (
      <>
        <Simulation>
          <SimulationGoals>
-           <PeriodSwitch />
+           <PeriodSwitch
+             periods={[
+               { label: t('Montant mensuel'), unit: '€/mois' },
+               { label: t('Montant trimestriel'), unit: '€/trimestre' },
+               { label: t('Montant annuel'), unit: '€/an' },
+             ]}
+           />
            <ChiffreAffairesActivitéMixte ...
```
**Lignes modifiées :** Import (ligne 1) + fonction (insertion du hook + prop)

---

## Fichiers créés (3 fichiers)

### 1. `site/source/domaine/Montant.trimestre.test.ts` (224 lignes)
**Contenu :** Suite de tests complète pour €/trimestre
- Constructeurs et type guards (3 tests)
- Conversions trimestre → mois (3 tests)
- Conversions trimestre → année (3 tests)
- Conversions vers trimestre (3 tests)
- Conversions croisées (3 tests)
- Cas d'usage auto-entrepreneur (2 tests)

**Total :** 17 tests

---

### 2. `site/source/components/PeriodSwitch.test.tsx` (68 lignes)
**Contenu :** Tests d'intégration du composant PeriodSwitch
- Affichage par défaut (1 test)
- Affichage personnalisé avec trimestre (1 test)
- Sélection de la période trimestrielle (1 test)
- Non-régression sur 2 périodes (1 test)
- Accessibilité (1 test)

**Total :** 5 tests

---

### 3. Documentation (3 fichiers)
- `IMPLEMENTATION_TRIMESTRE.md` - Vue d'ensemble complète
- `GUIDE_TEST_TRIMESTRE.md` - Guide d'exécution des tests
- `TECHNICAL_DETAILS_TRIMESTRE.md` - Détails techniques approfondis

---

## Résumé statistique

| Métrique | Nombre |
|----------|--------|
| Fichiers modifiés | 6 |
| Fichiers créés | 3 |
| Lignes ajoutées (code) | ~80 |
| Lignes modifiées | ~20 |
| Tests ajoutés | 22 |
| Traductions ajoutées | 2 |
| Documentation | 3 pages |

---

## Ordre de révision recommandé

1. **Types** : `Unités.ts` (fondation)
2. **Domaine** : `Montant.ts` (logique métier)
3. **Adapter** : `MontantAdapter.ts` (integration avec Publicodes)
4. **Translations** : `ui-fr.yaml`, `ui-en.yaml` (i18n)
5. **UI** : `AutoEntrepreneur.tsx` (affichage)
6. **Tests** : `Montant.trimestre.test.ts`, `PeriodSwitch.test.tsx`
7. **Documentation** : Les 3 fichiers .md

---

## Tests à exécuter après merge

```bash
# Tests unitaires
cd site
yarn test domaine/Montant
yarn test components/PeriodSwitch

# Validations
yarn tsc --skipLibCheck --noEmit
yarn lint:eslint
yarn lint:prettier --check

# Test manuel
yarn start  # http://localhost:5173/simulateurs/auto-entrepreneur
```

