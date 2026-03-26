# Infrastructure Netlify

## Vue d'ensemble

Le site mon-entreprise est hébergé sur **Netlify**. L'infrastructure repose sur **deux projets Netlify distincts** et des services backend sur **Scalingo**.

```
                            Utilisateur
                                │
                ┌───────────────┴───────────────┐
                ▼                               ▼
        mon-entreprise.fr              mon-entreprise.urssaf.fr
        mycompanyinfrance.fr           mycompanyinfrance.urssaf.fr
                │                               │
                ▼                               ▼
  ┌───────────────────────┐      ┌────────────────────────────┐
  │ Projet Netlify        │      │ Projet Netlify             │
  │ "mon-entreprise.fr"   │      │ "mon-entreprise.urssaf.fr" │
  │                       │      │                            │
  │ Redirections 301      │      │ Site statique (SPA)        │
  │ vers *.urssaf.fr      │      │ Cert: Custom URSSAF        │
  │                       │      └─────────┬────┬─────────────┘
  │ Cert: Let's Encrypt   │          /api/* │    │ /server/*
  └───────────────────────┘               ▼    ▼
                              ┌────────────────────────────┐
                              │          Scalingo          │
                              │   • API REST (Koa.js)      │
                              │   • Server (Koa.js)        │
                              └────────────────────────────┘
```

## Projet 1 : `mon-entreprise.urssaf.fr` (production)

### Rôle

C'est le **site principal de production**. Il sert le contenu statique du site mon-entreprise (SPA React).

### Domaines

| Domaine                       | Rôle                  |
| ----------------------------- | --------------------- |
| `mon-entreprise.urssaf.fr`    | Domaine primaire (FR) |
| `mycompanyinfrance.urssaf.fr` | Version anglaise      |
| `mon-entreprise.netlify.app`  | Sous-domaine Netlify  |

### Certificat SSL

-   **Type** : Custom (fourni par l'URSSAF)
-   **Domaines couverts** : `mon-entreprise.urssaf.fr`, `mycompanyinfrance.urssaf.fr`, `www.mycompanyinfrance.urssaf.fr`
-   **Renouvellement** : Manuel, par l'URSSAF

Ajouter un nouveau domaine (ex : `www.mon-entreprise.urssaf.fr`) nécessite que l'URSSAF réémette le certificat en incluant ce domaine.

### Processus de build

Les builds Netlify natifs sont **désactivés** ("Builds are stopped" dans l'interface).
Le build et le déploiement sont orchestrés par **GitHub Actions** :

1. **Déclencheur** : push sur `master` (workflow `deploy-production.yaml`)
2. **Build** : GitHub Actions exécute `yarn workspace site build`, puis `build:ssr` et `build:prerender`
3. **Préparation du netlify.toml** : Les placeholders (`:API_URL`, `:SERVER_URL`, `:SITE_FR`, `:SITE_EN`) dans `site/netlify.base.toml` sont remplacés par les vraies URLs de production
4. **Déploiement** : L'action `nwtgck/actions-netlify` pousse le résultat statique vers Netlify

Fichiers clés :

-   `.github/workflows/deploy-production.yaml` — Workflow déclenché sur push master
-   `.github/workflows/_build-and-deploy-prod.yaml` — Workflow réutilisable (build + deploy)
-   `site/netlify.base.toml` — Configuration Netlify (redirections, headers, CSP)

### Proxy vers Scalingo

Le site Netlify proxifie certaines routes vers les services backend hébergés sur **Scalingo** (région OSC-FR1). Ces proxys sont transparents pour l'utilisateur (status 200) :

| Route Netlify | Backend Scalingo                               |
| ------------- | ---------------------------------------------- |
| `/api/*`      | `mon-entreprise-api.osc-fr1.scalingo.io/api/*` |
| `/server/*`   | `mon-entreprise-server.osc-fr1.scalingo.io/*`  |

Cette configuration se trouve dans `site/netlify.base.toml`.

### Déploiement des PR

Chaque PR est déployée en preview :

-   URL : `{pr-number}--mon-entreprise.netlify.app` (FR) et `{pr-number}-en--mon-entreprise.netlify.app` (EN)
-   Workflow : `pr-check.yaml` → `pr-deploy.yaml`
-   Les backends sont aussi déployés en preview sur Scalingo (`mon-entreprise-api-pr{N}.osc-fr1.scalingo.io`)

## Projet 2 : `mon-entreprise.fr` (redirections legacy)

### Rôle

Ce projet ne sert **aucun contenu**. Il redirige en 301 les anciens domaines (`mon-entreprise.fr`, `mycompanyinfrance.fr`) vers les nouveaux domaines en `*.urssaf.fr`.

### Domaines

| Domaine                    | Rôle                      |
| -------------------------- | ------------------------- |
| `mon-entreprise.fr`        | Domaine primaire          |
| `www.mon-entreprise.fr`    | Redirige vers le primaire |
| `mycompanyinfrance.fr`     | Alias                     |
| `www.mycompanyinfrance.fr` | Alias                     |

### Certificat SSL

-   **Type** : Let's Encrypt (géré automatiquement par Netlify)
-   **Domaines couverts** : `*.mon-entreprise.fr`, `*.mycompanyinfrance.fr`, `mon-entreprise.fr`, `mycompanyinfrance.fr`
-   **Renouvellement** : Automatique

### Pourquoi un projet séparé ?

Netlify ne permet pas de mixer deux certificats SSL sur un même projet. Les domaines `*.urssaf.fr` utilisent un certificat custom URSSAF, tandis que les domaines legacy (`*.mon-entreprise.fr`, `*.mycompanyinfrance.fr`) utilisent Let's Encrypt. D'où la nécessité de deux projets distincts.

### Configuration

Fichier : `site/mon-entreprise.fr/netlify.toml`

Redirections configurées :

-   `mon-entreprise.fr/*` → `mon-entreprise.urssaf.fr/:splat` (301)
-   `mycompanyinfrance.fr/*` → `mycompanyinfrance.urssaf.fr/:splat` (301)
-   Scripts d'intégration legacy vers les nouvelles URLs

## Chaîne DNS

```
mon-entreprise.urssaf.fr
  → CNAME → www.mon-entreprise.fr
    → Netlify (35.157.26.135 / 63.176.8.218)

mon-entreprise.fr
  → Netlify DNS
    → Netlify (mêmes IPs)
```

Les domaines legacy et les domaines de production arrivent sur les **mêmes serveurs Netlify**. C'est le **header Host** de la requête HTTP qui détermine quel projet Netlify répond et donc quelle configuration (redirections ou site de production) est appliquée.

## Configuration Netlify du site de production

### Headers de sécurité (CSP)

Définis dans `site/netlify.base.toml`, les Content Security Policy autorisent notamment :

-   API internes : `*.incubateur.net`, `recherche-entreprises.api.gouv.fr`
-   Analytics : `tag.aticdn.net`, `tm.urssaf.fr`, `plausible.io`
-   Recherche : `*.algolia.net`, `*.algolianet.com`
-   Iframes : YouTube, CodeSandbox, Stackblitz

### Redirections architecturales

Le fichier `site/netlify.base.toml` contient de nombreuses redirections 301 pour maintenir la compatibilité SEO après les refactorisations (renommage de routes, réorganisation du modèle social, etc.). L'ordre des redirections est important — des commentaires dans le fichier signalent les sections à ne pas déplacer.

### SPA routing

Les routes qui ne matchent aucun fichier statique ni aucune redirection sont servies par les fichiers HTML de l'application single-page :

-   Routes FR → `/mon-entreprise.html`
-   Routes EN → `/infrance.html`
