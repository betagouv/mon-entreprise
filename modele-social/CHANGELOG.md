# Journal des modifications

## next

### Mises à jour
- Mise à jour de la date (01/01/2026)
- Mise à jour du Smic
- Mise à jour du plafond de la Sécurité sociale
- Mise à jour des taux de cotisation et de la répartition des cotisations pour les auto-entrepreneur BNC et BNC Cipav
- Mise à jour des taux de cotisation pour les auto-entrepreneur BNC Cipav dans les Drom
- Mise à jour des suggestions de montant de l'abonnement de transports publics
- Mise à jour des taux de cotisation ATMP

### Corrections
- Correction de l'exonération de cotisations sociales sur la prise en charge par l'employeur des frais de transport

## 10.0.0

### Breaking changes
- Suppression de la règle dépréciée `dirigeant . indépendant . PL . métier . avocat`
- Suppression de la règle `dirigeant . indépendant . PL . catégorie . juridique . métier . notaire . par défaut`
- Suppression de la règle `dirigeant . indépendant . PL . catégorie . juridique . métier . officier . par défaut`
- Suppression de la règle `dirigeant . indépendant . PL . métier . santé . vétérinaire` (caisse de retraite non implémentée)
- Suppression de la règle `dirigeant . indépendant . PL . métier . agents généraux d'assurances` (caisse de retraite non implémentée)
- Supprime la règle `salarié . contrat . ancienneté`, utiliser `salarié . ancienneté` à la place

### Nouveautés
- Les possibilités de métier juridique `notaire` et `officier` sont désormais applicables

### Mises à jour
- Mise à jour des coûts de création
- Renomme chômage partiel en activité partielle

### Corrections
- Corrige le calcul des durées d'activité de l'entreprise
- Corrige le calcul de la durée depuis le début d'année
- Corrige le calcul de l'ancienneté
- Corrige le calcul des points de retraite complémentaire acquis par les auto-entrepreneurs/auto-entrepreneuses bénéficiant de l'Acre

## 9.0.0

### Breaking changes
- Renomme la règle `entreprise . imposition . IS . capital détenu au moins à 75 pourcents par des personnes physiques` en `entreprise . capital social . détenu au moins à 75 pourcents par des personnes physiques`

### Nouveautés
- Ajoute la règle `entreprise . imposition . IS . total` qui inclue la contribution
sociale sur l'IS
- Ajoute les règles `salarié . contrat . apprentissage . assiette réduite apprentissage . taxe sur les salaires` et `salarié . contrat . apprentissage . exonération taxe sur les salaires`

### Mises à jour
- Change `entreprise . exercice . date trop ancienne` de 2018 à 2022
- Reformulation de la question de `entreprise . date de cessation`

### Corrections
- Corrige le calcul de `entreprise . exercice . durée`
- Corrige le taux de cotisation maladie sur les revenus non conventionnés pour les médecins conventionnés secteur 2
- Corrige la règle `salarié . contrat . apprentissage . assiette réduite apprentissage . CSG-CRDS` qui ne s'appliquait pas correctement

## 8.0.0

### Breaking changes
- Renomme la règle `salarié . cotisations . allocations familiales . taux réduit` en `(...) . allocations familiales . éligible taux réduit`
- Renomme la règle `salarié . cotisations . maladie . employeur . taux réduit` en `(...) . employeur . éligible taux réduit`

### Nouveautés
- Ajout des règles `salarié . cotisations . allocations familiales . taux réduit` et `salarié . cotisations . allocations familiales . taux plein`
- Ajout des règles `salarié . cotisations . maladie . employeur . taux réduit` et `salarié . cotisations . maladie . employeur . taux plein`

### Mises à jour
- Mise à jour du montant de l'aide à l'embauche pour un contrat d'apprentissage (passage de 6000 à 5000 €/an au 24 février 2025)
- Mise à jour des montants des cotisations forfaitaires pour la CARCDSF
- Mise à jour du plafond des indemnités journalières d'arrêt maladie pour les salariés (passage de 1,8 * SMIC à 1,4 * SMIC au 1er avril 2025)
- Mise à jour du taux de cotisation ATMP minimum (passage de 0.46% à 0.5% au 1er mai 2025)
- Mise à jour du taux de cotisation ATMP moyen (passage de 2.23% à 2.24% au 1er janvier 2023 et à 2.12% au 1er janvier 2024)
- Mise à jour du taux de cotisation ATMP pour les fonctions support (passage de 0.83% à 0.8% au 1er janvier 2023, à 0.64% au 1er janvier 2024 et à 0.7% au 1er mai 2025)
- Mise à jour du taux de cotisation ATMP pour les fonctions support dans le BTP (passage de 0.6% à 0.67% au 1er mai 2025)

