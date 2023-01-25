import { checkA11Y, fr } from '../../support/utils'

const writeFixtures = Cypress.env('record_http') !== undefined

describe(
	`Formulaire demande mobilité (${
		writeFixtures ? 'record mode' : 'stubbed mode'
	})`,
	{ testIsolation: 'off' },
	function () {
		if (!fr) {
			return
		}
		const FIXTURES_FOLDER = 'cypress/fixtures'
		const DEMANDE_MOBILITE_FIXTURES_FOLDER = `${FIXTURES_FOLDER}/demande-mobilité`

		let pendingRequests = new Set()
		let responses = {}
		const hostnamesToRecord = ['geo.api.gouv.fr']

		before(function () {
			pendingRequests = new Set()
			responses = {}
			cy.setInterceptResponses(
				pendingRequests,
				responses,
				hostnamesToRecord,
				DEMANDE_MOBILITE_FIXTURES_FOLDER
			)
			cy.clearLocalStorage() // Try to avoid flaky tests
			cy.visit(encodeURI('/gérer/demande-mobilité'))
		})

		after(function () {
			cy.writeInterceptResponses(
				pendingRequests,
				responses,
				DEMANDE_MOBILITE_FIXTURES_FOLDER
			)
		})

		it('should allow to select salarié', function () {
			cy.intercept({
				method: 'GET',
				hostname: 'geo.api.gouv.fr',
				url: '/communes*',
			}).as('communes')

			cy.contains('Employeur adhérent au TESE ou au CEA').click()

			cy.contains('Informations concernant le salarié')

			cy.contains('Êtes-vous adhérent au TESE ou au CEA')
				.parent()
				.next()
				.contains('TESE')
				.click()

			// "coordonnées" section
			cy.contains('Nom')
				.parent()
				.click()
				.focused()
				.type('Deaux')
				.tab()
				.type('Jean Bernard')
				.tab()
				.type('1 91 07 468 054 75')
				.tab()
				.type('Française')
				.tab()
				.type('1991-07-25')

			cy.contains('Non')
				.click()
				.focused()
				.tab()
				.type('Pouts')
				.wait('@communes')
				.focused()
			cy.contains('65100').type('{enter}').focused().tab().type('{downarrow}')

			cy.focused().tab().type('Brest')

			cy.wait('@communes')

			cy.contains('29200')
				.type('{enter}')
				.focused()
				.tab()
				.type('3 rue de la Rhumerie')
				.tab()

			cy.focused()
				.type('614540144500')
				.tab()
				.type('Deaux & Cie')
				.tab()
				.type('14 chemin des Docks')
				.tab()
				.type('Bre')
			cy.contains('29200')
				.click()
				.focused()
				.tab()
				.type('Deaux')
				.tab()
				.type('Alphonse')
				.tab()
				.type('alphonse.deaux@gamil.com')
				.tab()
				.type('06 85 69 78 54')

			// "activité en France" section
			cy.contains('Pour une période déterminée et dans un seul pays').click()
			cy.contains('Date de début').click({ force: true })
			cy.focused().type('2020-11-06').tab().type('2021-04-09').tab()
			cy.focused().type('Argen{enter}')

			cy.contains('Agent contractuel').click()
			cy.contains("Nom de l'entreprise")
				.parent()
				.click()
				.focused()
				.type('Haldithet Docks')
				.tab()
				.type('64E45 12-654')
				.tab()
				.type('Handstath street, 9th')
				.tab()
				.type('654004')
				.tab()
				.type('Egrageoiria')

			cy.focused().tab().type('you@ajido.com').tab().type('+94655487015')

			cy.contains("Dans le pays d'accueil").click()
			cy.focused().tab().type('{downarrow}{downarrow}')

			cy.focused().tab().type('{downarrow}')
			cy.focused().tab().type('{downarrow}')
			cy.focused().tab().type('{downarrow}')
			cy.focused().tab().type('{downarrow}')
			cy.focused().tab().type('{downarrow}')
			cy.focused().tab().type('{downarrow}')
			cy.focused().tab()

			cy.focused().type('Docker').tab().type('Docker').tab()
			cy.focused().type('{downarrow}{enter}')

			cy.contains("Le salarié sera-t'il accompagné d'ayants droits")
				.parent()
				.next()
				.contains('Oui')
				.click()
			cy.contains("Combien d'ayants droits partiront").parent().next().type('1')
			cy.contains('Ayant droit n°1')
			cy.focused()
				.tab()
				.type('Deladj')
				.tab()
				.type('Sophie')
				.tab()
				.type('1978-04-21')
				.tab()
			cy.focused().type('{downarrow}{enter}')

			cy.contains("Souhaitez-vous partager d'autres informations")
				.parent()
				.next()
				.contains('Non')
				.click()

			// download PDF
			cy.contains(
				'Je certifie l’exactitude des informations communiquées ci-dessus'
			).click()
			cy.contains('Fait à').click({ force: true })
			cy.focused().type('Plougastel')
			cy.contains('Générer la demande').click()
			cy.contains('Télécharger le fichier').click()
		})

		it('should be RGAA compliant', function () {
			checkA11Y()
		})
	}
)
