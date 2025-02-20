import { checkA11Y, fr } from '../../../support/utils'

const idPrefix = 'déclaration_revenus_PAMC__'
const structureDeSoins = 'activité_en_structures_de_soins'
const exonerations = 'déductions_et_exonérations'
const autresRevenus = 'autres_revenus_non_salariés'
const revenusNets = 'revenus_nets__'

describe(`L'assistant à la déclaration de revenu pour PAMC`, function () {
	if (!fr) {
		return
	}

	beforeEach(function () {
		cy.visit('/assistants/declaration-revenus-pam')
	})

	it("devrait s'afficher", function () {
		cy.contains('Assistant à la déclaration de revenus pour les PAMC').should(
			'be.visible'
		)
	})

	it('devrait demander la profession', function () {
		cy.contains('Quelle est votre profession ?').should('be.visible')
	})

	it('devrait demander le statut une fois la profession sélectionnée', function () {
		cy.contains(
			'Quel était votre statut d’exercice au 1er janvier ou à votre date de début d’activité ?'
		).should('not.exist')

		cy.contains('Sage-femme').click()

		cy.contains(
			'Quel était votre statut d’exercice au 1er janvier ou à votre date de début d’activité ?'
		).should('be.visible')
	})

	it('devrait demander le régime fiscal une fois le statut sélectionné', function () {
		cy.contains('Sage-femme').click()
		cy.contains('Quel est votre régime fiscal ?').should('not.exist')

		cy.contains('Titulaire').click()

		cy.contains('Quel est votre régime fiscal ?').should('be.visible')
	})

	it("ne devrait pas montrer les champs avant qu'un régime fiscal soit sélectionné", function () {
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()

		cy.contains('Recettes brutes totales').should('not.exist')
		cy.get(`#${idPrefix}_recettes_brutes_totales`).should('not.exist')
		cy.contains('Revenus imposables').should('not.exist')
		cy.get(`#${idPrefix}_revenus_imposables`).should('not.exist')
		cy.contains('Cotisations sociales obligatoires').should('not.exist')
		cy.get(`#${idPrefix}_cotisations_sociales_obligatoires`).should('not.exist')

		cy.contains('Honoraires tirés d’actes conventionnés').should('not.exist')
		cy.get(`#${idPrefix}_SNIR___honoraires_remboursables`).should('not.exist')
		cy.contains('Dépassements d’honoraires').should('not.exist')
		cy.get(`#${idPrefix}_SNIR___dépassements_honoraires`).should('not.exist')
		cy.contains('Honoraires aux tarifs opposables hors forfaits').should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_tarifs_opposables`).should(
			'not.exist'
		)
		cy.contains('Honoraires totaux hors forfaits').should('not.exist')
		cy.get(`#${idPrefix}_SNIR___honoraires_hors_forfaits`).should('not.exist')
		cy.contains('Taux Urssaf').should('not.exist')
		cy.get(`#${idPrefix}_SNIR___taux_urssaf`).should('not.exist')

		cy.contains(
			'Avez-vous des recettes issues d’une activité en structure de soins ?'
		).should('not.exist')
		cy.get(`#${idPrefix}_${structureDeSoins}`).should('not.exist')
		cy.contains('Montant').should('not.exist')
		cy.get(`#${idPrefix}_${structureDeSoins}___recettes`).should('not.exist')

		cy.contains(
			'Bénéficiez-vous de déductions et/ou de revenus exonérés fiscalement ?'
		).should('not.exist')
		cy.get(`#${idPrefix}_${exonerations}`).should('not.exist')
		cy.contains('Exonération zone déficitaire en offre de soins').should(
			'not.exist'
		)
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins`
		).should('not.exist')
		cy.contains('Revenus exonérés').should('not.exist')
		cy.get(`#${idPrefix}_${exonerations}___revenus_exonérés`).should(
			'not.exist'
		)
		cy.contains('Plus-values à court terme exonérées').should('not.exist')
		cy.get(`#${idPrefix}_${exonerations}___plus-values_à_court_terme`).should(
			'not.exist'
		)
		cy.contains(
			'Montant des chèques vacances déduits du revenu imposable'
		).should('not.exist')
		cy.get(`#${idPrefix}_${exonerations}___chèques_vacances`).should(
			'not.exist'
		)

		cy.contains(
			'Avez-vous des revenus non salariés autres que ceux relevant du régime micro-BNC ?'
		).should('not.exist')
		cy.get(`#${idPrefix}_${autresRevenus}`).should('not.exist')
		cy.contains('Plus-values nettes à court terme').should('not.exist')
		cy.get(
			`#${idPrefix}_${autresRevenus}___plus-values_nettes_à_court_terme`
		).should('not.exist')
		cy.contains('Micro-BIC : chiffre d’affaires vente de marchandises').should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_${autresRevenus}___micro-BIC_marchandises`).should(
			'not.exist'
		)
		cy.contains('Micro-BIC : chiffre d’affaires prestation de service').should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_${autresRevenus}___micro-BIC_service`).should(
			'not.exist'
		)
		cy.contains('Micro-BA : chiffre d’affaires agricole').should('not.exist')
		cy.get(`#${idPrefix}_${autresRevenus}___micro-BA`).should('not.exist')

		cy.contains(
			'Avez-vous effectué uniquement des actes conventionnés ?'
		).should('not.exist')
		cy.get(`#${idPrefix}_actes_conventionnés_uniquement`).should('not.exist')

		cy.contains(
			'Avez-vous perçues des indemnités de la Caf, de la CPAM ou de votre caisse de retraite ?'
		).should('not.exist')
		cy.get(`#${idPrefix}_revenus_de_remplacement`).should('not.exist')
		cy.contains(
			'Montant des allocations journalières du proche aidant (AJPA) versées par la CAF'
		).should('not.exist')
		cy.get(`#${idPrefix}_revenus_de_remplacement___AJPA`).should('not.exist')
	})

	it("devrait montrer les champs lorsqu'un régime fiscal est sélectionné", function () {
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()

		cy.contains('Recettes brutes totales').should('be.visible')
		cy.get(`#${idPrefix}_recettes_brutes_totales`).should('be.visible')
		cy.contains('Revenus imposables').should('be.visible')
		cy.get(`#${idPrefix}_revenus_imposables`).should('be.visible')
		cy.contains('Cotisations sociales obligatoires').should('be.visible')
		cy.get(`#${idPrefix}_cotisations_sociales_obligatoires`).should(
			'be.visible'
		)

		cy.contains('Honoraires tirés d’actes conventionnés').should('be.visible')
		cy.get(`#${idPrefix}_SNIR___honoraires_remboursables`).should('be.visible')
		cy.contains('Dépassements d’honoraires').should('be.visible')
		cy.get(`#${idPrefix}_SNIR___dépassements_honoraires`).should('be.visible')

		cy.contains(
			'Avez-vous des recettes issues d’une activité en structure de soins ?'
		).should('be.visible')
		cy.get(`#${idPrefix}_${structureDeSoins}`).should('be.visible')

		cy.contains(
			'Bénéficiez-vous de déductions et/ou de revenus exonérés fiscalement ?'
		).should('be.visible')
		cy.get(`#${idPrefix}_${exonerations}`).should('be.visible')

		cy.contains(
			'Avez-vous des revenus non salariés autres que ceux relevant du régime micro-BNC ?'
		).should('be.visible')
		cy.get(`#${idPrefix}_${autresRevenus}`).should('be.visible')

		cy.contains(
			'Avez-vous effectué uniquement des actes conventionnés ?'
		).should('be.visible')
		cy.get(`#${idPrefix}_actes_conventionnés_uniquement`).should('be.visible')

		cy.contains(
			'Avez-vous perçues des indemnités de la Caf, de la CPAM ou de votre caisse de retraite ?'
		).should('be.visible')
		cy.get(`#${idPrefix}_revenus_de_remplacement`).should('be.visible')
	})

	it('devrait effacer les réponses en cliquant sur réinitialiser', function () {
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()

		cy.contains('Réinitialiser').click()

		cy.contains('Recettes brutes totales').should('not.exist')
	})

	it('devrait afficher un conseil selon le régime fiscal sélectionné', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()

		cy.contains('micro-fiscal').click()
		cy.contains('Afin de faciliter le remplissage, préparez :').should('be.visible')

		cy.contains('régime réel').click()
		cy.contains('Afin de faciliter le remplissage, munissez-vous des annexes A et B de votre liasse fiscale 2035.').should('be.visible')

		cy.contains('déclaration contrôlée').click()
		cy.contains('Afin de faciliter le remplissage, munissez-vous des annexes A et B de votre liasse fiscale 2035.').should('be.visible')
	})

	it('ne devrait pas montrer les résultats avant que les champs soient remplis', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()

		cy.contains('Montants à reporter dans votre déclaration de revenus').should(
			'not.exist'
		)

		cy.contains(
			'Recettes brutes totales tirées des activités non salariées'
		).should('not.exist')
		cy.get(`#${idPrefix}_recettes_brutes_totales-value`).should('not.exist')

		cy.contains('Montant des revenus de remplacement').should('not.exist')
		cy.contains(
			'Montant des allocations journalières du proche aidant (AJPA) versées par la CAF'
		).should('not.exist')
		cy.get(`#${idPrefix}_revenus_de_remplacement___AJPA-value`).should(
			'not.exist'
		)

		cy.contains('Exonération zone déficitaire en offre de soins').should(
			'not.exist'
		)
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins-value`
		).should('not.exist')
		cy.get(`#${idPrefix}_${exonerations}___chèques_vacances-label`).should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_${exonerations}___chèques_vacances-value`).should(
			'not.exist'
		)

		cy.contains(
			'Cotisations sociales obligatoires déduites du résultat imposable'
		).should('not.exist')
		cy.get(`#${idPrefix}_cotisations_sociales_obligatoires-value`).should(
			'not.exist'
		)

		cy.contains('Répartition des revenus nets').should('not.exist')
		cy.contains('Revenus nets de l’activité conventionnée').should('not.exist')
		cy.get(`#${idPrefix}_${revenusNets}_revenus_conventionnés-value`).should(
			'not.exist'
		)
		cy.contains('Revenus nets tirés des autres activités non salariées').should(
			'not.exist'
		)
		cy.get(
			`#${idPrefix}_${revenusNets}_revenus_non_conventionnés-value`
		).should('not.exist')
		cy.contains(
			'Dont revenus nets de l’activité réalisée dans des structures de soins'
		).should('not.exist')
		cy.get(
			`#${idPrefix}_${revenusNets}_revenus_structures_de_soins-value`
		).should('not.exist')

		cy.contains('Données transmises par l’Assurance Maladie').should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_remboursables-label`).should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_remboursables-value`).should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_SNIR___dépassements_honoraires-label`).should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_SNIR___dépassements_honoraires-value`).should(
			'not.exist'
		)
		cy.contains('Honoraires aux tarifs opposables hors forfaits').should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_tarifs_opposables-value`).should(
			'not.exist'
		)
		cy.contains('Honoraires totaux hors forfaits').should('not.exist')
		cy.get(`#${idPrefix}_SNIR___honoraires_hors_forfaits-value`).should(
			'not.exist'
		)
		cy.contains('Taux Urssaf').should('not.exist')
		cy.get(`#${idPrefix}_SNIR___taux_urssaf-value`).should('not.exist')
	})

	it('devrait montrer les résultats lorsque les champs sont remplis', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').as('inputs').should('have.length', 5)
		cy.get('@inputs').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})

		cy.contains('Montants à reporter dans votre déclaration de revenus').should(
			'be.visible'
		)

		cy.contains(
			'Recettes brutes totales tirées des activités non salariées'
		).should('be.visible')
		cy.get(`#${idPrefix}_recettes_brutes_totales-value`).should('be.visible')

		cy.contains(
			'Cotisations sociales obligatoires déduites du résultat imposable'
		).should('be.visible')
		cy.get(`#${idPrefix}_cotisations_sociales_obligatoires-value`).should(
			'be.visible'
		)

		cy.contains('Répartition des revenus nets').should('be.visible')
		cy.contains('Revenus nets de l’activité conventionnée').should('be.visible')
		cy.get(`#${idPrefix}_${revenusNets}_revenus_conventionnés-value`).should(
			'be.visible'
		)
		cy.contains('Revenus nets tirés des autres activités non salariées').should(
			'be.visible'
		)
		cy.get(
			`#${idPrefix}_${revenusNets}_revenus_non_conventionnés-value`
		).should('be.visible')

		cy.contains('Données transmises par l’Assurance Maladie').should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_remboursables-label`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_remboursables-value`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_SNIR___dépassements_honoraires-label`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_SNIR___dépassements_honoraires-value`).should(
			'be.visible'
		)
	})

	it('devrait montrer des champs différents aux dentistes', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()

		cy.contains('Taux Urssaf').should('not.exist')
		cy.get(`#${idPrefix}_SNIR___taux_urssaf`).should('not.exist')

		cy.contains('Chirurgien/chirurgienne-dentiste').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()

		cy.get(`#${idPrefix}_SNIR___taux_urssaf-title`).should('be.visible')
		cy.get(`#${idPrefix}_SNIR___taux_urssaf`).should('be.visible')

		cy.contains(
			'Avez-vous des recettes issues d’une activité en structure de soins ?'
		).should('not.exist')
		cy.get(`#${idPrefix}_${structureDeSoins}`).should('not.exist')
	})

	it('devrait montrer des résultats différents aux dentistes', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})

		cy.contains('Taux Urssaf').should('not.exist')
		cy.get(`#${idPrefix}_SNIR___taux_urssaf-value`).should('not.exist')

		cy.contains('Chirurgien/chirurgienne-dentiste').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').as('inputs').should('have.length', 6)
		cy.get('@inputs').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})

		cy.get(`#${idPrefix}_SNIR___taux_urssaf-label`).should('be.visible')
		cy.get(`#${idPrefix}_SNIR___taux_urssaf-value`).should('be.visible')

		cy.get(`#${idPrefix}_SNIR___honoraires_remboursables-label`).should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_remboursables-value`).should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_SNIR___dépassements_honoraires-label`).should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_SNIR___dépassements_honoraires-value`).should(
			'not.exist'
		)
	})

	it('devrait montrer des champs différents aux médecins', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()

		cy.contains('Honoraires aux tarifs opposables hors forfaits').should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_tarifs_opposables`).should(
			'not.exist'
		)
		cy.contains('Honoraires totaux hors forfaits').should('not.exist')
		cy.get(`#${idPrefix}_SNIR___honoraires_hors_forfaits`).should('not.exist')

		cy.contains('Médecin').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()

		cy.get(`#${idPrefix}_SNIR___honoraires_tarifs_opposables-title`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_tarifs_opposables`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_hors_forfaits-title`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_hors_forfaits`).should('be.visible')
	})

	it('devrait montrer des résultats différents aux médecins', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})

		cy.contains('Honoraires aux tarifs opposables hors forfaits').should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_tarifs_opposables-value`).should(
			'not.exist'
		)
		cy.contains('Honoraires totaux hors forfaits').should('not.exist')
		cy.get(`#${idPrefix}_SNIR___honoraires_hors_forfaits-value`).should(
			'not.exist'
		)

		cy.contains('Médecin').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').as('inputs').should('have.length', 7)
		cy.get('@inputs').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})

		cy.get(`#${idPrefix}_SNIR___honoraires_tarifs_opposables-label`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_tarifs_opposables-value`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_hors_forfaits-label`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_hors_forfaits-value`).should(
			'be.visible'
		)
	})

	it('devrait montrer la question sur les actes conventionnés conditionnellement', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Pédicure podologue').click()
		cy.contains('Remplaçant').click()
		cy.contains('micro-fiscal').click()

		cy.contains('Avez-vous effectué uniquement des actes conventionnés ?')
			.as('questionLabel')
			.should('be.visible')
		cy.get(`#${idPrefix}_actes_conventionnés_uniquement`)
			.as('questionInput')
			.should('be.visible')

		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()

		cy.get('@questionLabel').should('not.exist')
		cy.get('@questionInput').should('not.exist')

		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()

		// "oui" à structure de soins et "non" à autres revenus
		cy.get(`#${idPrefix}_${structureDeSoins}`).contains('Oui').click()

		cy.get('@questionLabel').should('not.exist')
		cy.get('@questionInput').should('not.exist')

		// "oui" à structure de soins et "oui" à autres revenus
		cy.get(`#${idPrefix}_${autresRevenus}`).contains('Oui').click()

		cy.get('@questionLabel').should('not.exist')
		cy.get('@questionInput').should('not.exist')

		// "non" à structure de soins et "oui" à autres revenus
		cy.get(`#${idPrefix}_${structureDeSoins}`).contains('Non').click()

		cy.get('@questionLabel').should('not.exist')
		cy.get('@questionInput').should('not.exist')
	})

	it('devrait montrer le champ pour les activités en structures de soins conditionnellement', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})

		cy.get(`#${idPrefix}_${structureDeSoins}___recettes-title`).should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_${structureDeSoins}___recettes`).should('not.exist')

		cy.get(`#${idPrefix}_${structureDeSoins}`).contains('Oui').click()

		cy.get(`#${idPrefix}_${structureDeSoins}___recettes-title`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_${structureDeSoins}___recettes`).should('be.visible')
		cy.contains(
			'Dont revenus nets de l’activité réalisée dans des structures de soins'
		).should('be.visible')
		cy.get(
			`#${idPrefix}_${revenusNets}_revenus_structures_de_soins-value`
		).should('be.visible')
	})

	it('devrait montrer les champs pour les déductions et exonérations conditionnellement', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})

		cy.contains('Revenus exonérés').should('not.exist')
		cy.get(`#${idPrefix}_${exonerations}___revenus_exonérés`).should(
			'not.exist'
		)
		cy.contains('Plus-values à court terme exonérées').should('not.exist')
		cy.get(`#${idPrefix}_${exonerations}___plus-values_à_court_terme`).should(
			'not.exist'
		)
		cy.contains(
			'Montant des chèques vacances déduits du revenu imposable'
		).should('not.exist')
		cy.get(`#${idPrefix}_${exonerations}___chèques_vacances`).should(
			'not.exist'
		)

		cy.get(`#${idPrefix}_${exonerations}`).contains('Oui').click()

		cy.contains('Revenus exonérés').should('be.visible')
		cy.get(`#${idPrefix}_${exonerations}___revenus_exonérés`).should(
			'be.visible'
		)
		cy.contains('Plus-values à court terme exonérées').should('be.visible')
		cy.get(`#${idPrefix}_${exonerations}___plus-values_à_court_terme`).should(
			'be.visible'
		)
		cy.contains(
			'Montant des chèques vacances déduits du revenu imposable'
		).should('be.visible')
		cy.get(`#${idPrefix}_${exonerations}___chèques_vacances`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_${exonerations}___chèques_vacances-label`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_${exonerations}___chèques_vacances-value`).should(
			'be.visible'
		)
	})

	it("devrait montrer un champ d'exonération supplémentaire aux médecins", function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})
		cy.get(`#${idPrefix}_${exonerations}`).contains('Oui').click()

		cy.contains('Exonération zone déficitaire en offre de soins').should(
			'not.exist'
		)
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins`
		).should('not.exist')

		cy.contains('Réinitialiser').click()
		cy.contains('Médecin').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})
		cy.get(`#${idPrefix}_${exonerations}`).contains('Oui').click()

		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins-title`
		).should('be.visible')
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins`
		).should('be.visible')
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins-label`
		).should('be.visible')
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins-value`
		).should('be.visible')
	})

	it('devrait montrer les champs pour les autres revenus non salariés conditionnellement', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})

		cy.contains('Plus-values nettes à court terme').should('not.exist')
		cy.get(
			`#${idPrefix}_${autresRevenus}___plus-values_nettes_à_court_terme`
		).should('not.exist')
		cy.contains('Micro-BIC : chiffre d’affaires vente de marchandises').should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_${autresRevenus}___micro-BIC_marchandises`).should(
			'not.exist'
		)
		cy.contains('Micro-BIC : chiffre d’affaires prestation de service').should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_${autresRevenus}___micro-BIC_service`).should(
			'not.exist'
		)
		cy.contains('Micro-BA : chiffre d’affaires agricole').should('not.exist')
		cy.get(`#${idPrefix}_${autresRevenus}___micro-BA`).should('not.exist')

		cy.get(`#${idPrefix}_${autresRevenus}`).contains('Oui').click()

		cy.contains('Plus-values nettes à court terme').should('be.visible')
		cy.get(
			`#${idPrefix}_${autresRevenus}___plus-values_nettes_à_court_terme`
		).should('be.visible')
		cy.contains('Micro-BIC : chiffre d’affaires vente de marchandises').should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_${autresRevenus}___micro-BIC_marchandises`).should(
			'be.visible'
		)
		cy.contains('Micro-BIC : chiffre d’affaires prestation de service').should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_${autresRevenus}___micro-BIC_service`).should(
			'be.visible'
		)
		cy.contains('Micro-BA : chiffre d’affaires agricole').should('be.visible')
		cy.get(`#${idPrefix}_${autresRevenus}___micro-BA`).should('be.visible')
	})

	it('devrait montrer le champ pour les revenus de remplacement conditionnellement', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})

		cy.contains(
			'Montant des allocations journalières du proche aidant (AJPA) versées par la CAF'
		).should('not.exist')
		cy.get(`#${idPrefix}_revenus_de_remplacement___AJPA`).should('not.exist')

		cy.get(`#${idPrefix}_revenus_de_remplacement`).contains('Oui').click()

		cy.contains(
			'Montant des allocations journalières du proche aidant (AJPA) versées par la CAF'
		).should('be.visible')
		cy.get(`#${idPrefix}_revenus_de_remplacement___AJPA`).should('be.visible')
		cy.contains('Montant des revenus de remplacement').should('be.visible')
		cy.contains(
			'Montant des allocations journalières du proche aidant (AJPA) versées par la CAF'
		).should('be.visible')
		cy.get(`#${idPrefix}_revenus_de_remplacement___AJPA-value`).should(
			'be.visible'
		)
	})

	it('devrait être accessible', function () {
		checkA11Y()
	})
})