## 7.0.1

### Corrections
- Correction des unités au pluriel dans les règles publicodes pour assurer la cohérence entre l'API et l'utilisation directe du module NPM
- Correction de problèmes de `NaN` lors de certains calculs

### Mises à jour
- Mise à jour du salaire médian avec les données INSEE 2023 (passage de 2600 €/mois à 2700 €/mois brut)
- Suppression des règles concernant l’économie collaborative

## 7.0.0
### Breaking changes
- Règle `entreprise . date de cessation` non applicable par défaut (utiliser la règle `entreprise . en cessation d'activité` pour l’activer)
- Suppression des règles dépréciées suivantes :
	- `dirigeant . auto-entrepreneur . cotisations et contributions . CFP . revenus BIC`
	- `dirigeant . auto-entrepreneur . cotisations et contributions . CFP . revenus BNC`
	- `dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . cotisations CIPAV . taux prestation de service`
	- `dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . cotisations CIPAV . taux service BIC`
	- `dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . cotisations CIPAV . taux service BNC`
	- `dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . cotisations CIPAV . taux vente restauration hébergement`
	- `dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . taux ACRE . prestation de service`
	- `salarié . cotisations . chômage . employeur`
	- `salarié . cotisations . chômage . salarié`
- Suppression de la règle `dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . cotisations CIPAV`
- Suppression des règles
  - `déclaration revenus PAMC . autres revenus non salariés . micro-BNC`
  - `déclaration revenus PAMC . autres revenus non salariés . BNC`
  - `déclaration revenus PAMC . autres revenus non salariés . IS`
	Utiliser simplement `déclaration revenus PAMC . autres revenus non salariés` à la place.
- Renommage des règles enfant de `déclaration revenus PAMC . autres revenus non salariés`
- Renommage des règles suivantes :
	- `dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . cotisations CIPAV . taux` => `dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC Cipav . taux`
	- `dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . taux ACRE` => `dirigeant . auto-entrepreneur . Acre . taux Acre`
	- `dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . taux ACRE` => `dirigeant . auto-entrepreneur . Acre . taux Acre`
	- `dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . taux ACRE . service BIC ` => `dirigeant . auto-entrepreneur . Acre . taux service BIC`
	- `dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . taux ACRE . service BNC ` => `dirigeant . auto-entrepreneur . Acre . taux service BNC`
	- `dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . taux ACRE . vente restauration hébergement ` => `dirigeant . auto-entrepreneur . Acre . taux vente restauration hébergement`
	- `dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . taux ACRE . CIPAV ` => `dirigeant . auto-entrepreneur . Acre . taux Cipav`
	- `dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . taux ACRE . notification calcul ACRE annuel` => `dirigeant . auto-entrepreneur . Acre . notification calcul ACRE annuel`
	- `salarié . cotisations . chômage . employeur . taux` => `salarié . cotisations . chômage . taux`

### Nouveautés
- Ajout de `dirigeant . auto-entrepreneur . Cipav` et `dirigeant . auto-entrepreneur . Cipav . retraite complémentaire`
- Ajout de `dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . service BNC Cipav` avec la répartition des cotisations Cipav
- Gestion des auto-entrepreneurs dans `protection sociale . retraite . complémentaire . CIPAV`
- Ajout d'avertissements pour les champs de l'assistant à la déclaration des PAMC

### Corrections
- Correction du calcul des cotisations pour les auto-entrepreneuses et auto-entrepreneurs affiliés à la Cipav sans Acre
- Correction du taux de cotisations Acre pour les auto-entrepreneuses et auto-entrepreneurs affiliés à la Cipav
- Correction de la formule du calcul de la contribution additionnelle pour les PAMC
- Correction du montant de la CURPS pour les activités démarrées au 1er janvier
- Correction de la liste des cotisations sociales exonérées pour les apprentis
- Correction et simplification des formules de calcul pour la déclaration de revenus des PAMC

