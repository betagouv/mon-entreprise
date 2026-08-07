# Infrastructure Clever Cloud (version Next.js)

## Vue d'ensemble

La version Next.js du site est hébergée sur **Clever Cloud**, sur deux applications Node distinctes — une par langue — dans la région `par` (Paris).

```
        GitHub Actions
   (deploy-next-clevercloud)
                │
        clever env import
        clever deploy
                │
    ┌───────────┴───────────┐
    ▼                       ▼
┌────────────────┐  ┌────────────────┐
│ App Node       │  │ App Node       │
│ Next.js FR     │  │ Next.js EN     │
│ LANGUE=fr      │  │ LANGUE=en      │
└────────────────┘  └────────────────┘
```

Contrairement à Netlify, où GitHub Actions construit le site et pousse le résultat statique, **Clever Cloud construit lui-même l'application** : le workflow ne fait que pousser le dépôt et déclencher le build.

La langue est figée au moment du build via la variable `LANGUE`, d'où la nécessité d'une application par langue. Les deux applications partagent le même hook de build, `build:next`, qui lit `LANGUE` dans l'environnement.

## Pipeline de déploiement

Workflow : [`.github/workflows/deploy-next-clevercloud.yaml`](../.github/workflows/deploy-next-clevercloud.yaml)

Déclencheurs : la fin en succès du workflow « Tests sur Master », et `workflow_dispatch`, qui permet de déployer n'importe quelle branche depuis l'interface GitHub. Comme pour le déploiement Netlify, l'enchaînement passe par `workflow_run` plutôt que par un `push` direct, pour ne jamais déployer un `master` dont les tests échouent. « Tests sur Master » construit les deux langues, ce qui garantit qu'un `master` vert se déploie effectivement sur Clever Cloud.

Étapes, pour chaque langue :

1. `clever link` — rattache le dépôt à l'application ciblée
2. `clever env import` — applique la configuration depuis `clevercloud/next-<langue>.env`
3. `clever deploy` — pousse le commit courant, ce qui déclenche le build sur Clever Cloud

## Configuration des applications

La configuration est versionnée dans `clevercloud/next-fr.env` et `clevercloud/next-en.env`.

> ⚠️ `clever env import` **remplace intégralement** les variables de l'application. Toute variable ajoutée à la main dans la console Clever Cloud sera supprimée au déploiement suivant. Ces deux fichiers sont la seule source de vérité.

| Variable                    | Rôle                                                                 |
| --------------------------- | -------------------------------------------------------------------- |
| `NODE_ENV`                  | `production`, requis par Clever Cloud                                |
| `LANGUE`                    | Langue du build, lue par `next.config.mjs`                           |
| `CC_NODE_DEV_DEPENDENCIES`  | `install` — **indispensable**, voir ci-dessous                       |
| `CC_POST_BUILD_HOOK`        | Build Next.js, après l'installation des dépendances                  |
| `CC_RUN_COMMAND`            | Démarrage du serveur Next.js                                          |
| `NEXT_PUBLIC_ENVIRONNEMENT` | Environnement exposé au client (`site/source/services/environnement`) |

### Pourquoi `CC_NODE_DEV_DEPENDENCIES=install`

Clever Cloud n'installe pas les `devDependencies` quand `NODE_ENV=production`. Or `next build` a besoin de `typescript`, `yaml-loader`, `tsx`… qui y sont déclarées. Sans cette variable, le build échoue à l'installation des dépendances.

### Ce qui n'a pas besoin d'être configuré

- **Version de Node** : `engines.node` (`^24`) du `package.json` racine prime sur `CC_NODE_VERSION`. Inutile de définir cette dernière.
- **Gestionnaire de paquets** : le `yarn.lock` racine et `packageManager: yarn@4.x` font détecter `yarn-berry` automatiquement. Pas de `CC_NODE_BUILD_TOOL` ni de `yarn install` en pré-build : Clever Cloud installe déjà les dépendances du workspace depuis la racine.
- **Port et interface d'écoute** : `next start` lit la variable `PORT` (fixée à 8080 par Clever Cloud) et écoute sur `0.0.0.0` par défaut.

Le build du monorepo (compilation des modèles publicodes, puis `next build` avec vérification TypeScript) est gourmand : Clever Cloud fixe `--max-old-space-size` au 3/4 de la RAM de l'instance, le `build-flavor` des applications doit être dimensionné en conséquence.

## Secrets GitHub

| Secret                  | Contenu                                      |
| ----------------------- | -------------------------------------------- |
| `CLEVER_TOKEN`          | `.profiles."0".token`                        |
| `CLEVER_SECRET`         | `.profiles."0".secret`                       |
| `CLEVER_ORGA_ID`        | ID de l'organisation Clever Cloud (`orga_…`) |
| `CLEVER_APP_ID_FR`      | ID de l'application FR (`app_…`)             |
| `CLEVER_APP_ID_EN`      | ID de l'application EN (`app_…`)             |

Le token et le secret proviennent de `~/.config/clever-cloud/clever-tools.json`, écrit par `clever login`. Ce sont des identifiants OAuth1 : ils authentifient `clever deploy` lui-même, et c'est la méthode que clever-tools recommande pour la CI. À ne pas confondre avec les jetons de `clever tokens create`, qui sont des jetons Bearer destinés à interroger l'API REST via `api-bridge.clever-cloud.com` et ne conviennent pas ici.

> ⚠️ Ces identifiants **expirent au bout d'un an** — le profil porte une `expirationDate`. À échéance, les deux déploiements échouent sur une authentification refusée : refaire un `clever login` et remplacer `CLEVER_TOKEN` et `CLEVER_SECRET`.

La CI déploie sous le compte de la personne qui a fait le `clever login`. Un compte de service dédié aux GitHub Actions serait préférable — les déploiements cesseraient de dépendre d'un compte individuel.
