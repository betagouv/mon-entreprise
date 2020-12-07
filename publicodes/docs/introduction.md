Publicode est un langage déclaratif pour encoder les algorithmes d'intérêt
public. Il permet de réaliser des calculs généraux tout en fournissant une
explication permettant de comprendre et de documenter ces calculs.

Publicode est adapté pour modéliser des domaines métiers complexes pouvant être
décomposés en règles élémentaires simples (comme la [législation socio-fiscale](https://github.com/betagouv/mon-entreprise/tree/master/publicodes),
[un bilan carbone](https://github.com/laem/futureco-data/blob/master/co2.yaml),
un estimateur de rendement locatif, etc.).

Il permet de générer facilement des simulateurs web interactifs où l'on peut affiner
progressivement le résultat affiché, et d'exposer une documentation du calcul explorable.

### Aperçu

```yaml
prix d'un repas:
    formule: 10 €/repas

nombre de repas:
    formule: 5 repas

prix total:
    formule: nombre de repas * prix d'un repas

prix net:
    formule: prix total * (1 - TVA)

prix net . TVA: 20%
```