### Mises à jour
- Mise à jour de la date au 01/05/2025
- Mise à jour des niveaux de rémunération pour les taux réduits de cotisations maladie et familiales
- Mise à jour du plafond d’exonération de cotisations sociales pour les apprentis
- Mise à jour de l’exonération de CSG-CRDS pour les apprentis
- Mise à jour du SMIC pour la cotisation maladie et les allocations familiales

### Documentation
- Ajout de documentation et de références sur la participation de la CPAM aux cotisations des PAMC

### Dépréciations
- `dirigeant . auto-entrepreneur . affiliation CIPAV` : utiliser `dirigeant . auto-entrepreneur . Cipav` à la place

## 6.0.0
### Breaking changes
- Déplacement des règles sur l’Acre pour assimilé salarié de `dirigeant . assimilé salarié` vers `salarié . cotisations . exonérations`
- Renommage des règles enfant de `déclaration revenus PAMC . autres revenus non salariés`

### Nouveautés
- Ajout des règles pour l'impôt sur le revenu hors régime micro-fiscal à `déclaration revenus PAMC`
- Ajout des règles pour l'impôt sur les sociétés à `déclaration revenus PAMC`
- Ajout de règles pour la location de meublé

### Mises à jour
- Mises à jour des valeurs CARPIMKO pour 2025

### Corrections
- Correction de la limite future de la date de création d'une entreprise
- Correction du calcul de l’Acre pour assimilé salarié
- Correction du calcul de `chèques vacances exonérés` dans `déclaration revenus PAMC . déductions et exonérations . total déductible`
- Suppression de l'unité de `déclaration revenus PAMC . SNIR . taux urssaf`
- Correction de quelques fautes de grammaire et d'orthographe

### Documentation
- Ajout de documentation pour les règles `déclaration revenus PAMC`
- Mise à jour de la description des charges de l'entreprise
- Remplacement de la balise `<strong>` par le markdown `**`
- Utilisation d'apostrophes typographiques (WIP)

## 5.0.0
### Breaking changes
- Déplacement de la règle `plafond sécurité sociale N-1` vers `plafond sécurité sociale . N-1`

### Nouveautés
- Ajout du calcul Lodeom pour toutes les zones et tous les barèmes
- Ajout du calcul du SMIC équivalent pour un mois incomplet
- Ajout des règles de radiation et d'année incomplète : `entreprise . date de radiation`, `entreprise . durée d'activité cette année`, `entreprise . prorata temporis`
- Proratisation des assiettes et plafonds en cas d'année incomplète
- Ajout des règles `déclaration revenus PAMC`

## Mises à jour
- Mises à jour des taux pour l'année 2025
- Références de `dirigeant . indépendant . cotisations et contributions . CSG-CRDS`
- Les sous-règles de `salarié . cotisations . taxe d'apprentissage` sont désormais publiques

## 4.1.0
### Nouveautés
- Ajout des taux de contribution supplémentaire à l'apprentissage pour l'Alsace-Moselle
- Ajout du taux de cotisation ATMP pour les VRP multicartes
- Ajout de la date du 1er janvier de l'année précédente (période . début d'année . N-1)
- Ajout du SMIC horaire au 1er janvier de l'année précédente (SMIC . horaire . début d'année N-1)
- Ajout des classes de cotisation à la retraite complémentaire de la CNBF
- Ajout du taux AGS

### Mises à jour
- Mise à jour de la date au 1er janvier 2025
- Valeurs 2025 de la Retraite Complémentaire des Indépendants
- Valeurs 2025 Agirc-Arrco
- Montants 2025 des cotisations à la CARMF
- Valeur du point 2025 de la CNAVPL
- Montants 2025 des cotisations à la CAVEC
- Montants 2025 des cotisations à la CAVP
- Montants 2025 des cotisations à la CNBF
- Montant déductible sur les titres-restaurant en 2025
- Évaluation forfaitaire de l'avantage en nature repas en 2025
- Part déductible de la participation employeur aux frais de transports en commun en 2025
- Correction des conditions de non applicabilité des exonérations des heures supplémentaires

### Corrections
- Correction de l'opérateur de comparaison de dates
- Remplacement de valeurs en dur pour les artistes-auteurs par des références à d'autres règles
- Correction des seuils 2023 pour la taxe sur les salaires

