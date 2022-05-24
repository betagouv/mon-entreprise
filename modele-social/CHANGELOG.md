## 1.0.0-beta.1

-   Passage du paquet en semver (voir le README)
-   Sépare le fichier salarié en plusieurs fichiers séparés

Les changements suivants sont cassants :

-   renomme l'espace de nom `contrat salarié` en `salarié`
-   réécrit les règles liées au remboursement des frais domicile/travail
-   réécrit les règles liées aux CDD
-   déplace les éléments immuable de la rémunération dans l'espace `salarié . contrat`. Il s'agit de `temps partiel`
-   TODO...
    salarié . contrat : les éléments contractuels (inscrits dans le contrat de travail)
    salarié . rémunération : tous les éléments relatifs à la rémunération (salaire brut, net, primes,
    avantages en nature)
    salarié . régimes spécifiques : les règles liées aux régimes spéciaux (DFS, cadre, impatriés, etc)

## 0.7.0

Fixe une version de publicodes minimum en peerDependancy.
Réecrit les règles pour fonctionner avec la dernière version de publicodes (=40)

## 0.6.1

Ajout des déclarations de type dans le paquet

## 0.6.0

Publication du paquet sous forme d'ES modules.
