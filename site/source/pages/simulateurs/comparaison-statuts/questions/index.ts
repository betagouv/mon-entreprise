import { GroupeDeQuestionsFournies } from '@/components/Simulateur/Questions/ComposantQuestionFournie'
import { SituationComparée } from '@/contextes/comparateur'

import { AcreQuestion } from './AcreQuestion'
import { ActivitéRéglementéeQuestion } from './ActiviteRéglementeeQuestion'
import { AutresRevenusQuestion } from './AutresRevenusQuestion'
import { EnfantsQuestion } from './EnfantsQuestion'
import { MéthodeImpôtQuestion } from './MethodeImpotQuestion'
import { NatureActivitéQuestion } from './NatureActivitéQuestion'
import { ParentIsoléQuestion } from './ParentIsoleQuestion'
import { RéponseActivité } from './ReponseActivite'
import { RéponseFoyerFiscal } from './ReponseFoyerFiscal'
import { RéponseImpôt } from './ReponseImpot'
import { SituationFamilialeQuestion } from './SituationFamilialeQuestion'
import { TauxImpositionQuestion } from './TauxImpositionQuestion'
import { TVAQuestion } from './TVAQuestion'
import { TypeActivitéQuestion } from './TypeActiviteQuestion'

export const questionsPrincipales = [
	NatureActivitéQuestion,
	TypeActivitéQuestion,
	ActivitéRéglementéeQuestion,
	AcreQuestion,
]

export const groupesDeQuestions: Record<
	string,
	GroupeDeQuestionsFournies<SituationComparée>
> = {
	activité: {
		titre: (t) =>
			t(
				'pages.simulateurs.comparaison-statuts.questions.groupe.activité',
				'Activité'
			),
		Réponse: RéponseActivité,
		liste: [
			NatureActivitéQuestion,
			TypeActivitéQuestion,
			ActivitéRéglementéeQuestion,
		],
	},
	acre: {
		titre: (t) =>
			t('pages.simulateurs.comparaison-statuts.questions.groupe.acre', 'Acre'),
		liste: [AcreQuestion],
	},
	TVA: {
		titre: (t) =>
			t('pages.simulateurs.comparaison-statuts.questions.groupe.TVA', 'TVA'),
		liste: [TVAQuestion],
	},
	impôt: {
		titre: (t) =>
			t(
				'pages.simulateurs.comparaison-statuts.questions.groupe.impôt',
				'Méthode de calcul de l’impôt sur le revenu'
			),
		Réponse: RéponseImpôt,
		liste: [MéthodeImpôtQuestion, TauxImpositionQuestion],
	},
	foyerFiscal: {
		titre: (t) =>
			t(
				'pages.simulateurs.comparaison-statuts.questions.groupe.foyer-fiscal',
				'Foyer fiscal'
			),
		Réponse: RéponseFoyerFiscal,
		liste: [SituationFamilialeQuestion, EnfantsQuestion, ParentIsoléQuestion],
	},
	autresRevenus: {
		titre: (t) =>
			t(
				'pages.simulateurs.comparaison-statuts.questions.groupe.autres-revenus',
				'Autres revenus imposables'
			),
		liste: [AutresRevenusQuestion],
	},
}