### Documentation
- Ajout de références sur le versement mobilité
- Ajout de références sur l'aide au recrutement d'apprentis
- Mise à jour du lien vers la liste des cotisations des indépendants (site Urssaf)

## 4.0.0
### Breaking changes
- Suppression de la règle `salarié . régimes spécifiques . DFS . profession . journaliste . réduction de taux`

### Nouveautés
- Ajout des taux réduits cas particuliers (dont journaliste)
- Ajout du coefficient de majoration pour le calcul de la réduction générale avec caisses de congés payés
- Ajout du cumul retraite et activité libérale (cotisations invalidité-décès)

### Corrections
- Mise à jour du montant forfaitaire d'un repas pour HCR
- Mise à jour du taux de cotisation AGS
- Mise à jour des professions et taux pour la DFS
- Mise à jour des taux BNC pour les DROM
- Mise à jour du montant du PASS pour 2025
- Correction de la règle d'affiliation au régime général
- Correction du plafond de revenus micro-BNC pour les artistes-auteurs
- Correction de l'unité et de l'arrondi du coefficient T
- Correction de l'unité et de l'arrondi du coefficient de réduction générale
- Correction de l'unité des frais professionnels dans le calcul du montant net social

### Documentation
- Ajout de précisions sur le taux spécifique de cotisation retraite complémentaire
- Ajout de documentation sur la régularisation de la réduction générale

## 3.1.0
### Corrections
- Mise à jour du SMIC horaire à partir du 01/11/2024
- Correction du lien pour les TFC auto-entrepreneurs
- Correction du taux de cotisation maladie pour les PAMC

## 3.0.0
### Breaking changes
- Suppression des règles d'Acre obsolètes
- Réorganisation des règles sur les cotisations salariés
- Changement de la nature par défaut de l'activité artisanale
- Suppression de la question sur le taux personnalisé de retraite pour les PLNR
- Suppression de l'option 'taux neutre' pour l'impôt sur le revenu des indépendants

### Nouveautés
- Ajout de la répartition de la réduction générale
- Ajout d'une condition de durée d'activité à la question sur l'éligibilité à l'Acre
- Ajout du calcul du Montant Net Social

### Corrections
- Réécriture de la formule du coefficient de réduction générale comme documentée
- Correction de l'arrondi du coefficient de la réduction générale
- Correction de l'affiliation Cipav des PLNR créées avant 2018
- Correction des taux auto-entrepreneur DROM
- Correction du calcul du taux réduit de cotisation maladie et familiale avec heures supplémentaires
- Correction de la valeur d'acquisition du point Agirc-Arrco pour 2023

### Documentation
- Ajout de documentation sur la réduction générale
- Mises à jour des références sur l'Acre
- Changement de la définition du salaire brut pour celle de l'INSEE
- Mise à jour des références sur les frais professionnels

## 2.4.0
- Mise à jour des valeurs des caisses de retraite des professions libérales
- Correction du taux de cotisation BIC avec ACRE
- Correction de l'activation de l'ACRE pour les auto-entrepreneurs éligibles
- Correction du calcul de la retraite complémentaire des auto-entrepreneurs
- Correction de l'assiette de calcul des professions libérales réglementées
- Correction de l'applicabilité de l'option de surcotisation forfaitaire pour les revenus artistiques à 0
- Publie la règle du taux ACRE des auto-entrepreneurs
- Correction de l'utilisation des termes micro-entreprise et micro-fiscal
- Mise à jour de la documentation et des liens de références (versement libératoire, cotisations employeur, retraite)
- Suppression des liens morts dans la documentation

## 2.3.0
- Taux de cotisations auto-entrepreneurs pour 2024, 2025, 2026
- Ajout de la formation professionnelle dans la répartition des cotisations auto-entrepreneurs
- Seuil et plafond de cotisation de retraite complémentaire pour les artistes-auteurs
- Différenciation droit commun vs autre convention collective
- Mise à jour de liens de références

## 2.2.0
- Distribution des cotisations auto-entrepreneurs
- Corrections de liens morts dans les références

## 2.1.0
- Renomme la règle `protection sociale . invalidité et décès . pension invalidité . revenu annuel moyen des 10 meilleures années` vers `protection sociale . invalidité et décès . revenu annuel moyen`
- Ajout d'une condition sur le revenu annuel moyen des indépendants pour l'obtention d'un capital décès
- Ajoute les exonérations et les taux de cotisations spécifiques DROM pour les auto-entrepreneurs
- Mise à jour les indications pour les charges déductibles

