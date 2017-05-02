```yaml
logique numérique: # première valeur trouvée, sinon 0
  - poursuite du CDD en CDI: 0%
  # - Contrat . type : # mécanisme de match à introduire une fois les entités gérées. Exclusivité exprimée dans l'entité Type
  - conditions exclusives:
    # ce n'est pas évident de savoir le type d'un CDD, proposer le calcul dans une autre variable !!
    - CDD type accroissement temporaire d'activité:
        - contrat de travail durée ≤ 1 mois: 3%
        - contrat de travail durée ≤ 3 mois: 1.5%
    - CDD type usage:
        - contrat de travail durée ≤ 3 mois: 0.5%
  # - True: 0% # Ce mécanisme ajoute automatiquement cette ligne :)


logique numérique 2:
  - poursuite du CDD en CDI: 0%
  - aiguillage: # signale que les deux propositions sont exclusives
      sujet: Contrat . type
      propositions:
        - accroissement temporaire d'activité:
          - contrat de travail durée ≤ 1 mois: 3%
          - contrat de travail durée ≤ 3 mois: 1.5%
        - usage:
          - contrat de travail durée ≤ 3 mois: 0.5%
```


On aurait aussi pu écrire la formule de façon plus explicite mais plus verbose :
```yaml
      variations:
        - si: motif . accroissement temporaire activité:
            variations:
              - si: durée contrat <= 1
                taux: 3%
              - si: durée contrat <= 3
                taux: 1.5%
        - si: motif . usage:
            variations:
              - si: durée contrat <= 3
                taux: 0.5%

```
