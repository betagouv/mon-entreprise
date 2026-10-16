# Journal des modifications

## next

### Breaking changes
- Renomme `plafond sécurité sociale . métropole` en `plafond sécurité sociale . cas général`
- Renomme `durée légale du travail . mensuelle` en `durée légale du travail`
- Supprime les règles vides `assimilé salarié . cotisations . prévoyances . conventionnelle`
- Supprime les règles enfants de `assimilé salarié . cotisations . prévoyances . incapacité invalidité décès`

### Nouveautés
- Crée la règle `plafond sécurité sociale . mayotte`
- Taux collectifs AT/MP 2026 par code risque : la règle `établissement . code risque` permet de choisir le domaine d'activité, dont `établissement . taux ATMP . taux collectif` déduit le taux (le taux moyen reste la valeur par défaut, et `taux collectif` peut toujours être saisi directement)

## 0.1.0

### Mises à jour
- Mise à jour de la date (01/07/2026)

### Corrections
- L'application de la réforme de l'Acre dépend de la date de création de l'entreprise

## 0.0.2

Modification de la configuration du paquet.

## 0.0.1

Création du paquet.
