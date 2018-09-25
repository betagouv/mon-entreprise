- nom: chiffre d'affaire


- nom: charges
  par defaut: 0

- nom: repartition salaire sur dividendes
  par defaut: 100%

- nom: impot sur les societes
  formule: 
    bareme: 
      assiette: benefices
      tranches: 
        - en-dessous de: 38000
	  taux: 15%
	- au-dessus de: 38000
	  taux: 28%

- nom: prelevement forfaitaire unique 
  formule: 
    multiplication: 
      assiette: dividendes
      composantes: 
        - part: CSG
	  taux: 17.2%
	- part: impot
	  taux: 
	    variations: 
	      - si: exoneration impot X
	        alors: 0%
	      - sinon: 12.8%


??

salaire total = chiffre d'affaires * repartition 

-> on en deduit le net car le total a une valeur 

- nom: dividendes 
  formule: chiffre d'affaires * repartition 



revenu disponible: salaire apres impot + revenus des dividendes



