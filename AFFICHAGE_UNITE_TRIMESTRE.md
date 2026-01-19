# Affichage du libellé d'unité trimestriel dans l'input

## Objectif
Afficher le libellé "€ par trimestre" dans l'input du champ "Chiffre d'affaires" quand la période trimestrielle est sélectionnée, de manière cohérente avec les affichages "€ par mois" et "€ par an".

## Fichiers modifiés

### 1. `design-system/molecules/field/MontantField.tsx`

**Modification:** Ajout du mapping `'€/trimestre': 'par trimestre'` dans l'objet `unitéToDisplayedUnit`.

```typescript
const unitéToDisplayedUnit: Record<UnitéMonétaire, string> = {
	'€': '',
	'€/an': 'par an',
	'€/mois': 'par mois',
	'€/trimestre': 'par trimestre',  // ← AJOUT
	'€/jour': 'par jour',
	'€/heure': 'par heure',
	'€/titre-restaurant': 'par titre-restaurant',
}
```

**Impact:** Le composant `MontantField` passe cet objet à `NumericInput` via la prop `displayedUnit`. Quand l'unité est `'€/trimestre'`, le texte `'par trimestre'` s'affichera à côté de l'input.

**Fonctionnement:** 
- L'objet `unitéToDisplayedUnit` mappe chaque unité monétaire à son libellé
- La valeur de cette map est passée à `NumericInput` en tant que `displayedUnit`
- `NumericInput` affiche ce libellé dans un élément `<Unit>` à côté du champ input

## Fichiers de test

### 1. `design-system/molecules/field/MontantField.test.tsx` (NOUVEAU)

Tests unitaires pour vérifier l'affichage correct du libellé d'unité :
- ✅ Affiche "par mois" avec l'unité €/mois
- ✅ Affiche "par trimestre" avec l'unité €/trimestre  
- ✅ Affiche "par an" avec l'unité €/an
- ✅ Cohérence entre les 3 périodes (même valeur : 2000€/mois = 6000€/trimestre = 24000€/an)
- ✅ N'affiche pas de suffixe quand l'unité est €

### 2. `components/Simulation/SimulationGoal.unit-label.test.tsx` (NOUVEAU)

Tests d'intégration pour vérifier que le libellé change avec la période sélectionnée :
- ✅ Affiche "par mois" quand targetUnit est €/mois
- ✅ Affiche "par trimestre" quand targetUnit est €/trimestre
- ✅ Affiche "par an" quand targetUnit est €/an

## Vérification de la cohérence

La solution maintient la cohérence avec les autres champs numériques qui affichent une unité :
- Les trois périodes utilisent le même pattern : `'par {unité}'`
- Le mapping est centralisé dans `MontantField.tsx`
- `NumericInput` utilise directement la valeur de `displayedUnit` sans transformation

## Non-régression

Cette modification n'affecte que l'affichage du libellé d'unité. Aucun changement logique ou mathématique :
- Les conversions entre unités (€/mois ↔ €/trimestre ↔ €/an) restent inchangées
- Les autres champs monétaires utilisant `MontantField` héritent automatiquement de cette correction
- Les simulateurs sans support trimestriel ne sont pas affectés

## Cas d'usage

Quand un utilisateur change de période dans le simulateur auto-entrepreneur :
1. **Période mensuelle**: "Chiffre d'affaires" avec input montrant "par mois"
2. **Période trimestrielle**: "Chiffre d'affaires" avec input montrant "par trimestre" ← CORRIGÉ
3. **Période annuelle**: "Chiffre d'affaires" avec input montrant "par an"

## À tester

```bash
# Lancer les tests unitaires
yarn test design-system/molecules/field/MontantField.test.tsx

# Lancer les tests d'intégration
yarn test components/Simulation/SimulationGoal.unit-label.test.tsx

# Test manuel : naviguer à /simulateurs/auto-entrepreneur et changer les périodes
# Vérifier que le libellé "par trimestre" s'affiche dans l'input du chiffre d'affaires
```
