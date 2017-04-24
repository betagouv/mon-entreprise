

Version 'OpenFisca'

```yaml
- seuil: 0
  taux: 0%
- seuil: 1
  taux: 7.8%
- seuil: 8
  taux: 0%
```
Le problème de cette syntaxe, c'est que ce ne sont pas des tranches : la tranche 1 ne contient pas assez d'informations pour être calculée !

Version plus explicite :

```yaml
- de: 0
  à:  1
  taux: 0%
- de: 1
   à: 8
  taux: 7.8%
- de: 8
  taux: 0%
```

Ou, étant donné que les barèmes se suivent a priori toujours et commencent à zéro :

```yaml
- en-dessous de: 1
  taux: 0%
- de: 1
  à: 8
  taux: 7.8%
- au-dessus de: 8
  taux: 0%
```

Autre version possible :

```yaml
seuils:
  0: 0%
  1: 7.8%
  8: 0%
```
