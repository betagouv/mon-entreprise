# ADR : La présentation fait partie du domaine des modèles comparables

**Date** : 2026-09-10  
**Auteur** : Jalil

## Contexte

Le comparateur de statuts est devenu multi-modèles (PR #4635). Chaque statut (auto-entrepreneur, assimilé salarié, travailleur indépendant) est décrit par un objet qui implémente l'interface `ModèleComparable`, et le comparateur se contente de mettre les modèles côte à côte. Les PR #4650, #4651 et #4654 ajoutent la documentation des valeurs et des questions, au travers de composants React (`DocumentationRoutes`, MDX).

Deux réusinages avaient été convenus en pair, et ils se contredisent :

- déplacer `warning` dans `ValeurDocumentée` sous forme de `ReactNode`, pour que le comparateur affiche génériquement l'avertissement fourni par le modèle ;
- sortir la traduction de `régime` et `imposition` des modèles, au motif qu'une interface ne doit se charger ni de la mise en forme ni de la traduction.

Soit on accepte de la présentation dans les modèles, et ils ne sont plus des ports hexagonaux purs. Soit on la refuse, et le comparateur doit connaître tous les avertissements possibles pour les mettre en forme lui-même, loin du modèle qui les émet.

Le code actuel porte les symptômes de cette indécision :

- `get.warning` est un fourre-tout au niveau du modèle, déconnecté de la valeur qu'il qualifie ;
- chaque `<Item>` de `ComparaisonListe` passe une callback `warning` à `ComparaisonÉlément`, et l'UI recalcule `!indemnitésArrêtMaladie.valeur` pour deviner si le modèle a un avertissement, alors que le modèle expose déjà `revenuTropBasPourIJ` ;
- `régime: (t: TFunction) => string` fait entrer `TFunction` dans le contrat ;
- le `<Trans>` IR/IS est copié à l'identique dans deux modèles ;
- `nom` est une chaîne brute non traduite dans le même bloc que `régime` traduit.

## Décision

**Documenter un calcul, avertir et nommer un régime font partie du métier de Mon Entreprise.** La présentation de ce qu'un modèle sait dire de lui-même fait donc partie de son domaine. `ModèleComparable` n'est pas un port hexagonal pur : c'est un contrat qui expose du `ReactNode`, parce que React est notre langage pour du contenu riche.

### Règles

1. **Le modèle possède la présentation de ce qui lui est spécifique.** Avertissements, documentation, régime, imposition : le modèle produit le contenu, en React, à côté du calcul qui le déclenche.

2. **Le comparateur possède le cadre.** Tooltip, modale, cartes, mise en page : le comparateur enveloppe génériquement ce que le modèle lui donne. Il ne connaît aucun avertissement ni aucune documentation en particulier.

3. **La traduction est résolue au rendu, jamais à la construction.** Un modèle ne retourne jamais de chaîne traduite. Il retourne un `<Trans>`, ou un composant qui appelle `useTranslation()`, dont la langue vient du contexte i18n fourni par le consommateur. Sont exclus : un paramètre `TFunction` dans le contrat, et l'appel du `t` global d'i18next dans un getter.

4. **Tout React produit par un modèle doit être rendable côté serveur.** Pas de `window`, pas d'effet, pas de `lazy` non résolu. Un test rend chaque avertissement et chaque documentation avec `renderToString` dans la pile de providers du site.

5. **Les clés i18n d'un modèle sont nommées par modèle**, du type `modèles.auto-entrepreneur.régime`, et non par page, puisque les modèles ont vocation à servir hors du comparateur.

### Contrat cible

```typescript
type ValeurDocumentée = {
    documentation: DocumentationDeValeur
    avertissement?: ReactNode
}

export interface ModèleComparable {
    nom: NomModèle
    DocumentationRoutes: ComponentType<{ basePath: string }>

    set: {
        /* inchangé */
    }

    get: {
        statut: {
            étiquette: StatutType
            nom: ReactNode
            régime: ReactNode
            imposition: () => ReactNode
        }
        revenu: () => { bénéfice: MontantRécurrentDocumenté /* … */ }
        // … maladie, retraite, etc. : inchangés, chaque valeur peut porter un avertissement
        // plus de `warning`
    }
}
```

### Exemple

```tsx
// Dans ModeleAssimileSalarie.tsx : le modèle décide et rédige
indemnitésArrêtMaladie.avertissement = rémunérationEstPositive() ? undefined : (
    <Trans i18nKey="modèles.assimilé-salarié.avertissements.indemnités-journalières">
        Votre <Strong>rémunération</Strong> est <Strong>trop faible</Strong>{' '}
        pour bénéficier d’arrêt maladie.
    </Trans>
)

// Dans ComparaisonÉlément.tsx : le comparateur encadre, sans rien savoir
{
    valeur.avertissement && <WarningTooltip tooltip={valeur.avertissement} />
}
```

## Conséquences

### Positives

- **Localité** : un avertissement est écrit à côté du calcul qui le déclenche, dans le modèle qui le connaît.
- **Comparateur générique** : ajouter un modèle ou un avertissement ne touche ni `ComparaisonListe` ni `ComparaisonÉlément`. La prop `warning` de `ComparaisonÉlément` et le fourre-tout `get.warning` disparaissent.
- **Un seul type de présentation** dans le contrat, `ReactNode`. `TFunction` disparaît.
- **Cohérence avec la documentation** déjà en place (`DocumentationRoutes`, MDX).
- **Pleine capacité d'expression** pour les modèles : listes, liens, composants du design-system, MDX.
- **Réutilisation dans l'API** possible en rendant les `ReactNode` en HTML avec `renderToString`, dans la langue de la requête.

### Négatives

- **Le contrat dépend de React.** Les modèles ne sont pas réutilisables hors d'un environnement capable de rendre du React.
- **L'API devra embarquer la pile de rendu du site** : React, styled-components, i18next, routeur, compilation MDX. Aujourd'hui l'API Koa ne dépend que de `publicodes` et des paquets `modele-*`. Utiliser les modèles comparables suppose de les extraire de `site` dans un paquet du monorepo, et ce paquet sera lourd. Si l'API migre dans l'application Next.js, ce coût disparaît presque entièrement. La décision sur l'hébergement de l'API conditionne donc le coût réel de celle-ci.
- **`renderToString` ne gère ni `lazy` ni Suspense** : les MDX devront être importés avant le rendu, ou rendus avec `renderToPipeableStream`.
- **Les tests de texte passent par un rendu** (`renderToString` suffit, sans DOM). Les tests de présence ou d'absence d'un avertissement restent de simples égalités.

## Alternatives considérées

### Alternative 1 : avertissement en union discriminée, mis en forme par le comparateur

```typescript
type Avertissement =
    | { type: 'seuil micro dépassé'; seuil: Montant<'€/an'> }
    | { type: 'rémunération trop faible pour les indemnités journalières' }
```

Le modèle expose un fait, un composant central fait un `switch` exhaustif et porte tous les `<Trans>`.

**Rejetée** car :

- le comparateur doit connaître tous les avertissements de tous les modèles, et le `switch` grossit à chaque modèle ;
- la mise en forme est loin du modèle qui émet l'avertissement, alors qu'un avertissement est presque toujours spécifique à un modèle ;
- contradictoire avec ce qui est déjà en place pour la documentation.

### Alternative 2 : message sérialisable `{ clé, défaut, valeurs }`

Le modèle possède le message (clé i18n, texte par défaut, valeurs typées), le comparateur le rend avec un `<Trans>` générique. Sérialisable pour l'API sans React.

**Rejetée** car :

- réduit la capacité d'expression des modèles aux balises `<0>` de `<Trans>` : pas de liste, pas de composant, pas de MDX ;
- oblige la documentation à redevenir une simple référence, ce qui, en pratique, réintroduit un nom de règle Publicodes dans le contrat que la PR #4650 venait d'en sortir.

### Alternative 3 : `régime: (t: TFunction) => string`

État actuel. **Rejetée** car `TFunction` entre dans le contrat, la chaîne est traduite à l'appel, et chaque consommateur doit fournir `t`.

### Alternative 4 : `i18next.t()` global dans les getters

Évite `TFunction` mais fige la langue à la construction du modèle. **Rejetée** car le comparateur mémoïse les modèles et l'API voudra rendre un même modèle dans la langue de chaque requête.

## Implémentation

1. Ajouter `avertissement?: ReactNode` à `ValeurDocumentée` et l'afficher génériquement dans `ComparaisonÉlément`, puis supprimer la prop `warning` et `get.warning`.
2. Remplacer `régime: (t) => string` par `régime: ReactNode`, traduire `nom`, et extraire le `<Trans>` IR/IS dupliqué dans un composant partagé.
3. Renommer les clés i18n des modèles par modèle et régénérer les traductions.
4. Ajouter le test garde-fou qui rend chaque avertissement et chaque documentation avec `renderToString`.
5. Réécrire les deux TODO de `modeleComparable.ts` à la lumière de cet ADR.

## Références

- PR #4635 : comparateur de statuts multi-modèles (MVP)
- PR #4650 : documentation des valeurs du comparateur
- PR #4651 : style de la documentation MDX
- PR #4654 : documentation des questions du comparateur
- [ADR-2025-05-31-documentation-mdx](./ADR-2025-05-31-documentation-mdx.md)
- [ADR-2025-05-09-publicodes-adapter-pattern](./ADR-2025-05-09-publicodes-adapter-pattern.md)
- [Hexagonal Architecture - Ports & Adapters](https://alistair.cockburn.us/hexagonal-architecture/)
