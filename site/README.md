# [mon-entreprise.urssaf.fr](https://mon-entreprise.urssaf.fr)

Site 100 % statique, en Typescript, développé avec [React](https://reactjs.org/).

## Démarrage

### Cloner le projet

```sh
# Clone this repo on your computer
git clone --depth 100 git@github.com:betagouv/mon-entreprise.git

# Mettre à jour votre config git locale
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

Si l'historique des commits est trop volumineux, vous pouvez utiliser le paramètre `depth` de git pour ne télécharger que les derniers commits.

### Fichier .env

Si possible, assurez-vous d'avoir toutes les clés d'API nécessaires dans votre fichier
`site/.env` (un template est disponible dans `site/.env.template`).

> [!NOTE]
> Pas d'inquiétude, ceci n'est pas nécessaire pour effectuer une première contribution à la base de code\*\*
> Cependant, vous en aurez besoin pour la commande `yarn postinstall` et pour les commandes de traduction automatique français -> anglais.
> Si vous êtes confronté à ce type de besoin, demandez l'aide des contributeurs du projet.

### Installation des dépendances

```sh

# Install the Javascript dependencies through Yarn
yarn install

# Optional : fetch API data (stats, releases, etc.)
yarn postinstall

# Run the dev server for mon-entreprise
yarn start
```

## Tests

### Test unitaires / non regression

Nous utilisons [vitest](https://vitest.dev/) pour les tests.

Les règles publicodes de `modele-social` sont testées dans le dossier `[./test/regression]` avec des [snapshots](https://vitest.dev/guide/snapshot.html).

```sh
  yarn test
```

#### Mise à jour des snapshots

Nous testons un grand nombre de situations sur chaque simulateur, pour vérifier que les modification de règles suite à un changement de législation ou à l'implémentation d'un nouveau dispositif n'entrainent pas de résultats inattendus.

Si les changements apportés sont attendus, il est possible de mettre à jour les snapshots avec la commande suivante :

```sh
  yarn test -u
```

### Tests d'integrations

Nous utilisons [Cypress](https://www.cypress.io/) pour les tests d'intégration.
Pré-requis:

```sh
yarn start &
yarn test:cypress
```

Pour tester la version anglaise :

```
yarn test:cypress:mycompanyinfrance
```

Nous utilisons des [fixtures](./cypress/fixtures) pour simuler les appels API. Pour les mettre à jour, il faut lancer le serveur de dev et lancer la commande suivante :

```sh
test:cypress:record-http
```

## Déploiement

Le site est déployé sur Netlify, à chaque push sur la branche `master`. Par ailleurs, toutes les PR sont automatiquement déployées sur des URL de type `https://<PR-NUMBER>--mon-entreprise.netlify.app`.

### Prerender

La plupart des pages sont pré-rendues statiquement lors du déploiement, pour améliorer les performances et le SEO. Un [script]('./site/build/prerender.ts') se charge de générer les pages statiques grâce à `renderToReadableStream`, et de les placer dans le dossier `site/dist/prerender`.

Pour ajouter des pages à pré-rendre, il faut les ajouter dans le fichier `site/build/prerender.ts`.

_A noter : nous n'utilisons pas `nextJS` pour des raisons historiques, mais il serait souhaitable de migre l'application à l'avenir_

## FAQ

### Comment ajouter un nouveau simulateur ?

Pour ajouter un nouveau simulateur, il faut :

-   Créer un nouveau dossier dans `site/source/pages/simulateurs/` (ou `/assistant` si il s'agit d'un outil avec un parcours sur plusieurs pages).
-   Créer un fichier `config.tsx` dans ce dossier, qui contient informations reliées au simulateur (nom, description, icône, etc.). Le type est [PageConfig](./source/pages/simulateurs/_configs/types.ts). **[Voir un exemple](./source/pages/simulateurs/salarie/config.ts)**
-   Créer la config de simulation dans le fichier `simulationConfig.ts`. Cette dernière contient la situation Publicodes et les paramètres pour configurer le simulateur. **[Voir un exemple](./source/pages/simulateurs/salarie/simulationConfig.ts)**
-   Ajouter le simulateur sur la page /simulateurs-et-assistants, dans le fichier `site/source/pages/simulateurs-et-assistants/index.tsx`\*\*
-   Ajouter une route pour le simulateur dans le fichier `sitePaths`, avec la version anglaise également.

### Redirections

Les redirections sont gérées par netlify, via le fichier [`netlify.base.toml`](./netlify.base.toml).

C'est également dans ce fichier que sont définies les `Content-Security-Policy`.

### Traduction 👽

Le site est disponible en français, et en anglais sur https://mycompanyinfrance.urssaf.fr

Les traductions se trouvent dans le répertoire `site/source/locales`.

La librairie utilisée pour la traduction de l'UI est
[react-i18next](https://react.i18next.com/).

Lorsque l'on introduit une nouvelle chaîne de caractère dans l'UI il faut
systématiquement penser à gérer sa traduction, via un composant `<Trans>`, ou
via la fonction `t`

Le CI fait une analyse statique du code pour repérer les chaînes non
traduites, dans le moteur et l'UI :

```sh
yarn run i18n:check
```

Pour traduire automatiquement les chaînes manquantes via l'api [Deepl](https://www.deepl.com/en/docs-api) :

```sh
yarn run i18n:translate
```

N'oubliez pas de vérifier sur le diff que les traductions vous paraissent correctes.

### Prévisualisation locale

Il est possible de simuler localement le comportement de l'application après le build complet, y compris le pré-rendu statique et les redirection Netlify, avec les commandes suivantes:

```sh
yarn run build:preview
```

```sh
yarn preview

# pour la version anglaise
yarn preview:en
```

### Statistiques

Nous utilisons ATInternet pour le reccueil des usages. La hierarchie des pages est organisée en 3 chapitre et un nom de page. Seul le chapitre 1 et le nom sont obligatoires.

-   Chapitre 1 : par exemple `simulateurs` ou `assistant`. La liste est définie dans le fichier `source/components/ATInternetTracking/index.tsx`
-   Chapitre 2 : le nom du simulateur / de l'assistant / de la famille de simulateur
-   Chapitre 3 : le nom du simulateur si il n'est pas dans le chapitre 2

On utilise le nom de la page pour signifier les étapes dans le parcours de l'utilisateur. Par exemple, pour la plupart des simulateurs, on a les pages suivantes `accueil`, `simulation_commencee` `simulation_terminee`. Quand bien même il n'y a qu'une seule et même URL.

Cela permet de suivre le parcours des utilisateurs dans les simulateurs, et de voir les taux de completion facilement. Ces données sont ensuites compilées pour afficher la page /stats.

## Maintenir l'accessibilité

Des conseils et bonnes pratiques sont réunis dans le document [ACCESSIBILITY.md](./ACCESSIBILITY.md).
