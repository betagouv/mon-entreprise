Un langage déclaratif pour modéliser des domaines métiers complexes en les décomposant en règles élémentaires simples (comme la [législation socio-fiscale](https://github.com/betagouv/mon-entreprise/tree/master/publicodes),
[un bilan carbone](https://github.com/laem/futureco-data/blob/master/co2.yaml),
un estimateur de rendement locatif, etc.).

En plus de calculer des résultats à partir d'une situation saisie, publicodes génère automatiquement une documentation complète sur le Web, et des simulateurs interactifs où l'utilisateur peut répondre question après question pour affiner son résultat.

### Aperçu

```yaml
prix d'un repas: 10 €/repas

nombre de repas: 5 repas

prix: nombre de repas * prix d'un repas

prix . HT: prix / (1 + TVA)

prix . TVA: 20%
```
