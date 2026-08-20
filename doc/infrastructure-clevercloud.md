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

## Review apps par PR

Workflow : [`.github/workflows/pr-review-app-clevercloud.yaml`](../.github/workflows/pr-review-app-clevercloud.yaml)

Chaque PR obtient une application éphémère, en français seulement, servie sur `mon-entreprise-pr-<numéro>.cleverapps.io`. Elle est créée au premier déploiement, redéployée à chaque push, et supprimée à la fermeture de la PR par un job de [`pr-cleanup.yaml`](../.github/workflows/pr-cleanup.yaml).

Le déclencheur est `workflow_run` sur « Vérification PR », et non `pull_request_target`. C'est ce qui rend les review apps sûres pour les contributions externes : une PR de fork n'exécute « Vérification PR » qu'après approbation d'un mainteneur, donc aucune application n'est créée tant que personne n'a regardé le code. Un workflow `pull_request_target` s'exécuterait au contraire sans approbation, puisqu'il tourne dans le contexte de la branche de base — n'importe qui pourrait alors faire construire et exécuter son code sur l'organisation Clever Cloud.

C'est le commit de fusion (`refs/pull/<n>/merge`) qui est déployé, comme pour la preview Netlify : les deux previews montrent donc le même code, celui que « Vérification PR » a validé. Une PR en conflit n'a pas de commit de fusion et ne se déploie pas.

Le runner n'exécute rien du code de la PR : il ne lance que des commandes `clever` et un `git push`. Le code de la PR est checkouté dans `pr/`, tandis que la racine du workspace porte la branche par défaut — d'où proviennent la configuration injectée dans l'application et l'action composite qui installe le CLI. Une PR ne peut donc influencer ni les variables de son application, ni ce que le runner exécute.

Le lien vers la review app est ajouté au commentaire de PR écrit par [`pr-deploy.yaml`](../.github/workflows/pr-deploy.yaml), à côté des previews Netlify. Les deux workflows étant indépendants, le lien peut apparaître avant que l'application soit prête.

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

Le `build-flavor` des applications doit être généreux : **XL**. Ce n'est pas `next build` qui impose cette taille, mais l'installation des dépendances — `yarn install` télécharge environ 330 Mo de paquets et déploie 1,8 Go de `node_modules`. Sur une instance trop petite, le déploiement échoue dès le *Fetch step* de yarn, sur un `Error happened while running yarn install` qui ne dit pas la cause. Le `flavor` d'exécution, lui, peut rester modeste : l'application ne fait que servir un serveur Next.

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
