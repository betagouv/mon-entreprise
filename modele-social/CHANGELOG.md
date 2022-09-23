## 1.0.0-beta.2

-   Réecrit les règles de la cotisation AT/MP
-   Supprime le recours au mécanisme synchronisation pour la localisation de l’établissement
-   Ajoute le tag experimental à de nouvelles règles


## 1.0.0-beta.1

-   Passage du paquet en semver (voir le README)
-   Sépare le fichier salarié en plusieurs fichiers séparés
-   Ajoute un tag experimental sur les règles susceptible de casser

Les changements suivants sont cassants :

-   renomme l’espace de nom `contrat salarié` en `salarié`
-   réécrit les règles liées au remboursement des frais domicile/travail
-   réécrit les règles liées aux CDD
-   déplace les éléments relatif au contrat dans `salarié . contrat`. Il s’agit de `temps partiel`, `salaire brut` ou encore le `statut cadre`
-   tous les éléments relatifs à la rémunération sont déplacés dans `salarié . rémunération`
-   `salarié . régimes spécifiques` : les règles liées aux régimes spéciaux (DFS, cadre, impatriés, etc)
-   `plafond sécurité sociale temps plein` devient `plafond sécurité sociale`
-   toutes les cotisations sont déplacées dans l’espace de nom `salarié . cotisations`, et utilisent les acronymes comme nom tant que possible.

**Corrections de bugs**

-   Ajoute la limite de déduction sur la part employeur des prévoyances
-   Enlève la CSA de l’exonération JEI
-   Réecrit les règles de déductions des frais de transport domicile / travail pour coller à la réglementation
-   Réecrit les règles sur le CDD pour une meilleure expérience question par question
-   Précise le calcul de l’assiette de la CSG
-   Corrige le calcul de la rémunération brut avec prévoyance

**Note sur l’upgrade**
Pour les utilisateur des version précédente, la mise à jour risque d’être longue et fastidieuse. Nous nous en excusons. Le but de cette refacto est de prévenir les changement cassants au maximum à l’avenir.

Vous pouvez utiliser la fonction recherche de la documentation, et utiliser le nouveau menu de navigation des règles pour plus facilement trouver les nouvelles versions des règles utilisées.

## 0.7.0

Fixe une version de publicodes minimum en peerDependancy.
Réecrit les règles pour fonctionner avec la dernière version de publicodes (=40)

## 0.6.1

Ajout des déclarations de type dans le paquet

## 0.6.0

Publication du paquet sous forme d’ES modules.
