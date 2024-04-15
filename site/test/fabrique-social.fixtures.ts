import { FabriqueSocialEntreprise } from '@/api/RechercheEntreprise/fabrique-social'

export const fabriqueSocialWithSiege: FabriqueSocialEntreprise = {
	activitePrincipale: 'Agences immobilières',
	allMatchingEtablissements: [
		{
			activitePrincipaleEtablissement: '68.31Z',
			address: '4 RUE VOLTAIRE 44000 NANTES',
			codeCommuneEtablissement: '44109',
			codePostalEtablissement: '44000',
			etablissementSiege: false,
			siret: '84907419000034',
		},
		{
			activitePrincipaleEtablissement: '68.31Z',
			address: '23 RUE DE MOGADOR 75009 PARIS 9',
			codeCommuneEtablissement: '75109',
			codePostalEtablissement: '44000',
			etablissementSiege: true,
			siret: '84907419000042',
		},
	],
	caractereEmployeurUniteLegale: 'O',
	categorieJuridiqueUniteLegale: '5710',
	conventions: [
		{
			idcc: 1527,
			etat: 'VIGUEUR_ETEN',
			id: 'KALICONT000005635413',
			shortTitle:
				'Immobilier : administrateurs de biens, sociétés immobilières, agents immobiliers',
			texte_de_base: 'KALITEXT000023759095',
			title:
				"Convention collective nationale de l'immobilier, administrateurs de biens, sociétés immobilières, agents immobiliers, etc. (anciennement cabinets d'administrateurs de biens et des sociétés immobilières), du 9 septembre 1988. Etendue par arrêté du 24 février 1989 JORF 3 mars 1989. Mise à jour par avenant  n° 47 du 23 novembre 2010, JORF 18 juillet 2012 ",
			url: 'https://www.legifrance.gouv.fr/affichIDCC.do?idConvention=KALICONT000005635413',
		},
	],
	dateCreationUniteLegale: '2019-03-11',
	etablissements: 4,
	etatAdministratifUniteLegale: 'A',
	firstMatchingEtablissement: {
		activitePrincipaleEtablissement: '68.31Z',
		address: '4 RUE VOLTAIRE 44000 NANTES',
		codeCommuneEtablissement: '44109',
		codePostalEtablissement: '44000',
		etablissementSiege: false,
		etatAdministratifEtablissement: 'A',
		siret: '84907419000034',
	},
	highlightLabel: 'SPLIIT',
	label: 'SPLIIT',
	simpleLabel: 'SPLIIT',
	siren: '849074190',
}

export const fabriqueSocialWithoutSiege: FabriqueSocialEntreprise = {
	activitePrincipale: 'Agences immobilières',
	allMatchingEtablissements: [
		{
			activitePrincipaleEtablissement: '68.31Z',
			address: '23 RUE DE MOGADOR 75009 PARIS 9',
			codeCommuneEtablissement: '75109',
			codePostalEtablissement: '44000',
			etablissementSiege: false,
			siret: '84907419000042',
		},
	],
	caractereEmployeurUniteLegale: 'O',
	categorieJuridiqueUniteLegale: '5710',
	conventions: [
		{
			idcc: 1527,
			etat: 'VIGUEUR_ETEN',
			id: 'KALICONT000005635413',
			shortTitle:
				'Immobilier : administrateurs de biens, sociétés immobilières, agents immobiliers',
			texte_de_base: 'KALITEXT000023759095',
			title:
				"Convention collective nationale de l'immobilier, administrateurs de biens, sociétés immobilières, agents immobiliers, etc. (anciennement cabinets d'administrateurs de biens et des sociétés immobilières), du 9 septembre 1988. Etendue par arrêté du 24 février 1989 JORF 3 mars 1989. Mise à jour par avenant  n° 47 du 23 novembre 2010, JORF 18 juillet 2012 ",
			url: 'https://www.legifrance.gouv.fr/affichIDCC.do?idConvention=KALICONT000005635413',
		},
	],
	dateCreationUniteLegale: '2019-03-11',
	etablissements: 4,
	etatAdministratifUniteLegale: 'A',
	firstMatchingEtablissement: {
		activitePrincipaleEtablissement: '68.31Z',
		address: '4 RUE VOLTAIRE 44000 NANTES',
		codeCommuneEtablissement: '44109',
		codePostalEtablissement: '44000',
		etablissementSiege: false,
		etatAdministratifEtablissement: 'A',
		siret: '84907419000034',
	},
	highlightLabel: 'SPLIIT',
	label: 'SPLIIT',
	simpleLabel: 'SPLIIT',
	siren: '849074190',
}
