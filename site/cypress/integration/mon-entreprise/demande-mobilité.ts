/* eslint-disable cypress/unsafe-to-chain-command */
import { checkA11Y, fr } from '../../support/utils'

const writeFixtures = Cypress.env('record_http') !== undefined

describe(
	`Formulaire demande mobilité (${
		writeFixtures ? 'record mode' : 'stubbed mode'
	})`,
	{ testIsolation: false },
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
			cy.contains('Nom').parent().click()
			cy.focused().type('Deaux')
			cy.tab().type('Jean Bernard')
			cy.tab().type('1 91 07 468 054 75')
			cy.tab().type('Française')
			cy.tab().type('25/07/1991')

			cy.contains('Non').click()
			cy.focused().tab().type('Pouts')
			cy.wait('@communes')
			cy.contains('65100', { timeout: 10000 }).type('{enter}')
			cy.focused().tab().type('{downarrow}')

			cy.focused().tab().type('Brest')

			cy.wait('@communes')

			cy.contains('29200').type('{enter}')
			cy.focused().tab().type('3 rue de la Rhumerie')
			cy.tab()

			cy.focused().type('614540144500')
			cy.tab().type('Deaux & Cie')
			cy.tab().type('14 chemin des Docks')
			cy.tab().type('Bre')
			cy.contains('29200').click()
			cy.focused().tab().type('Deaux')
			cy.tab().type('Alphonse')
			cy.tab().type('alphonse.deaux@gamil.com')
			cy.tab().type('06 85 69 78 54')

			// "activité en France" section
			cy.contains('Pour une période déterminée et dans un seul pays').click()
			cy.contains('Date de début').click({ force: true })
			cy.focused().type('06/11/2020')
			cy.tab()
			cy.tab().type('09/04/2021')
			cy.tab()
			cy.tab()
			cy.focused().type('Argen{enter}')

			cy.contains('Agent contractuel').click()
			cy.contains("Nom de l'entreprise").parent().click()
			cy.focused().type('Haldithet Docks')
			cy.tab().type('64E45 12-654')
			cy.tab().type('Handstath street, 9th')
			cy.tab().type('654004')
			cy.tab().type('Egrageoiria')

			cy.focused().tab().type('you@ajido.com')
			cy.tab().type('+94655487015')

			cy.contains("Dans le pays d'accueil").click()

			cy.focused().tab().type('{downarrow}{downarrow}')
			cy.focused().tab().focused().tab().type('{downarrow}')
			cy.focused().tab().type('{downarrow}')
			cy.focused().tab().type('{downarrow}')
			cy.focused().tab().type('{downarrow}')
			cy.focused().tab().type('{downarrow}')
			cy.focused().tab().type('{downarrow}')
			cy.focused().tab()

			cy.focused().type('Docker')
			cy.tab().type('Docker')
			cy.tab()
			cy.focused().type('{downarrow}{enter}')

			cy.contains("Le salarié sera-t-il accompagné d'ayants droits")
				.parent()
				.next()
				.contains('Oui')
				.click()
			cy.contains("Combien d'ayants droits partiront").parent().next().type('1')
			cy.contains('Ayant droit n°1')
			cy.focused().tab().type('Deladj')
			cy.tab().type('Sophie')
			cy.tab().type('21/04/1978')
			cy.tab()
			cy.tab()
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
