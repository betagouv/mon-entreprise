# Instructions pour Claude Code

Les règles du projet (mission, principes, conventions de code, tests, commits) sont celles de `CONTRIBUTING.md`, la référence de l'équipe, importée ci-dessous. Ce fichier n'ajoute que ce qui est utile à un agent : les commandes, l'ordre des opérations et les pièges connus.

@CONTRIBUTING.md

## Environnement et commandes

L'environnement est géré par Nix et direnv (`flake.nix`, `.envrc`). Toute commande qui a besoin de `node` ou `yarn` se lance ainsi :

```shell
direnv exec . <commande>
```

Dans un nouveau worktree git, exécuter aussitôt `direnv allow` et `yarn install`, puis copier `site/.env` (non versionné) depuis le worktree principal.

| Action                        | Commande                                                 |
| ----------------------------- | -------------------------------------------------------- |
| Builder les règles Publicodes | `yarn workspace modele-social build`                     |
| Serveur de développement      | `yarn workspace site run start`                          |
| Tests unitaires               | `yarn test` ou `yarn workspace site run test`            |
| Un seul test, sans watch      | `yarn workspace site run test --run -t "motif"`          |
| Mettre à jour des snapshots   | `yarn workspace site run test --run -t "motif" --update` |
| Vérification des types        | `yarn test:type`                                         |
| Lint (et correction)          | `yarn lint`, `yarn lint:fix`                             |
| Tests E2E                     | `yarn workspace site run test:cypress`                   |
| Générer les traductions       | `yarn workspace site run i18n:translate`                 |

## Ordre des opérations

- Après une modification des règles Publicodes : `yarn workspace modele-social build`, sinon `site` ne les voit pas. Ce build précède `i18n:translate`.
- Après un rebase ou un merge : rebuilder `modele-social`, `modele-as` et `modele-ti` avant de lancer les tests de `site`.
- Après avoir ajouté ou modifié des textes traduits : `yarn workspace site run i18n:translate`, et commiter les fichiers YAML générés avec le code.
- Toujours exécuter les tests ajoutés ou modifiés, et vérifier qu'un nouveau test échoue avant d'implémenter.
- Avant chaque commit : `prettier --write` et `yarn lint` sur les fichiers modifiés, puis `yarn test:type` si du TypeScript a changé, car Vitest ne vérifie pas les types.

## Pièges connus

- `import.meta.env` (API Vite) vaut `undefined` sous Next : passer par l'adaptateur d'environnement.
- Les noms de fichiers du graphe d'import Next ne doivent pas contenir d'accents (le build Turbopack plante) ; les identifiants accentués dans le code sont admis.
- L'espace insécable s'écrit `&nbsp;` en JSX ; le caractère brut est rejeté par ESLint.
- Ne jamais inventer de règle métier ni de valeur : sans source vérifiable, poser la question.

## Sentry

Instance self-hosted https://sentry.incubateur.net (organisation `betagouv`, projet `mon-entreprise`). Le MCP Sentry ne fonctionne pas avec cette instance : utiliser l'API REST.
