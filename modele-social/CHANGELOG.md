# Journal des modifications
## 1.3.0

## 1.2.0

### Fix et réecritures

- Répare l’ACRE qui ne fonctionnait plus pour les SASU, en ajoutant une règle `dirigeant . assimilé salarié . cotisations`
- La règle `dirigeant . auto-entrepreneur . impôt . revenu imposable` est maintenant une simple indirection vers `entreprise . imposition . régime . micro-entreprise . revenu abattu` (auparavant, elle réimplémentait la même logique)
- La règles `dirigeant . auto-entrepreneur . chiffres d'affaires` ne remplace plus `entreprise . chiffre d'affaires`. On peut donc utiliser de manière indiférenciée `entreprise . chiffre d'affaires` ou `dirigeant . auto-entrepreneur . chiffres d'affaires` pour spécifier le chiffre d’affaires de l’auto-entrepreneur


### Nouveautés legislatives
- L’assiette minimale retraite pour les indépendant a été modifiée courant de l’année pour pouvoir assurer 3 trimestres validés (ce n’était pas le cas avec la valeur par défaut). Création de la règle `dirigeant . indépendant . assiette minimale . retraite . en 2022`
- Le taux de cotisation indemnité maladie des conjoints collaborateur AC/PLNR est de 0,50% desormais (au lieu d’être aligné sur celui du gérant)

### Protection sociale : implémentation de la retraite et des IJSS en `experimental`
- Suppression du montant estimé de la retraite, au profit de deux nouvelles règles, plus representative : 
  - `protection sociale . retraite . base . cotisée` qui correspond au revenu pris en compte pour les 25 meilleures années dans le calcul de la pension de la retraite de base
  - `protection sociale . retraite . complémentaire` qui correspond au supplément de pension de retraite acquis grâce à une année complète de cotisation retraite complémentaire
- Uniformisation du calcul de `protection sociale . retraite . trimestres` entre les salariés et les indépendants
- Renommage de `protection sociale . santé` en `protection sociale . maladie` qui est le nom « officiel » de la branche
- Ajout de `protection sociale . maladie . arrêt maladie` pour le montant des indemnités journalière versées par la CPAM en cas d’arrêt maladie.


## 1.1.0

### Loi du 16 août 2022 portant mesures d’urgence pour la protection du pouvoir d’achat

- Ajoute la possibilité de spécifier un taux de participation employeur pour le remboursement des frais d’abonnement de transport en commun. La participation employeur est déductible jusqu’à 75% maintenant
- Augmente les plafonds de déductibilité de remboursement des frais de trajet domicile/travail
- Augmente le plafond de déductibilité des titres-restaurants
- Ajoute l’extension de la déduction forfaitaire pour heures supplémentaires aux entreprises de plus de 20 salariés

## 1.0.0

- Déplace la question ACRE sur le dirigeant plutôt que l’entreprise
- Sépare `activité` et `activité . nature`

## 1.0.0-beta.2

- Réécrit les règles de la cotisation AT/MP
- Supprime le recours au mécanisme synchronisation pour la localisation de l’établissement
- Ajoute le tag `experimental` à de nouvelles règles

## 1.0.0-beta.1

- Passage du paquet en semver (voir le README)
- Sépare le fichier salarié en plusieurs fichiers séparés
- Ajoute un tag experimental sur les règles susceptible de casser

Les changements suivants sont cassants :

- renomme l’espace de nom `contrat salarié` en `salarié`
- réécrit les règles liées au remboursement des frais domicile/travail
- réécrit les règles liées aux CDD
- déplace les éléments relatif au contrat dans `salarié . contrat`. Il s’agit de `temps partiel`, `salaire brut` ou encore le `statut cadre`
- tous les éléments relatifs à la rémunération sont déplacés dans `salarié . rémunération`
- `salarié . régimes spécifiques` : les règles liées aux régimes spéciaux (DFS, cadre, impatriés, etc)
- `plafond sécurité sociale temps plein` devient `plafond sécurité sociale`
- toutes les cotisations sont déplacées dans l’espace de nom `salarié . cotisations`, et utilisent les acronymes comme nom tant que possible.

**Corrections de bugs**

- Ajoute la limite de déduction sur la part employeur des prévoyances
- Enlève la CSA de l’exonération JEI
- Réecrit les règles de déductions des frais de transport domicile / travail pour coller à la réglementation
- Réecrit les règles sur le CDD pour une meilleure expérience question par question
- Précise le calcul de l’assiette de la CSG
- Corrige le calcul de la rémunération brut avec prévoyance

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
