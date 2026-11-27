# Journal des modifications

## next

### Breaking changes
- Réorganise le calcul de l'impôt sur le revenu
- Supprime le calcul de l'impôt avec le taux neutre
- Renomme `plafond sécurité sociale . métropole` en `plafond sécurité sociale . cas général`
- Renomme `durée légale du travail . mensuelle` en `durée légale du travail`
- Supprime les règles vides `assimilé salarié . cotisations . prévoyances . conventionnelle`
- Supprime les règles enfants de `assimilé salarié . cotisations . prévoyances . incapacité invalidité décès`
- Corrige les possibilités de `entreprise . salariés . effectif . seuil`
- Supprime la règle enfant `assimilé salarié . rémunération . nette . imposable . sans déductions` (utiliser directement `assimilé salarié . rémunération . nette . imposable`)

### Nouveautés
- Crée la règle `plafond sécurité sociale . mayotte`
- Ajoute les dividendes

### Mises à jour
- Reformule les questions qui s'adressaient à un salarié pour s'adresser au dirigeant (taux réduits, profession, fonction support AT/MP, complémentaire santé, avantages en nature)

### Corrections
- Corrige le calcul de la CEHR


## 0.1.0

### Mises à jour
- Mise à jour de la date (01/07/2026)

### Corrections
- L'application de la réforme de l'Acre dépend de la date de création de l'entreprise

## 0.0.2

Modification de la configuration du paquet.

## 0.0.1

Création du paquet.
