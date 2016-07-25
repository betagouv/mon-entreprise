formula API:
salaire_net <- 1200 €
=> 1200 for each month of 2016

Sinon :

base_function = requested_period_added_value
set_input = set_input_divide_by_period

Input is year:2013 12000€, output is month:2013-02
-> 1000€ per month, used in salaire_net_a_payer


- salaire_net is requested_period_added_value

Input is 1200 every month of 2015, requested output is year 2015
-> give SUM(months)


- effectif_entreprise is requested_period_last_value
Input is 29 every month of 2015, requested output is year 2015
-> give last value
Why not mean ?

# cotisation_sociale_mode_recouvrement
http://rfpaye.grouperf.com/article/0242/ms/rfpayems0242_0255976.html

cotisation_sociale_mode_recouvrement =
		Mensuel avec régularisation en fin d'année
	| Annuel

apply_bareme -> compute_cotisation_annuelle() | compute_cotisation_anticipee()

> tranche 1 à 1%, tranche 2 à 10%

Si mon mec a eu 10 000 € en décembre, et 1000 euros sinon toute l'année,
compute_cotisation_annuelle ->
- 0 tous les mois sauf déc
- en déc, assiette = 21 000. PSS = 38 616 -> il ne paie pas de tranche 2 (e.g retraite)

compute_cotisation_anticipee -> Si paiement des cotisations mensuelles en vrai:
- en décembre : il paie une grosse tranche 2 ~ 700 € !
- les autres mois il paie la tranche 1 ~ 10 €


compute_cotisation(year) - Somme(compute_cotisation(month))
= 210 - 800

Donc c'est bien correctement implémenté dans OpenFisca

URSSAF
> Ce contrôle est inévitable pour les salariés dont le salaire brut est variable, et qui peuvent donc se trouver, d’un mois sur l’autre, au-dessus puis en dessous du plafond de la Sécurité sociale (ou inversement).

https://www.urssaf.fr/portail/home/employeur/calculer-les-cotisations/la-base-de-calcul/lassiette-maximale/la-regularisation-annuelle.html

*C'est la DADS*

Donc selon l'URSSAF le calcul des cotisations se fait sur l'année !
Et puis :
> Vous pouvez, si vous le souhaitez, effectuer tous les mois une régularisation des plafonds de Sécurité sociale. Cette méthode permet d’éviter des régularisations trop importantes (en positif ou en négatif) en fin d’année.

BILAN
-------

Cette *régularisation progressive* n'est pas implémenté aujourd'hui
Elle est pourtant **obligatoire pour la DSN** !!
Je crois bien que c'est exactement ça qui est implémenté pour les deux réductions fillon et allocs. Il faut le refaire pour toutes les cotisations non comportant des tranches.