## 2.0.1

- [protection sociale] Ajoute une condition de revenu pour bénéficier de la pension d'invalité pour les salariés
- Répare le calcul des cotisations forfaitaires de début d'activité
- publicodes : update to 1.0.4 

## 2.0.0

- Met à jour la cotisation minimale de retraite à 450 SMIC horaire en 2023 et 2024
- Met à jour le taux de cotisation maladie 2 (indemnités journalières)
- Passage à publicodes 1.0

## 2.0.0-rc.5

- Ajoute la CET salarié manquante.

## 2.0.0-rc.4

- Mise à jour du taux neutre pour 2024
- Plafond retraite complémentaire CIPAV modifié

## 2.0.0-rc.3

Mise à jour taux et barèmes 2024

### Base

- PLFSS
- SMIC

### Salariés

- Avantage en nature nourriture (base et HCR)
- Titres-restaurant
- Hausse cotisation AGS
- Hausse cotisation vieillesse employeur déplafonnée
- Baisse taux minimum AT/MP
- Changement seuil taux réduit cotisations maladie et allocations familiales
- Changement du barème de la taxe pour les salaires

### Indépendants

- PRCI
- Valeur point retraite rci

### Impôts

- Barème général
- Taux neutre métropole, DOM, COM
- Plafonnement quotient familial
- Décote

## 2.0.0-rc.2

Use publicodes v1.0.0-rc.5

## 2.0.0-rc.1

**BREAKING CHANGE**

