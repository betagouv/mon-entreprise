## Liste des mécanismes existants

### `une de ces conditions`

C'est un `ou` logique.
Contient une liste de conditions.
Renvoie vrai si l'une des conditions est vraie.

```yaml
age:
  formule: 17 ans

mineur émancipé:
  formule: oui

peut voter:
  formule:
    une de ces conditions:
      - age > 18 ans
      - mineur émancipé
```

> [Lancer le calcul](http://localhost:8080/publicodes/studio?code=date%20de%20d%C3%A9but%3A%20%0A%20%20formule%3A%2012%2F02%2F2020%0A%20%20%0Aanciennet%C3%A9%20en%20fin%20d%27ann%C3%A9e%3A%0A%20%20formule%3A%20%0A%20%20%20%20dur%C3%A9e%3A%0A%20%20%20%20%20%20%20depuis%3A%20date%20de%20d%C3%A9but%0A%20%20%20%20%20%20%20jusqu%27%C3%A0%3A%2031%2F12%2F2020%0A%0Aprime%20de%20vacances%3A%0A%20%20applicable%20si%3A%20anciennet%C3%A9%20en%20fin%20d%27ann%C3%A9e%20%3E%201%20an%0A%20%20formule%3A%20200%E2%82%AC)

### `toutes ces conditions`

C'est un `et` logique.
Contient une liste de conditions.
Renvoie vrai si toutes les conditions vraies.

### `produit`

C'est une multiplication un peu améliorée, très utile pour exprimer les cotisations.

Sa propriété `assiette` est multipliée par un pourcentage, `taux`, ou par un `facteur` quand ce nom est plus approprié.

La multiplication peut être plafonnée : ce plafond sépare l'assiette en deux, et la partie au-dessus du plafond est tout simplement ignorée. Dans ce cas, elle se comporte comme une barème en taux marginaux à deux tranches, la deuxième au taux nul et allant de `plafond` à l'infini.

```yaml
plafond sécurité sociale:
  formule: 3428 €/mois

assiette cotisation:
  formule: 2300 €/mois

chômage:
  formule:
    produit:
      assiette: assiette cotisation
      plafond: 400% * plafond sécurité sociale
      taux: 4.05%
```

[Lancer le calcul](https://publi.codes/studio?code=plafond%20s%C3%A9curit%C3%A9%20sociale%3A%0A%20%20formule%3A%203428%20%E2%82%AC%2Fmois%0A%0Aassiette%20cotisation%3A%20%0A%20%20formule%3A%202300%20%E2%82%AC%2Fmois%0A%0Ach%C3%B4mage%3A%20%0A%20%20formule%3A%0A%20%20%20%20produit%3A%20%0A%20%20%20%20%20%20assiette%3A%20assiette%20cotisation%0A%20%20%20%20%20%20plafond%3A%20400%25%20*%20plafond%20s%C3%A9curit%C3%A9%20sociale%0A%20%20%20%20%20%20taux%3A%204.05%25%0A%20%20%20%20%20%20)

### `variations`

Contient une liste de conditions (`si`) et leurs conséquences associées (`alors`).
Pour la première condition vraie dans la liste, on retient la valeur qui lui est associée.
Si aucune condition n'est vraie, alors ce mécanisme renvoie implicitement `non applicable`

```yaml
taux réduit:
  formule: oui

taux allocation familiales:
  formule:
    variations:
      - si: taux réduit
        alors: 3.45%
      - sinon: 5.25%
```

> [Lancer le calcul](https://publi.codes/studio?code=taux%20r%C3%A9duit%3A%0A%20%20formule%3A%20oui%0A%0Ataux%20allocation%20familiales%3A%0A%20%20formule%3A%0A%20%20%20%20variations%3A%0A%20%20%20%20%20%20-%20si%3A%20taux%20r%C3%A9duit%0A%20%20%20%20%20%20%20%20alors%3A%203.45%25%0A%20%20%20%20%20%20-%20sinon%3A%205.25%25)

Ce mécanisme peut aussi être utilisé au sein d'un mécanisme compatible, tel que la produit ou le barème.

```yaml
assiette cotisation:
  formule: 2300 €/mois

taux réduit:
  formule: oui

allocation familiales:
  formule:
    produit:
      assiette: assiette cotisation
      variations:
        - si: taux réduit
          alors:
            taux: 3.45%
        - sinon:
            taux: 5.25%
```

> [Lancer le calcul](http://localhost:8080/publicodes/studio?code=date%20de%20d%C3%A9but%3A%20%0A%20%20formule%3A%2012%2F02%2F2020%0A%20%20%0Aanciennet%C3%A9%20en%20fin%20d%27ann%C3%A9e%3A%0A%20%20formule%3A%20%0A%20%20%20%20dur%C3%A9e%3A%0A%20%20%20%20%20%20%20depuis%3A%20date%20de%20d%C3%A9but%0A%20%20%20%20%20%20%20jusqu%27%C3%A0%3A%2031%2F12%2F2020%0A%0Aprime%20de%20vacances%3A%0A%20%20applicable%20si%3A%20anciennet%C3%A9%20en%20fin%20d%27ann%C3%A9e%20%3E%201%20an%0A%20%20formule%3A%20200%E2%82%AC)

### `somme`

C'est tout simplement la somme de chaque terme de la liste. Si un des terme
n'est pas applicable, il vaut zéro.

```yaml
a:
  formule: 50 €

b:
  applicable si: non
  formule: 20 €

somme:
  formule:
    somme:
      - a
      - b
      - 40 €
```

> [Lancer le calcul](https://publi.codes/studio?code=a%3A%20%0A%20%20formule%3A%2050%20%E2%82%AC%0A%0Ab%3A%20%0A%20%20applicable%20si%3A%20non%0A%20%20formule%3A%2020%20%E2%82%AC%0A%0Asomme%3A%0A%20%20formule%3A%0A%20%20%20%20somme%3A%0A%20%20%20%20%20%20-%20a%0A%20%20%20%20%20%20-%20b%0A%20%20%20%20%20%20-%2040%20%E2%82%AC)

### `le maximum de`

Renvoie la valeur numérique de la liste de propositions fournie qui est la plus grande.

Il est conseillé de renseigner une description de chaque proposition par exemple quand elles représentent des méthodes de calcul alternatives.

### `le minimum de`

Renvoie l'élément de la liste de propositions fournie qui a la plus petite valeur.

Ces propositions doivent avoir un mécanisme de calcul ou être une valeur numérique.

Il est conseillé de renseigner une description de chaque proposition par exemple quand elles représentent des méthodes de calcul alternatives parmi lesquelles il faut en choisir une.

### `arrondi`

Arrondi à l'entier le plus proche, ou à une précision donnée.

```yaml
a:
  formule: 12.45

arrondi:
  formule:
    arrondi:
      valeur: a
      décimales: 1
```

### `régularisation`

Permet de régulariser progressivement un calcul de cotisation par rapport à une
variable temporelle.

```yaml
brut:
  formule:
    somme:
      - 2000 €/mois | du 01/01/2020 | au 31/05/2020
      - 4000 €/mois | du 01/06/2020 | au 31/12/2020
plafond:
  formule: 3000 €/mois

cotisation:
  formule:
    régularisation:
      règle:
        produit:
          assiette: brut
          plafond: plafond
          taux: 10%
      valeurs cumulées:
        - brut
        - plafond

cotisation en mai:
  formule: cotisation | du 01/05/2020 | au 30/05/2020

cotisation en juin:
  formule: cotisation | du 01/05/2020 | au 30/05/2020
```

[Lancer le calcul](https://publi.codes/studio?code=brut%3A%0A%20%20formule%3A%0A%20%20%20%20somme%3A%0A%20%20%20%20%20%20-%202000%20%E2%82%AC%2Fmois%20%7C%20du%2001%2F01%2F2020%20%7C%20au%2031%2F05%2F2020%0A%20%20%20%20%20%20-%204000%20%E2%82%AC%2Fmois%20%7C%20du%2001%2F06%2F2020%20%7C%20au%2031%2F12%2F2020%0A%0Acotisation%3A%0A%20%20formule%3A%20%0A%20%20%20%20r%C3%A9gularisation%3A%0A%20%20%20%20%20%20r%C3%A8gle%3A%0A%20%20%20%20%20%20%20%20produit%3A%0A%20%20%20%20%20%20%20%20%20%20assiette%3A%20brut%0A%20%20%20%20%20%20%20%20%20%20plafond%3A%203000%E2%82%AC%2Fmois%0A%20%20%20%20%20%20%20%20%20%20taux%3A%2010%25%0A%20%20%20%20%20%20valeurs%20cumul%C3%A9es%3A%0A%20%20%20%20%20%20%20%20-%20brut%0A%0Acotisation%20en%202020%3A%0A%20%20formule%3A%0A%20%20%20%20cotisation%20%7C%20du%2001%2F01%2F2020%20%7C%20au%2031%2F12%2F2020%0A)

### `recalcul`

Relance le calcul d'une règle dans une situation différente de la situation
courante. Permet par exemple de calculer le montant des cotisations au
niveau du SMIC, même si le salaire est plus élevé dans la situation
actuelle.

### `barème`

C'est un barème en taux marginaux, mécanisme de calcul connu son utilisation
dans le calcul de l'impôt sur le revenu.

L'assiette est décomposée en plusieurs tranches, qui sont multipliées par un
taux spécifique.

Les tranches sont souvent exprimées sous forme de facteurs d'une variable
que l'on appelle `multiplicateur`, par exemple `1 x le plafond de la sécurité sociale`.

### `grille`

C'est un barème sous la forme d'une grille de correspondance. C'est le
mécanisme de calcul de l'impôt neutre, aussi appelé impôt non personnalisé.

Il est composé de tranches qui se suivent. Il suffit de trouver l'assiette
qui correspond à la tranche, et de selectionner le montant associé à
l'assiette.

### `taux progressif`

Ce mécanisme permet de calculer un taux progressif. On spécifie pour chaque
tranche le plafond et le taux associé. Le taux effectif renvoyé est calculé
en lissant la différence de taux entre la borne inférieure et supérieure de
l'assiette

> Par exemple, si nous nous avons les tranches suivantes :

- taux: 50% / plafond: 0
- taux: 100% / plafond: 1000

> Pour une assiette de 500, le taux retourné sera 75%, car il correspond au
> taux situé à la moitié de la tranche correspondante.

### `composantes`

Beaucoup de cotisations sont composées de deux parties qui partagent la méthode de calcul mais diffèrent par des paramètres différents.

Pour ne pas définir deux variables presque redondantes, on utilise le mécanisme de composante. Il se comportera comme une somme dans les calculs, mais son affichage sur les pages /règle sera adapté.

Il est même possible, pour les mécanismes `barème` et `produit` de garder en commun un paramètre comme l'assiette, puis de déclarer des composantes pour le taux.

> L'exemple le plus courant de composantes, c'est la distinction part employeur, part salarié (ex. retraite AGIRC).

### `allègement`

Permet de réduire le montant d'une variable.
Très utilisé dans le contexte des impôts.

### `encadrement`

Permet d'ajouter un plafond et/ou un plancher à une valeur.

### `durée`

Permet d'obtenir le nombre de jours entre deux dates

### `synchronisation`

Pour éviter trop de saisies à l'utilisateur, certaines informations sont
récupérées à partir de ce que l'on appelle des API. Ce sont des services
auxquels ont fait appel pour obtenir des informations sur un sujet précis.
Par exemple, l'État français fournit gratuitement l'API géo, qui permet à
partir du nom d'une ville, d'obtenir son code postal, son département, la
population etc.

Ce mécanismes `synchronisation` permet de faire le lien entre les règles de
notre système et les réponses de ces API.

### `inversion numérique`

La formule de calcul de cette variable n'est pas connue, souvent elle n'a même pas de sens. Mais le mécanisme `inversion` indique qu'elle peut être _estimée_ à partir de l'un des _objectifs_ listés sous l'attribut `avec`. Il faut alors renseigner une valeur cible pour cet objectif.

Voilà comment ça marche : on va donner à la variable une valeur au hasard, calculer _l'objectif_, puis grâce à des calculs savants améliorer notre choix jusqu'à ce que l'écart entre le calcul et la valeur cible devienne satisfaisant.

Concrètement, si l'on demande au moteur (même indirectement) la valeur d'une variable qui a pour formule une inversion, il va vérifier qu'une des possibilités d'inversion a bien une valeur calculée ou saisie, et procéder à l'inversion décrite plus haut à partir de celle-ci. Sinon, ces possibilités d'inversions seront listées comme manquantes.
