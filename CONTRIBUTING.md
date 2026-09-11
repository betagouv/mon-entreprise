# Comment contribuer ?

Merci de prendre le temps de contribuer ! 🎉

Voici quelques informations pour démarrer :

## Notre mission

mon-entreprise.urssaf.fr est le simulateur officiel de l'Urssaf pour les cotisations sociales, les impôts et les droits sociaux des entrepreneurs. C'est un service public né de l'incubateur beta.gouv.fr, et son simulateur salarié a été classé service public essentiel.

La priorité est l'utilité pour nos usagers, dans l'esprit du [manifeste beta.gouv](https://beta.gouv.fr/manifeste) : les besoins des usagers priment, on progresse par itérations au contact de vrais utilisateurs, et on travaille en transparence (code ouvert, impact mesurable). Entre deux arbitrages, la fiabilité d'un résultat affiché à un usager, sa compréhension et son accessibilité passent avant une question de style.

## Rapport de bug, nouvelles fonctionnalités

Nous utilisons GitHub pour suivre tous les bugs et discussions sur les nouvelles fonctionnalités. Pour rapporter un bug ou proposer une évolution vous pouvez [ouvrir une nouvelle discussion](https://github.com/betagouv/mon-entreprise/issues/new). N'hésitez pas à utiliser la recherche pour vérifier si le sujet n'est pas déjà traité dans une discussion ouverte.

## Développement

Si vous voulez participer au développement de nouvelles fonctionnalités, vous pouvez consulter la liste des «[🥇 good first issue](https://github.com/betagouv/mon-entreprise/issues?q=is%3Aopen+is%3Aissue+label%3A%22%F0%9F%A5%87+good+first+issue%22+) ». Ce sont des fonctionnalités intéressantes qui ne sont normalement pas trop complexe à implémenter. N'hésitez pas à poser toutes vos questions sur ces issues !

### Descriptions des packages
- [mon-entreprise](./site/README.md) : le site mon-entreprise.urssaf.fr
- [modele-social](./modele-social/README.md) : les règles de calculs des cotisations sociales, des impôts et des droits sociaux
- [api](./api/README.md) : l'API qui expose les calculs des simulateurs de mon-entreprise
- [exoneration-covid](./exoneration-covid/README.md) (archivé) : les règles de calculs de l'exonérations de cotisations sociales liées à la crise sanitaire (2021) 
- [server](./server/README.md) : un petit serveur qui gère un proxy pour les retours utilisateurs ainsi qu'un bot mattermost pour les standups de l'équipe (plus utilisé)

### Technologies

Nous utilisons :
-   [Eslint](http://eslint.org) qui permet par exemple d'éviter de garder des variables inutilisées
-   [Prettier](https://prettier.io/) pour formater le code source, l'idéal est de configurer votre éditeur de texte pour que les fichiers soit formatés automatiquement quand vous sauvegardez un fichier. Si vous utilisez [VS Code](https://code.visualstudio.com/) cette configuration est automatique.
-   [Publicodes](https://publi.codes) pour la gestion des règles métiers
-   [React](https://reactjs.org) pour la gestion de l'interface utilisateur
-   [Redux](https://redux.js.org) pour gérer le "state" de l'application côté client
-   [TypeScript](https://www.typescriptlang.org) en mode strict : tout le code est typé, sans `any`, et la vérification des types (`yarn test:type`) fait partie de la CI au même titre que le lint et les tests.
-   [ViteJS](https://vitejs.dev) pour le "bundling" et le serveur de développement, et [Next.js](https://nextjs.org) que nous adoptons progressivement (voir la stratégie d'évolution ci-dessous)
-   [Vitest](https://vitest.dev) et [Cypress](https://www.cypress.io) pour l'execution des tests. Plus d'informations dans la section consacrée aux tests.
-   [Yarn](https://yarnpkg.com) pour la gestion des dépendances (à la place de NPM qui est souvent utilisé dans les applications JavaScript)

### Principes et architecture

-   **Le domaine au centre** (Domain-Driven Design, architecture hexagonale) : la logique métier (calculs, règles, décisions) vit dans des modules de domaine en TypeScript pur, et n'a pas sa place dans un composant React, un reducer, un hook ou un adaptateur Publicodes. L'infrastructure (Publicodes, Redux, stockage, navigation) s'y branche par des adaptateurs.
-   **Le vocabulaire du domaine, en français**, dans le code : fichiers, fonctions, types, variantes d'unions discriminées. Les structures de données non triviales sont des objets de domaine typés et immuables, manipulés par des fonctions qui retournent de nouvelles instances.
-   **Programmation fonctionnelle et style déclaratif** : fonctions pures, immutabilité, composition. Bibliothèques privilégiées : Effect TS pour les effets, Immer pour les manipulations du domaine, Redux pour l'état applicatif.
-   **Juste ce qu'il faut** : pas de code qui anticipe un besoin futur, pas d'abstraction avant le besoin, pas de code mort. Le code doit être auto-explicatif : un changement de code vaut mieux qu'un commentaire, sauf pour une règle métier ou une logique vraiment complexe.
-   **Lisibilité** : des noms explicites, des fonctions courtes qui font une seule chose, des responsabilités bien réparties et un couplage limité. Pas de duplication, y compris de CSS : ce qui se répète rejoint le design-system.
-   **Fiabilité** : les cas d'erreur sont gérés, les entrées sont validées aux frontières du système (saisie, paramètres d'URL, réponses d'API), rien de sensible (clé, jeton) n'est dans le code.
-   **Ne pas inventer de règle métier** : un taux, un seuil ou une condition a une source (texte de loi, site officiel). En cas de doute, on pose la question avant d'implémenter.
-   Les décisions d'architecture notables sont documentées dans [`adr/`](./adr).

#### Stratégie d'évolution

-   **De Vite vers Next.js**, progressivement : les deux bundlers coexistent. Un nouveau code ne dépend d'aucune API propre à Vite (`import.meta.env` par exemple) sans passer par un adaptateur qui fonctionne aussi sous Next, et les noms de fichiers du graphe d'import Next ne contiennent pas d'accents.
-   **Du DSL Publicodes vers des modèles de domaine en TypeScript pur**, progressivement, en concevant d'abord les types.

### Conventions de code

Ce que le lint impose n'est pas répété ici : `yarn lint:fix` corrige ou signale. Restent les conventions qu'aucun outil ne vérifie :

-   Exports nommés plutôt que `export default`
-   Composants fonctionnels avec hooks
-   Un module s'importe par son index public (`@/design-system`, `@/contextes/<nom>`), jamais par un chemin interne : voir l'[ADR sur les frontières de modules](./adr/ADR-2025-05-29-module-boundaries.md)
-   Utiliser les composants du [design-system](./site/source/design-system), et en créer quand c'est pertinent
-   Accessibilité : suivre [`site/ACCESSIBILITY.md`](./site/ACCESSIBILITY.md) (RGAA) ; le plugin `jsx-a11y` est configuré en mode strict
-   Tout texte affiché passe par `t()` ou `<Trans>` de react-i18next, avec une clé hiérarchique et une valeur par défaut en français ; les fichiers de traduction régénérés (`yarn workspace site run i18n:translate`) font partie du même commit que le code. Voir la [section Traduction du README du site](./site/README.md#traduction-)

### Patterns et bonnes pratiques

#### Compound Components

Pour créer des composants React réutilisables et composables, nous privilégions le **pattern Compound Components**. Ce pattern permet de créer des APIs de composants flexibles où les sous-composants sont exposés comme propriétés du composant principal, offrant une composition déclarative tout en gardant le contrôle sur le rendu final.

```tsx
// ✅ API claire et composable
<CarteComparaison meilleureOption={true}>
  <CarteComparaison.Étiquettes>
    <RégimeTag régime="RG" />
  </CarteComparaison.Étiquettes>

  <CarteComparaison.Contenu>
    <span>1 800 €</span>
    <span>de cotisations</span>
  </CarteComparaison.Contenu>

  <CarteComparaison.Détails>
    <p>Protection maximale</p>
  </CarteComparaison.Détails>
</CarteComparaison>

// ❌ Trop de props, moins flexible
<CarteComparaison
  étiquettes={[{ libellé: 'RG', couleur: 'primary' }]}
  titre="1 800 €"
  sousTitre="de cotisations"
  détails={<p>Protection maximale</p>}
  meilleureOption={true}
/>
```

Le composant parent contrôle le layout et les règles visuelles (séparateurs, positionnement) ; chaque sous-composant gère ses propres styles et sa responsabilité. À utiliser pour un composant à plusieurs zones (en-tête, corps, pied), quand l'ordre ou la présence des éléments varie, ou pour une réutilisation dans plusieurs contextes métier.

Pour plus de détails sur ce pattern, consultez l'[ADR sur les Compound Components](./adr/ADR-2025-10-02-compound-components.md).

### Tests

#### Vérification syntaxique :

```sh
yarn lint
```

Pour corriger les erreurs automatiquement :

```sh
yarn lint:fix
```

#### Vérification du typage :

```sh
yarn test:type
```

Pour avoir les erreurs de type en direct dans la console, utilisez le paramètre `--watch` :

```sh
yarn test:type --watch
```

#### Tests unitaires

```sh
yarn test
```

#### Comment nous testons

-   Un nouveau comportement arrive avec ses tests, écrits avant l'implémentation quand c'est possible (test qui échoue, code minimal pour le faire passer, refactoring)
-   Les tests portent sur le comportement observable, pas sur l'implémentation : un test qui mocke tous ses collaborateurs ne teste que les mocks, et un test qui casse à chaque refactoring sans changement de comportement est fragile
-   Les cas limites sont couverts

### Commits et Pull Requests

-   Messages au format [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) : `<type>[scope]: <description>`, sur une ligne, en français
-   Le scope est optionnel. Privilégier un scope fonctionnel (`salarié`, `indépendant`, `artiste-auteur`, `comparateur`, `dividendes`, `imposition`, …) ; scopes techniques admis : `design-system`, `publicodes`, `iframe`, `i18n`, `a11y`, `tracking`, `modele-social`
-   Un commit = un changement logique, autonome et vert : lint, types, tests et traductions passent à chaque commit. Pas de `@ts-expect-error` ni de TODO « à résoudre dans le commit suivant »
-   Des PR petites et compréhensibles se relisent mieux et se fusionnent plus vite
-   Chaque PR reçoit une revue automatique par une IA, en plus de la revue humaine. Ses remarques se discutent comme celles d'un collègue : elles n'ont rien de contraignant


### CI/CD

-   Nous utilisons des [Github actions](https://github.com/features/actions) pour faire tourner les builds et les tests.
-   [Netlify](https://www.netlify.com/), s'occupe de l’hébergement du site sur Internet avec gestion des DNS.
-   L'API est quand à elle hébergée sur [Scalingo](https://scalingo.com/)


## Retours utilisateurs

Nous gérons les retours utilisateurs avec plusieurs outils :

-   [Crisp](https://crisp.chat/fr) pour recevoir et répondre aux messages
-   Github pour suivre le développement des demandes
-   et ATInternet, notre outil de statistiques, pour suivre la notation des pages

Nous recevons les messages des utilisateurs sur Crisp. Si la demande concerne une nouvelle fonctionnalité, nous ouvrons un ticket sur Github avec l'étiquette [retour utilisateur](https://github.com/betagouv/mon-entreprise/issues?q=is%3Aissue+is%3Aopen+label%3A%22%F0%9F%8F%93+retour+utilisateur%22). Cela nous permet de récupérer la liste des demandes avec l'API Github pour l'afficher sur le site.

Crisp permet également d'ajouter une étiquette au message, ce qui nous permet de l'associer au ticket Github correspondant. Avec l'API Crisp, nous pouvons ainsi compter le nombre de demandes sur une fonctionnalité donnée. Enfin quand le ticket est fermé sur Github un petit robot nous rappelle de prévenir les utilisateurs qui nous on fait le retour, ainsi on peut revenir vers eux même plusieurs mois après pour leur indiquer que leur demande a été intégrée.

Quant à la notation des pages avec des smileys, elle fonctionne via des événements personnalisés remontés sur notre outil de statistiques. Nous récupérons le nombre d'événements par page avec l'API fournie pour la présenter sur notre [page statistique dédiée](https://mon-entreprise.urssaf.fr/stats).

Là-aussi nous utilisons l'API fournie pour récupérer les valeurs par page et les présenter sur notre page statistiques.
