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
- le `<Trans>` IR/IS est copié à l'identique dans deux modèles ;
- `nom` est une chaîne brute non traduite dans le même bloc que `régime` traduit ;
- les fichiers de modèle mélangent six cents lignes de calcul avec du JSX.

## Décision

**Documenter un calcul, avertir et nommer un régime font partie du métier de Mon Entreprise.** La présentation de ce qu'un modèle sait dire de lui-même fait donc partie de son domaine. `ModèleComparable` n'est pas un port hexagonal pur : c'est un contrat qui expose du contenu traduit, sous forme de chaînes pour les libellés plats et de `ReactNode` pour le contenu riche, parce que React est notre langage pour du contenu riche.

### Règles

1. **Le modèle possède la présentation de ce qui lui est spécifique.** Avertissements, documentation, régime, imposition : le modèle produit le contenu, et le comparateur ne le connaît pas.

2. **Le comparateur possède le cadre.** Tooltip, modale, cartes, mise en page : le comparateur enveloppe génériquement ce que le modèle lui donne. Il ne connaît aucun avertissement ni aucune documentation en particulier.

3. **La forme dépend de la nature du contenu, pas d'un souci d'uniformité.** Un libellé plat est une fonction `(t: TFunction) => string`. Un contenu riche (gras, lien, liste, MDX) est un `ReactNode`.

4. **La traduction est résolue tardivement, jamais figée à la construction du modèle.** Pour une chaîne, c'est le consommateur qui fournit `t` : celui de `useTranslation()` dans le site, celui de la requête dans l'API. Pour un `ReactNode`, c'est un `<Trans>` ou un composant qui appelle `useTranslation()`, dont la langue vient du contexte i18n au rendu. Est exclu l'appel du `t` global d'i18next dans un getter, qui fige la langue courante au moment où le modèle est construit.

5. **Tout React produit par un modèle doit être rendable côté serveur.** Pas de `window`, pas d'effet, pas de `lazy` non résolu.

### Contrat cible

```typescript
// Défini par la PR #4650, allégé de `Résumé` et `Références`
// puisque la modale ouvre directement la documentation complète.
// `chemin` est l'adresse de la valeur dans `DocumentationRoutes`, voir ci-dessous.
type DocumentationDeValeur = {
    titre: () => string
    chemin: string
}

type ValeurDocumentée = {
    documentation: DocumentationDeValeur
    avertissement?: ReactNode
}

export type MontantDocumenté = Montant & ValeurDocumentée
export type MontantRécurrentDocumenté = MontantRécurrent & ValeurDocumentée
export type QuantitéDocumentée = Quantité & ValeurDocumentée

export interface ModèleComparable {
    nom: NomModèle
    DocumentationRoutes: ComponentType<{ basePath: string }>

    set: {
        /* inchangé */
    }

    get: {
        statut: {
            étiquette: StatutType
            nom: (t: TFunction) => string
            régime: (t: TFunction) => string
            imposition: () => ReactNode
        }
        revenu: () => { bénéfice: MontantRécurrentDocumenté /* … */ }
        // … maladie, retraite, etc. : inchangés, chaque valeur peut porter un avertissement
        // plus de `warning`
    }
}
```

### Documentation d'une valeur : une application navigable et une adresse

À première lecture, `DocumentationDeValeur` ressemble à une référence plutôt qu'à du contenu, ce qui semble contredire la règle 1. Ce n'est pas le cas : le contenu est bien produit par le modèle, mais il l'est en un seul endroit, `DocumentationRoutes`, et `chemin` est l'adresse d'une valeur dans ce contenu.

Fonctionnement mis en place par la PR #4650 :

1. Le bouton « i » d'une valeur navigue vers une URL construite à partir de `chemin`, du type `/comparaison-régimes-sociaux/EI/indépendant/rémunération/nette`.
2. Le comparateur détecte cette URL, ouvre une `Popover`, et y rend le `DocumentationRoutes` du modèle concerné avec le `basePath` correspondant.
3. Le `DocumentationRoutes` d'un modèle Publicodes rend l'explorateur de règles de publicodes-react, avec ses liens d'une règle à l'autre.

La documentation d'un modèle n'est donc pas une collection de pages indépendantes, c'est une application navigable : la page d'une règle renvoie vers les règles dont elle dépend, et la popover doit pouvoir suivre ces liens. C'est pour cela que la valeur expose une adresse et non un composant :

- un `Contenu: ComponentType` par valeur rendrait la première page, mais les liens qu'elle contient auraient quand même besoin de `DocumentationRoutes` pour fonctionner. On aurait deux mécanismes pour le prix d'un ;
- le passage par l'URL donne un lien partageable vers l'explication d'une valeur, et le bouton retour du navigateur fonctionne dans la popover ;
- la forme est indépendante du moteur : un futur modèle en TypeScript pur fournira un `DocumentationRoutes` qui rend des pages MDX derrière des routes, et `chemin` sera l'adresse de la page qui explique la valeur.

`titre` est le titre de la règle dans le moteur du modèle. Le moteur étant construit par langue, ce titre respecte la règle 4 par ce biais, et non par un `t` fourni à l'appel.

### Exemple

