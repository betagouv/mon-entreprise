# Comment contribuer ?

Merci de prendre le temps de contribuer ! 🎉

Voici quelques informations pour démarrer :

## Rapport de bug, nouvelles fonctionnalités

Nous utilisons GitHub pour suivre tous les bugs et discussions sur les nouvelles fonctionnalités. Pour rapporter un bug ou proposer une évolution vous pouvez [ouvrir une nouvelle discussion](https://github.com/betagouv/mon-entreprise/issues/new). N'hésitez pas à utiliser la recherche pour vérifier si le sujet n'est pas déjà traité dans une discussion ouverte.

## Développement

Si vous voulez participer au développement de nouvelles fonctionnalités, vous pouvez consulter la liste des «[🥇 good first issue](https://github.com/betagouv/mon-entreprise/issues?q=is%3Aopen+is%3Aissue+label%3A%22%F0%9F%A5%87+good+first+issue%22+) ». Ce sont des fonctionnalités intéressantes qui ne sont normalement pas trop complexe à implémenter. N'hésitez pas à poser toutes vos questions sur ces issues !

### Technologies

L'application est écrite en JavaScript, elle est exécuté uniquement côté client — il n'y a pas de serveur applicatif, nous générons des fichiers `.html` statiques

Nous utilisons :

-   [TypeScript](https://www.typescriptlang.org) pour ajouter un système de typage à notre code JavaScript. Le typage n'est pas utilisé partout et il n'est pas obligatoire de le prendre en compte pour contribuer.
-   [Yarn](https://yarnpkg.com) pour la gestion des dépendances (à la place de NPM qui est souvent utilisé dans les applications JavaScript)
-   [React](https://reactjs.org) pour la gestion de l'interface utilisateur
-   [Redux](https://redux.js.org) pour gérer le “state” de l'application côté client
-   [Prettier](https://prettier.io/) pour formater le code source, l'idéal est de configurer votre éditeur de texte pour que les fichiers soit formatés automatiquement quand vous sauvegardez un fichier. Si vous utilisez [VS Code](https://code.visualstudio.com/) cette configuration est automatique.
-   [ViteJS](https://vitejs.dev) pour le “bundling” et le serveur de développement
-   [Eslint](http://eslint.org) qui permet par exemple d'éviter de garder des variables inutilisées
-   [Vitest](https://vitest.dev) et [Cypress](https://www.cypress.io) pour les l'execution des tests. Plus d'informations dans la section consacrée aux tests.

### Démarrage

Si possible, assurez-vous d'avoir toutes les clés d'API nécessaires dans votre fichier
`site/.env` (un template est disponible dans `site/.env.template`).
**NB : ne vous inquiétez pas, ceci n'est pas nécessaire pour effectuer une première contribution à
la base de code !** Cependant, vous en aurez besoin pour la commande `yarn prepare` et pour les
commandes de traduction automatique français -> anglais. Si vous êtes confronté à ce type de besoin,
demandez l'aide des contributeurs du projet.

Si l'historique des commits est trop volumineux, vous pouvez utiliser le paramètre `depth` de git pour ne télécharger que les derniers commits.

```
# Clone this repo on your computer
git clone --depth 100 git@github.com:betagouv/mon-entreprise.git

# Mettre à jour votre config git locale
git config blame.ignoreRevsFile .git-blame-ignore-revs

# Install the Javascript dependencies through Yarn
yarn install

# Download some data
yarn prepare

# Run the dev server for mon-entreprise
yarn start
```

L'application est exécutée sur http://localhost:3000/mon-entreprise pour la version française et
http://localhost:3000/infrance pour la version anglaise.

Pour activer le traçage Redux:

```
REDUX_TRACE=true yarn start
```

### Messages de commit

A mettre sans retenue dans les messages de commit :

-   🎨 `:art:` pour une modification de l'UI
-   🐎 `:racehorse:` pour une amélioration de performance
-   🐛 `:bug:` pour une correction de bug
-   🔥 `:fire:` pour une suppression de code ou de fichier
-   💚 `:green_heart:` pour une correction de CI
-   ✅ `:white_check_mark:` pour un ajout de test
-   ⬆️ `:arrow_up:` pour une mise à jour de dépendances
-   ✨ `:sparkles:` pour une ré-organisation du code
-   ⚙ `:gear:` pour une contribution sur le moteur publicodes
-   🔨 `:hammer:` pour une contribution à la base de règles
-   📆 `:calendar:` pour un changement de règle du à une évolution temporelle (en attendant mieux)
-   📈 `:chart_with_upwards_trend:` pour une amélioration du tracking
-   👽 `:alien:` pour ajouter des traductions
-   ♿ `:wheelchair:` pour corriger les problèmes liés à l'accessibilité
-   🖋 `:fountain_pen:` pour séparer les commits liés à la modification du contenu
-   🔍 `:mag:` pour les modifications liées au référencement naturel

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

#### Tests de non-regression (snapshots)

```sh
yarn test regressions
```

Si vous souhaitez mettre à jour les snapshots vous pouvez utiliser le paramètre `--update`, son raccourci `-u`.

#### Tests d'integrations

Pré-requis:

-   le browser chromium doit être installé. Les builds peuvent être trouvés sur
    le [site de Cypress](https://chromium.cypress.io/)
-   le serveur doit être lancé via `yarn start`

```sh
yarn workspace site test:dev-e2e:mon-entreprise
yarn workspace site test:dev-e2e:mycompanyinfrance
```

### Traduction 👽

Le site est disponible en français, et en anglais sur https://mycompanyinfrance.urssaf.fr

Les traductions se trouvent dans le répertoire `site/source/locales`.

La librairie utilisée pour la traduction de l'UI est
[react-i18next](https://react.i18next.com/).

Lorsque l'on introduit une nouvelle chaîne de caractère dans l'UI il faut
systématiquement penser à gérer sa traduction, via un composant `<Trans>`, ou
via la fonction `t`

Le circle-ci fait une analyse statique du code pour repérer les chaînes non
traduites, dans le moteur et l'UI :

```sh
yarn run i18n:check
```

Pour traduire automatiquement les chaînes manquantes via l'api Deepl :

```sh
cd site
yarn run i18n:rules:translate
yarn run i18n:ui:translate

# ou bien pour les deux commandes d'un coup
yarn run i18n:translate
```

N'oubliez pas de vérifier sur le diff que rien n'est choquant.

### CI/CD

-   Nous utilisons des [Github actions](https://github.com/features/actions) pour faire tourner les builds et
    tests.
-   [Netlify](https://www.netlify.com/), s'occupe de l’hébergement du site sur Internet avec gestion des DNS.

### Prévisualisation

Il est possible de simuler localement le comportement de l'application après le build complet, y compris le pré-rendu statique et les redirection Netlify, avec les commandes suivantes (à éxécuter dans le répertoire `site`):

```sh
yarn run build:preview
```

```sh
yarn preview:mon-entreprise
yarn preview:infrance
```

### Tests

Pour tester les règles, il est recommandé de:

-   faire tourner un simulateur et vérifier à la main l'adéquation des règles avec les normes
    traduites ;
-   créer des cas de tests de non-régression sous la forme de nouveaux snapshots (cf.
    `site/test/regressions`).

En local, le moteur de recherche n'est pas mis à jour automatiquement et la liste des règles
est exposée ici: http://localhost:8080/mon-entreprise/documentation/dev

## Publicodes

### Documentation

La documentation de publicodes est disponible sur https://publi.codes.

Un wiki contenant des informations intéressantes sur publicodes et le
raisonnement ayant abouti à ce langage sont dispos sur le repository
[betagouv/publicodes](https://github.com/betagouv/publicodes/wiki)

Pour se familiariser avec les règles, vous pouvez jeter un œil aux fichiers
contenant les règles elles-mêmes (dans le dossier `modele-social`) mais cela
peut s'avérer assez abrupt.

Essayez plutôt de jeter un œil [aux tests](https://github.com/betagouv/publicodes/tree/master/core/test/m%C3%A9canismes)
dans un premier temps, et pourquoi pas à [à l'implémentation des mécanismes](https://github.com/betagouv/publicodes/tree/master/core/source/mecanisms).

### Traduction des normes (lois) en règles Publicodes

Checklist:

-   [ ] Lire les articles de vulgarisation (sur le site de l'URSSAF, des impôts, etc.).
-   [ ] Utiliser un moteur de recherche spécialisé, comme [RFPaye](https://rfpaye.grouperf.com/).
-   [ ] [Lire les normes][wiki normes] et noter leurs référence dans les règles Publicodes.

[wiki normes]: https://github.com/betagouv/mon-entreprise/wiki/Comment-lire-les-normes-(la-loi)-efficacement-pour-r%C3%A9diger-des-r%C3%A8gles-Publicodes%3F

### Développement simultané de Publicodes et de mon-entreprise

Il est parfois utile de tester des évolutions de publicodes sur mon-entreprise. C'est possible de la manière suivante :

-   cloner les deux dépôts
-   sur le dépôt `publicodes` lancer un `yarn build --watch` pour avoir du rechargement à chaud
-   sur le dépôt `mon-entreprise` lancer un `yarn link ../publicodes --all` pour lier dynamiquement les paquets `publicodes` et `publicodes-react`

La commande yarn link prend en paramètre un chemin relatif au dépôt courant, et fonctionne uniquement en local.

Pour revenir au paquet publié sur NPM il faut utiliser

```sh
yarn unlink --all
```

Pour déployer une version preview de mon-entreprise utilisant une version de publicodes non publiée sur NPM il est possible de référencer un commit ou une branche dans l'attribut résolution du `package.json` :

```json
{
    "publicodes": "betagouv/publicodes#head=refacto&workspace=publicodes",
    "publicodes-react": "betagouv/publicodes#head=refacto&workspace=publicodes-react"
}
```

## Retours utilisateurs

Nous gérons les retours utilisateurs avec plusieurs outils :

-   [Crisp](https://crisp.chat/fr) pour reçevoir et répondre aux messages
-   Github pour suivre le développement des demandes
-   et ATInternet, notre outil de statistiques, pour suivre la notation des pages

Nous recevons les messages des utilisateurs sur Crisp. Si la demande concerne une nouvelle fonctionnalité, nous ouvrons un ticket sur Github avec l'étiquette [retour utilisateur](https://github.com/betagouv/mon-entreprise/issues?q=is%3Aissue+is%3Aopen+label%3A%22%F0%9F%8F%93+retour+utilisateur%22). Cela nous permet de récupérer la liste des demandes avec l'API Github pour l'afficher sur le site.

Crisp permet également d'ajouter une étiquette au message, ce qui nous permet de l'associer au ticket Github correspondant. Avec l'API Crisp, nous pouvons ainsi compter le nombre de demandes sur une fonctionnalité donnée. Enfin quand le ticket est fermé sur Github un petit robot nous rappelle de prévenir les utilisateurs qui nous on fait le retour, ainsi on peut revenir vers eux même plusieurs mois après pour leur indiquer que leur demande a été intégrée.

Quant à la notation des pages avec des smileys, elle fonctionne via des événements personnalisés remontés sur notre outil de statistiques. Nous récupérons le nombre d'événements par page avec l'API fournie pour la présenter sur notre [page statistique dédiée](https://mon-entreprise.urssaf.fr/stats).

Là-aussi nous utilisons l'API fournie pour récupérer les valeurs par page et les présenter vis avec l'API pour la présenter sur notre page statistiques.
