# Journal des modifications
## next


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

- Enlève la boucle du calcul de la limite d’éxonération de la prévoyance
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
