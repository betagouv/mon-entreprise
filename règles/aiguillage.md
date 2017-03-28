On discute ici des différentes syntaxes permettant d'exprimer un 'switch'.

La proposition suivante a l'avantage d'utiliser 'si' qui fait de suite comprendre cette notion de variation.
Elle semble la plus claire (1 test utilisateur...)

```yaml
formule:
  assiette: assiette cotisations sociales
  taux:
    variations:
      - si: statut cadre = non
        2017: 16%
        2016: 12%

      - si: statut cadre = oui
        2017: 6%
        2016: 2%
```

Etant donné que le statut cadre est une exception, on pourrait aussi utiliser cette syntaxe bien plus succinte.

```yaml
formule:
  assiette: assiette cotisations sociales
  taux:
    2017: 16%
    2016: 12%
    exception:
      si: statut cadre
      2017: 6%
      2016: 2%
```

Dans le cas d'une variable de type énumération, il peut être commode de factoriser le sujet comparé et de parler de 'cas'.

```yaml
formule:
  assiette: assiette cotisations sociales
  taux:
    régime salarial:
      - cas: agricol
        2017: 16%
        2016: 12%
      - cas: général
        2017: 6%
        2016: 2%
```


Celle-ci est identique à la précédente, mais ne contient pas de 'si' et est donc plus brève.
On peut la voit comme une alternative adaptée à certains endroits (?).

```yaml
formule:
  assiette: assiette cotisations sociales
  taux:
    logique numérique:
      statut cadre = non:
        2017: 16%
        2016: 12%

      statut cadre = oui:
        2017: 6%
        2016: 2%
```
