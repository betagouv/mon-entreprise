# ADR : Frontières de modules et imports contrôlés

**Date** : 2025-05-29  
**Auteur** : Jalil

## Contexte

Dans une base de code qui grandit, il est important de maintenir des frontières claires entre les modules pour :
- Éviter les couplages non désirés
- Définir clairement les API publiques
- Faciliter les réusinages sans casser les dépendances
- Améliorer la maintenabilité

Sans règles explicites, les développeureuses peuvent importer n'importe quoi depuis n'importe où, créant des dépendances fragiles sur des détails d'implémentation.

## Décision

Nous établissons des **frontières de modules** avec une règle simple :
> Les imports depuis un module doivent passer par son fichier index (API publique)

### Modules concernés

1. **Design System** (`@/design-system`)
   - Seuls les composants exportés dans `index.ts` sont publics
   - Les composants internes restent privés

2. **Contextes métier** (`@/contextes/*`)
   - Chaque contexte définit son API publique dans son `index.ts`
   - Les détails d'implémentation restent encapsulés

### Règle ESLint

```javascript
{
  rules: {
    'no-restricted-imports': ['warn', {
      patterns: [
        {
          group: ['@/design-system/*', '!@/design-system'],
          message: 'Importez uniquement depuis @/design-system (l\'index). Les imports directs sont interdits.'
        },
        {
          group: ['@/contextes/*/!(*index)', '!@/contextes/*/*'],
          message: 'Importez uniquement depuis l\'index du contexte. Les imports directs sont interdits.'
        }
      ]
    }]
  }
}
```

## Conséquences

### Positives

- **Encapsulation** : Les détails d'implémentation sont cachés
- **Évolutivité** : On peut réusiner l'intérieur d'un module sans impacter le reste
- **Clarté** : L'API publique est explicite (ce qui est dans l'index)
- **Découvrabilité** : Un seul endroit pour voir ce qu'expose un module

### Négatives

- Peut nécessiter plus d'exports dans les index
- Les imports circulaires entre modules deviennent plus visibles (c'est aussi positif !)
- Demande de la discipline pour maintenir les index à jour

## Exemples

### ❌ Interdit
```typescript
import { NumericInput } from '@/design-system/internal/NumericInput'
import { calculerCotisations } from '@/contextes/économie-collaborative/domaine/location-de-meublé/cotisations'
```

### ✅ Autorisé
```typescript
import { NumberField, MontantField } from '@/design-system'
import { LocationMeublé } from '@/contextes/économie-collaborative'
```

### Organisation d'un module

```
contextes/économie-collaborative/
├── domaine/
│   └── location-de-meublé/    # Privé
├── infrastructure/            # Privé
├── components/               # Privé
└── index.ts                  # Public - exporte l'API du contexte
```

## Migration

1. Identifier les imports non conformes (la règle en warning les signalera)
2. Ajouter les exports manquants dans les index
3. Migrer progressivement les imports
4. Passer la règle en erreur une fois la migration terminée

## Références

- [Encapsulation in TypeScript](https://www.typescriptlang.org/docs/handbook/modules.html)
- [Bounded Contexts in DDD](https://martinfowler.com/bliki/BoundedContext.html)
- Pattern "Facade" du Gang of Four
