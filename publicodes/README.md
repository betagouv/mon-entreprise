Publicodes est un langage déclaratif pour encoder les algorithmes d'intérêt
public. Il permet de réaliser des calculs généraux tout en fournissant une
explication permettant de comprendre et de documenter ces calculs.

Publicodes est adapté pour modéliser des domaines métiers complexes pouvant être
décomposés en règles élémentaires simples (comme la [législation socio-fiscale](https://github.com/betagouv/mon-entreprise/tree/master/publicodes),
[un bilan carbone](https://github.com/laem/futureco-data/blob/master/co2.yaml),
un estimateur de rendement locatif, etc.).

Il permet de générer facilement des simulateurs web interactifs où l'on peut affiner
progressivement le résultat affiché, et d'exposer une documentation du calcul explorable.

## Installation

```
npm install publicodes
```

## Documentation

-   [Se lancer](https://publi.codes/langage/se-lancer)
-   [Principes de base](https://publi.codes/langage/principes-de-base)
-   [Bac à sable](https://publi.codes/studio)

## Projets phares

-   **[mon-entreprise.fr](https://mon-entreprise.fr/simulateurs)** utilise publicodes
    pour spécifier l'ensemble des calculs relatifs à la législation socio-fiscale
    en France. Le site permet entre autre de simuler une fiche de paie complète,
    de calculer les cotisations sociales pour un indépendant ou encore connaître
    le montant du chômage partiel.
-   **[futur.eco](https://futur.eco/)** utilise publicodes pour calculer les bilans
    carbone d'un grand nombre d'activités, plats, transports ou biens.
-   **[Nos Gestes Climat](https://ecolab.ademe.fr/apps/climat)** utilise publicodes pour proposer un calculateur d'empreinte climat personnel de référence complètement ouvert
