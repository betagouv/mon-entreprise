# Comment contribuer ?

Merci de prendre le temps de contribuer ! 🎉

Voici quelques informations pour démarrer :

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
-   [TypeScript](https://www.typescriptlang.org) pour ajouter un système de typage à notre code JavaScript. Le typage n'est pas utilisé partout et il n'est pas obligatoire de le prendre en compte pour contribuer.
-   [ViteJS](https://vitejs.dev) pour le "bundling" et le serveur de développement
-   [Vitest](https://vitest.dev) et [Cypress](https://www.cypress.io) pour l'execution des tests. Plus d'informations dans la section consacrée aux tests.
-   [Yarn](https://yarnpkg.com) pour la gestion des dépendances (à la place de NPM qui est souvent utilisé dans les applications JavaScript)

### Patterns et bonnes pratiques

#### Compound Components

Pour créer des composants React réutilisables et composables, nous privilégions le **pattern Compound Components**. Ce pattern permet de créer des APIs de composants flexibles où les sous-composants sont exposés comme propriétés du composant principal, offrant une composition déclarative tout en gardant le contrôle sur le rendu final.

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
