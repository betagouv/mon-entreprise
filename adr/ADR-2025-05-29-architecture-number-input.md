# ADR : Architecture des composants de saisie numérique

**Date** : 2025-05-29  
**Auteur** : Jalil

## Contexte

Nous avons plusieurs types de valeurs numériques dans l'application :
- Des nombres simples sans unité (ex: nombre d'enfants)
- Des montants monétaires (ex: salaire de 2000 €/mois)
- Des quantités avec unités diverses (ex: 35 heures/mois, 10 titres-restaurant, 25%)

Initialement, nous avions `NumberInput` qui gérait tout avec une prop `displayedUnit`

Récemment, nous avions déjà introduit `MontantField` qui wrappait `NumberField` pour les montants

Cela créait de la confusion : pourquoi `NumberField` peut-il afficher des unités alors qu'on a des composants spécialisés ?

## Décision

Nous adoptons une architecture à 2 niveaux :

```
Niveau 1: NumericInput (atome - non exporté du design system)
Niveau 2: ├── NumberField (nombres sans unité)
          ├── MontantField (Value Object Montant)
          └── QuantitéField (Value Object Quantité)
```

### Responsabilités

**`NumericInput`** (privé au design-system)
- Primitif de saisie numérique
- Gère : formatage, localisation, curseur, suggestions
- N'a PAS de notion d'unité
- Props : `value: number`, `onChange: (n: number) => void`

**`NumberField`** (public)
- Pour les nombres sans dimension/unité
- Exemples : nombre d'enfants, index, compteurs
- Interdit d'y passer une unité

**`MontantField`** (public)
- Pour les Value Objects `Montant`
- Gère les montants avec leurs unités monétaires
- Props : `value: Montant`, `onChange: (m: Montant) => void`

**`QuantitéField`** (public)
- Pour les Value Objects `Quantité`
- Gère les quantités avec leurs unités (%, heures/mois, jours, etc.)
- Props : `value: Quantité`, `onChange: (q: Quantité) => void`

## Conséquences

### Positives
- **Type-safety** : Impossible de mélanger les types
- **Clarté** : Chaque composant a une responsabilité unique
- **DDD** : Les composants reflètent nos Value Objects métier
- **Maintenabilité** : Code partagé dans `NumericInput`
- **Évolutivité** : Facile d'ajouter de nouveaux types (ex: `DuréeField`)

### Négatives
- Plus de composants à maintenir
- Migration nécessaire des usages existants
- Légère duplication de code entre les composants wrappeurs

## Alternatives considérées

### Alternative 1 : Un seul composant polymorphe
```typescript
<NumberInput value={35 | euros(35) | heures(35)} />
```
**Rejetée** car :
- Complexité du typage TypeScript
- Logique conditionnelle complexe dans le composant
- Moins explicite à l'usage

### Alternative 2 : NumberField avec unité optionnelle
```typescript
<NumberField value={35} displayedUnit="heures/mois" />
```
**Rejetée** car :
- Incohérence avec l'existence de composants spécialisés
- Encourage le mauvais usage (string pour l'unité au lieu de types)
- Ne tire pas parti de nos Value Objects

## Références

- [Domain-Driven Design - Value Objects](https://martinfowler.com/bliki/ValueObject.html)
- [React Composition Patterns](https://reactpatterns.com/)