- Utilise publicodes 1.0.0-rc.4 (cf https://github.com/publicodes/publicodes/blob/master/CHANGELOG.md)

## 1.8.3

- Met à jour la valeur du point CNAVPL en 2023

## 1.8.2

PRCI : Met à jour le montant du plafond spécifique du régime complémentaire des indépendants (RCI) pour 2023

## 1.8.1

Titre restaurants : Met à jour le montant unitaire exonéré de cotisation pour 2023

## 1.8.0

Exporte les règles au format json pour optimiser le chargement

## 1.7.2

Corrige des bugs dans l’implémentation de la convention collective du sport :

- Enlève la boucle du calcul de la limite d’exonération de la prévoyance
- Renomme la règle `salarié . convention collective . sport . exonération cotisation AT . refus` en `salarié . convention collective . sport . refus exonération cotisation AT`
- Correction d’unités
- Correction du calcul de la retraite complémenaire AGIRC-ARRCO

## 1.7.1

Clarifie le vocabulaire, les référence et l’implémentation du calcul de l’indemnité d’activité partielle

- Renomme la règle `salarié . activité partielle . rémunération mensuelle minimale` vers `salarié . activité partielle . indemnités . légale . rémunération mensuelle minimale`
- Renomme la règle `salarié . activité partielle . indemnités . base` en `salarié . activité partielle . indemnités . légale . base`
- Renomme la règle `salarié . activité partielle . indemnités . complémentaire` en `salarié . activité partielle . indemnités . légale . allocation complémentaire`
- Crée la règle `salarié . activité partielle . indemnités . légale`

## 1.7.0

- Met à jour l’aide à l’embauche d’un apprenti (supprime l’historique : l’ancienne version était mal implémentée)
- Ajoute la règle `salarié . contrat . ancienneté`
- Ajoute la règle `salarié . contrat . apprentissage . diplôme . niveau 8` pour la nouvelle aide à l’embauche des contrat d’apprentissage
- Déprécie les règles `salarié . contrat . apprentissage . diplôme préparé` et `salarié . contrat . apprentissage . ancienneté`
- Met à jour le calcul de l’indemnité de chômage partiel (y compris indemnité employeur)
- Supprime la règle experimentale `salarié . activité partielle . secteur d'activité restreint`

## 1.6.3

- Mise à jour de la valeur de service et d’acquisition du point de retraite complémentaire indépendant (RCI)

## 1.6.2

- Mise à jour du SMIC au 1er mai 2023

## 1.6.1

- Corrige le taux de CPF pour les auto-entrepreneur PLNR (2% depuis 2022)
- Corrige une typo dans les montants de la CARPIMKO
- Corrige le plafond pour le taux réduit de l’IS (hausse applicable pour l’exercice 2022)
- Mise à jour 2023 des taux et montant de la CARCDSF
- Mise à jour 2023 des taux et montant de la CARMF
- Mise à jour 2023 des taux et montant de la CARPIMKO
- Mise à jour 2023 des taux et montant de la CAVEC
- Mise à jour 2023 des taux et montant de la CAVP
- Mise à jour 2023 des taux et montant de la CNBF

## 1.6.0

- Ajoute les règles de coût de création d’une entreprise
- Nouvelle implémentation de la nature d’activité pour préparer les entreprises avec activités multiples
- Ajoute les entreprises unipersonnelles dans la catégorie juridique
- Mise à jour des modalités de calcul de la cotisation maladie pour les indépendant, suite à la loi portant les mesures d’urgence pour la protection du pouvoir d’achat d’août 2022.
- Correction des calculs des assiette du conjoint collaborateur
- Mise à jour des modalités de calcul des cotisations CIPAV en 2023 suite au passage du recouvrement à l’Urssaf
- Ajoute la question sur les activités saisonnières pour le calcul des cotisations sans assiette minimale pour les indeps
- Réimplémentation des exonérations pour indépendants pour mieux gérer le cumul
- Ajout d’une question sur la durée d’exonération pour la pension invalidité indépendant
- La notification sur la franchise de TVA s’affiche uniquement pour les entreprises qui peuvent en bénéficier

### Détails :

#### Règles dépréciées

- `dirigeant . indépendant . cotisations et contributions . maladie . réduction supplémentaire`
- `entreprise . activité`
- `dirigeant . indépendant . PL . métier . avocat`
- `dirigeant . indépendant . PL . CARMF . retraite CNAVPL`
- `dirigeant . indépendant . PL . CIPAV . exonération incapacité`
- `dirigeant . indépendant . PL . CIPAV . retraite complémentaire . option surcotisation`
- `entreprise . TVA . franchise de TVA . seuils dépassés`

#### Règles supprimées

- `protection sociale . retraite . CNAVPL`
- `protection sociale . retraite . CNAVPL . CIPAV . trimestres auto-entrepreneur`

#### Règles ajoutées

- `entreprise . activités . *`
- `entreprise . associés . `
- `entreprise . catégorie juridique . EI . EI`
- `entreprise . catégorie juridique . SARL . EURL`
- `entreprise . catégorie juridique . SARL . SARL`
- `entreprise . catégorie juridique . SAS . SASU`
- `entreprise . catégorie juridique . SAS . SAS`
- `entreprise . catégorie juridique . SELARL . SELARL`
- `entreprise . catégorie juridique . SELARL . SELARLU`
- `entreprise . catégorie juridique . SELAS . SELAS`
- `entreprise . catégorie juridique . SELAS . SELASU`
- `entreprise . TVA . franchise de TVA . notification`
- `protection sociale . retraite . base . CNAVPL`
- `protection sociale . retraite . complémentaire . CIPAV`
- `protection sociale . retraite . trimestres . auto-entrepreneur CIPAV`
- `dirigeant . indépendant . PL . métier . juridique . *`
- `dirigeant . indépendant . PL . métier . agents généraux d'assurances`
- `dirigeant . indépendant . conjoint collaborateur . notification exonérations non pris en compte`
- `dirigeant . indépendant . cotisations et contributions . exonérations . ACRE . *`
- `dirigeant . indépendant . cotisations et contributions . exonérations . pension invalidité . *`
- `dirigeant . indépendant . cotisations et contributions . exonérations . âge . *`

#### Divers

- Correction de l’exonération incapacité de la CNAVPL
- Met à jour les descriptions des cotisation indépendant
- Met à jour les formules de `dirigeant . indépendant . cotisations et contributions . maladie`, `dirigeant . indépendant . PL . maladie` et `dirigeant . indépendant . cotisations et contributions . indemnités journalières maladie`
- Découpage du fichier `independant.yaml` et `profession libérale.yaml`
- Ajoute des nouveaux métier pour les PLR

## 1.5.0

Ajoute les droits ouverts à la protection sociale pour les régimes suivants :

- indépendants AC/PLNR
- auto-entrepreneur hors CIPAV
- assimilé salarié

Les droits suivants ont été implémentés :

- Indemnités journalières et délai d’attente en cad d’arrêt maladie
- Indemnités journalières pour les accidents du travail et maladie professionnelle
- Indemnités journalières et forfaitaire pour les congés maternité paternité adoption
- Rentes, capital décès, pension de reversion et d’invalidité

### Détails

Ajout des règles suivantes :

- dirigeant . indépendant . cotisations et contributions . invalidité et décès
- protection sociale . maladie . raam
- protection sociale . maladie . maternité paternité adoption . \*
- protection sociale . maladie . arrêt maladie . \*
- protection sociale . invalidité et décès . \*

Renomme les règles suivantes :

- protection sociale . retraite . base . cotisée . revenu salarié -> protection sociale . retraite . base . cotisée . salarié
- protection sociale . retraite . base . cotisée . revenu indépendant -> protection sociale . retraite . base . cotisée . indépendant
- protection sociale . accidents du travail et maladies professionnelles -> protection sociale . maladie . accidents du travail et maladies professionnelles

Supression des règles suivantes :

- protection sociale . maladie . ATMP

\*Note : l’espace de nom `protection social` étant taggué comme « experimental », ces changements cassants ne provoquent pas de montée de version majeure.

## 1.4.2

- Augmentation du plafond de taux réduit pour l’impôt sur les sociétés (merci @fmata)

## 1.4.1

Mise à jour des montants qui changent au 1ᵉʳ janvier 2023 :

- SMIC
- plafond sécurité sociale
- tranches de l’impôt sur le revenu
- plafonds et planchers de l’abattement forfaitaire
- plafonds de la décote de l’impôt sur le revenu

Mise à jour de `période . début d'année`, `période . fin d'année` et de `date`.

## 1.4.0

Implémente les nouveaux taux de cotisation pour les auto-entrepreneurs à partir du 1ᵉʳ octobre 2023, suite au [décret n° 2022-1529 du 7 décembre 2022](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000046710841).

### ➕ Ajoute les nouvelles règles suivantes :

- dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . taux ACRE . CIPAV
- dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . taux vente restauration hébergement
- dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . taux service BIC
- dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . taux service BNC
- dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . taux ACRE . vente restauration hébergement
- dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . taux ACRE . service BIC
- dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . taux ACRE . service BNC
- dirigeant . auto-entrepreneur . affiliation CIPAV

### ➖ Déprécie les règles suivantes :

- dirigeant . auto-entrepreneur . cotisations et contributions . CFP . revenus BNC
- dirigeant . auto-entrepreneur . cotisations et contributions . CFP . revenus BIC
- dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . taux prestation de service
- dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . taux ACRE . prestation de service

## 1.3.0

- Déprécie `salarié . temps de travail . durée légale` au profit de `durée légale du travail` au même niveau que SMIC. Cela permet de désactiver l’espace de nom salarié tout en pouvant utiliser la durée légale dans d’autres règles (comme pour le SMIC)
- Répare les bugs d’arrondi dans le calcul des rémunération mensuelle / annuelles chez les indeps
- Déprécie `dirigeant . indépendant . PL . CARMF . retraite CNAVPL` au profit de `dirigeant . indépendant . PL . CARMF . participation CPAM retraite`
- Modifie le calcul du taux de retraite des PL PAMC (aligné sur celui des autres PLR à partir de 2022)
- Ajoute une notice d’information pour l’offre simplifié médecin remplaçant quand les conditions sont remplies
- Enlève la question RSA pour les PAMC (non concernées)
- Actualise les liens morts dans les références

## 1.2.0

### Fix et réecritures

- Répare l’ACRE qui ne fonctionnait plus pour les SASU, en ajoutant une règle `dirigeant . assimilé salarié . cotisations`
- La règle `dirigeant . auto-entrepreneur . impôt . revenu imposable` est maintenant une simple indirection vers `entreprise . imposition . régime . micro-entreprise . revenu abattu` (auparavant, elle réimplémentait la même logique)
- La règles `dirigeant . auto-entrepreneur . chiffres d'affaires` ne remplace plus `entreprise . chiffre d'affaires`. On peut donc utiliser de manière indiférenciée `entreprise . chiffre d'affaires` ou `dirigeant . auto-entrepreneur . chiffres d'affaires` pour spécifier le chiffre d’affaires de l’auto-entrepreneur

### Nouveautés legislatives

- L’assiette minimale retraite pour les indépendant a été modifiée courant de l’année pour pouvoir assurer 3 trimestres validés (ce n’était pas le cas avec la valeur par défaut). Création de la règle `dirigeant . indépendant . assiette minimale . retraite . en 2022`
- Le taux de cotisation indemnité maladie des conjoints collaborateur AC/PLNR est de 0,50% desormais (au lieu d’être aligné sur celui du gérant)

### Protection sociale : implémentation de la retraite et des IJSS en `experimental`

- Suppression du montant estimé de la retraite, au profit de deux nouvelles règles, plus representative :
    - `protection sociale . retraite . base` qui correspond au revenu pris en compte pour les 25 meilleures années dans le calcul de la pension de la retraite de base
    - `protection sociale . retraite . complémentaire` qui correspond au supplément de pension de retraite acquis grâce à une année complète de cotisation retraite complémentaire
- Uniformisation du calcul de `protection sociale . retraite . trimestres` entre les salariés et les indépendants
- Renommage de `protection sociale . santé` en `protection sociale . maladie` qui est le nom « officiel » de la branche
- Ajout de `protection sociale . maladie . arrêt maladie` pour le montant des indemnités journalière versées par la CPAM en cas d’arrêt maladie.

## 1.1.0

### Loi du 16 août 2022 portant mesures d’urgence pour la protection du pouvoir d’achat

- Ajoute la possibilité de spécifier un taux de participation employeur pour le remboursement des frais d’abonnement de transport en commun. La participation employeur est déductible jusqu’à 75% maintenant
- Augmente les plafonds de déductibilité de remboursement des frais de trajet domicile/travail
- Augmente le plafond de déductibilité des titres-restaurants
- Ajoute l’extension de la déduction forfaitaire pour heures supplémentaires aux entreprises de plus de 20 salariés

## 1.0.0

- Déplace la question ACRE sur le dirigeant plutôt que l’entreprise
- Sépare `activité` et `activité . nature`

## 1.0.0-beta.2

- Réécrit les règles de la cotisation AT/MP
- Supprime le recours au mécanisme synchronisation pour la localisation de l’établissement
- Ajoute le tag `experimental` à de nouvelles règles

## 1.0.0-beta.1

- Passage du paquet en semver (voir le README)
- Sépare le fichier salarié en plusieurs fichiers séparés
- Ajoute un tag experimental sur les règles susceptible de casser

Les changements suivants sont cassants :

- renomme l’espace de nom `contrat salarié` en `salarié`
- réécrit les règles liées au remboursement des frais domicile/travail
- réécrit les règles liées aux CDD
- déplace les éléments relatif au contrat dans `salarié . contrat`. Il s’agit de `temps partiel`, `salaire brut` ou encore le `statut cadre`
- tous les éléments relatifs à la rémunération sont déplacés dans `salarié . rémunération`
- `salarié . régimes spécifiques` : les règles liées aux régimes spéciaux (DFS, cadre, impatriés, etc)
- `plafond sécurité sociale temps plein` devient `plafond sécurité sociale`
- toutes les cotisations sont déplacées dans l’espace de nom `salarié . cotisations`, et utilisent les acronymes comme nom tant que possible.

**Corrections de bugs**

- Ajoute la limite de déduction sur la part employeur des prévoyances
- Enlève la CSA de l’exonération JEI
- Réecrit les règles de déductions des frais de transport domicile / travail pour coller à la réglementation
- Réecrit les règles sur le CDD pour une meilleure expérience question par question
- Précise le calcul de l’assiette de la CSG
- Corrige le calcul de la rémunération brut avec prévoyance

**Note sur l’upgrade**
Pour les utilisateur des version précédente, la mise à jour risque d’être longue et fastidieuse. Nous nous en excusons. Le but de cette refacto est de prévenir les changement cassants au maximum à l’avenir.

Vous pouvez utiliser la fonction recherche de la documentation, et utiliser le nouveau menu de navigation des règles pour plus facilement trouver les nouvelles versions des règles utilisées.

## 0.7.0

Fixe une version de publicodes minimum en peerDependancy.
Réecrit les règles pour fonctionner avec la dernière version de publicodes (=40)

## 0.6.1

Ajout des déclarations de type dans le paquet

## 0.6.0

Publication du paquet sous forme d’ES modules.