```tsx
// Dans assimile-salarie/presentation.tsx : le modèle rédige
export const avertissements = {
    rémunérationTropFaiblePourIJ: (
        <Trans i18nKey="modèles.assimilé-salarié.avertissements.indemnités-journalières">
            Votre <Strong>rémunération</Strong> est <Strong>trop faible</Strong>{' '}
            pour bénéficier d’arrêt maladie.
        </Trans>
    ),
}

// Dans assimile-salarie/modele.ts : le modèle décide
indemnitésArrêtMaladie.avertissement = rémunérationEstPositive()
    ? undefined
    : avertissements.rémunérationTropFaiblePourIJ

// Dans ComparaisonÉlément.tsx : le comparateur encadre, sans rien savoir
{
    valeur.avertissement && <WarningTooltip tooltip={valeur.avertissement} />
}
```

## Conséquences

### Positives

- **Localité** : un avertissement est décidé dans le calcul et rédigé dans le dossier du modèle qui le connaît.
- **Comparateur générique** : ajouter un modèle ou un avertissement ne touche ni `ComparaisonListe` ni `ComparaisonÉlément`. La prop `warning` de `ComparaisonÉlément` et le fourre-tout `get.warning` disparaissent.
- **Présentation regroupée par modèle** : toutes les phrases d'un modèle sont lisibles d'un coup, et le fichier de calcul ne dépend plus de React.
- **Libellés plats testables par égalité** et exposables tels quels en JSON par l'API.
- **Cohérence avec la documentation** déjà en place (`DocumentationRoutes`, MDX).
- **Documentation navigable et partageable** : on suit les liens entre règles dans la popover, et l'URL d'une explication se partage.
- **Pleine capacité d'expression** pour le contenu riche : listes, liens, composants du design-system, MDX.
- **Réutilisation dans l'API** possible : les chaînes se traduisent avec le `t` de la requête, les `ReactNode` se rendent en HTML avec `renderToString`.

### Négatives

- **Le contrat dépend de React pour le contenu riche.** Les avertissements et la documentation ne sont pas réutilisables hors d'un environnement capable de rendre du React.
- **Deux formes de présentation coexistent** dans le contrat. Le critère de la règle 3 doit être appliqué à chaque nouveau champ.
- **La rédaction n'est plus sur la même ligne que la condition** qui la déclenche, mais dans le fichier voisin.
- **L'API devra embarquer la pile de rendu du site** pour le contenu riche : React, styled-components, i18next, routeur, compilation MDX. Aujourd'hui l'API Koa ne dépend que de `publicodes` et des paquets `modele-*`. Utiliser les modèles comparables suppose de les extraire de `site` dans un paquet du monorepo, et ce paquet sera lourd. Si l'API migre dans l'application Next.js, ce coût disparaît presque entièrement. La décision sur l'hébergement de l'API conditionne donc le coût réel de celle-ci.
- **`renderToString` ne gère ni `lazy` ni Suspense** : les MDX devront être importés avant le rendu, ou rendus avec `renderToPipeableStream`.
- **Rendre la documentation d'une valeur dans l'API demande un routeur** : il faut rendre le `DocumentationRoutes` du modèle sous un `StaticRouter` positionné sur `basePath/chemin` pour obtenir l'HTML de la page de cette valeur. Ça suppose que l'explorateur de règles de publicodes-react se rende côté serveur sans toucher au DOM, ce qui n'a pas été vérifié.
- **Les tests de texte du contenu riche passent par un rendu** (`renderToString` suffit, sans DOM). Les tests de présence ou d'absence d'un avertissement restent de simples égalités.

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

### Alternative 3 : `ReactNode` pour tous les libellés, y compris plats

Un seul type de présentation dans le contrat, `TFunction` disparaît. `régime` et `nom` deviennent des `<Trans>`.

**Rejetée** car l'uniformité ne vaut pas ce qu'elle coûte : un libellé plat en `ReactNode` se teste par rendu au lieu d'une égalité, sort de l'API en HTML au lieu d'un texte, et devient inaccessible à tout consommateur non React.

### Alternative 4 : `i18next.t()` global dans les getters

Évite `TFunction` mais fige la langue à la construction du modèle. **Rejetée** car le comparateur mémoïse les modèles et l'API voudra rendre un même modèle dans la langue de chaque requête.

## Implémentation

1. Ajouter `avertissement?: ReactNode` à `ValeurDocumentée` et l'afficher génériquement dans `ComparaisonÉlément`, puis supprimer la prop `warning` et `get.warning`.
2. Traduire `nom` sur le modèle de `régime`, garder `imposition` en `ReactNode`, et extraire le `<Trans>` IR/IS dupliqué dans un composant partagé.
3. Créer un dossier par modèle avec un module de présentation, y déplacer statut, avertissements et `DocumentationRoutes` ; le fichier de calcul redevient un `.ts`.
4. Renommer les clés i18n des modèles par modèle et régénérer les traductions.
5. Ajouter le test garde-fou qui rend chaque avertissement et chaque documentation avec `renderToString`.
6. Réécrire les deux TODO de `modeleComparable.ts` à la lumière de cet ADR.

## Références

- PR #4635 : comparateur de statuts multi-modèles (MVP)
- PR #4650 : documentation des valeurs du comparateur
- PR #4651 : style de la documentation MDX
- PR #4654 : documentation des questions du comparateur
- [Hexagonal Architecture - Ports & Adapters](https://alistair.cockburn.us/hexagonal-architecture/)
