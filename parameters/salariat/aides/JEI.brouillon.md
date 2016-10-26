- Le JEI peut se cumuler avec le CICE sans problème.
- JEI n'est ouverte qu'à certains salariés... à préciser dans le simulateur.
- JEI est un dispositif complexe, soumis à beaucoup de conditions. l'attribution de cette aide dans les résultats est sujette à confirmation. Il faut que votre entreprise réponde aux conditions d'une JEI, et que votre employé soit elligible aux éxonérations de charges (consacré à 50% R&D +  statut spécifique)
Voir https://www.service-public.fr/professionnels-entreprises/vosdroits/F31188

- JEI + Fillon + Allocs pas possible

Fillon, Allocs annulent un certain nombre de cotisations
JEI aussi

- Aide à l'embauche PME pas compatible avec JEI
Les exonérations JEI ne sont pas cumulables, pour l’emploi d’un même salarié, avec le bénéfice d’une aide à l’emploi de l’Etat, d’une autre mesure d’exonération totale ou partielle des cotisations patronales, de taux spécifiques, d’assiettes ou de montants forfaitaires de cotisations.

Le pb : dans OpenFisca on devrait pouvoir dire : CICE = - 6% de certaines cotisations !

- de quelles cotisations on parle ?

On peut simplement dire que !JEI if (Fillon || Allocs || Aide-PME)
Mais peut-on choisir (ex. pour un salaire de 3xSMIC), pas éxo allocs mais JEI ? Oui, "option entre mesures d'allègement"
https://www.urssaf.fr/portail/home/employeur/beneficier-dune-exoneration/exonerations-ou-aides-liees-au-s/jeunes-entreprises-innovantes/regles-de-cumul.html
Combien fait JEI ?

JEI > réduc allocs familiales
Fillon c'est éxo :
"zéro cotisations URSSAF au SMIC"
mmidcsa, allocs, fnal

JEI > Fillon
JEI > aide 1er employé
JEI > aide PME + aide 1er sal

Mais PME, SMIC => Aide PME + Fillon + aide allocs >> JEI
2500€ ???

---------------
Faut vraiment faire ce calcul : est-ce que JEI > aide PME + aide 1er sal + Fillon + aide allocs ??
---------------
JEI = calc, si > 0 et > aides machin machin, res calc
Toutes les aides non cumulables JEI = si estJEI, calc JEI, calc autres, si autres > JEI renvois aide
:-0

Résultat utilisateur
----------------

Je choisis JEI -> JEI sera choisi seulement si > aux éxos -> confusion possible
Ou alors : je choisis JEI (désirez-vous bénéficier du statut JEI ?) -> on utilise JEI et voilà.
-> IMPLÉ
Pour chaque aide, vérifier si JEI. Si exoneration_cotisations_employeur_jei > 0, 0.


JEI
---

- sal < 4.5x brut
exonération totale de charges sociales patronales d'assurances sociales et d'allocations familiales
= maladie (mmid sauf CSA), vieillesse (plaf + déplaf) et allocations familiales ?

? retraite ? CET ? etc.

pas éxo :
- AT/MP
- CSG et CRDS
- FNAL
- VT
- forfait sociale
- CSAutonomie
- chomage
