import React, {Component} from 'react'
import { connect } from 'react-redux'
import Question from '../components/Forms/Question'
import Input from '../components/Forms/Input'
import SelectCommune from '../components/Forms/SelectCommune'
import SelectTauxRisque from '../components/Forms/SelectTauxRisque'
import RhetoricalQuestion from '../components/Forms/RhetoricalQuestion'
import TextArea from '../components/Forms/TextArea'
import Group from '../components/Group'
import ResultATMP from '../components/ResultATMP'
import {reduxForm, formValueSelector} from 'redux-form'
import { percentage } from '../formValueTypes.js'
import validate from '../conversation-validate'

let advancedInputSelector = formValueSelector('advancedQuestions'),
	basicInputSelector = formValueSelector('basicInput')

@reduxForm({
	form: 'advancedQuestions',
	validate,
})
@connect(state => ({
	formValue: (field, simple) => simple ? basicInputSelector(state, field): advancedInputSelector(state, field),
	steps: state.steps,
	themeColours: state.themeColours
}))
class Conversation extends Component {
	render() {
		let { formValue, steps, themeColours: {colour, textColour}} = this.props
		let effectifEntreprise = formValue('effectifEntreprise', 'basicInput')

		/* C'est ici qu'est définie la suite de questions à poser. */
		return (
			<div id="conversation">
				<SelectCommune
					visible={effectifEntreprise >= 10}
					title="Commune"
					question="Quelle est la commune de l'embauche ?"
					name="codeINSEE" />
				<Input
					title="Complémentaire santé"
					question="Quel est le montant total par salarié de la complémentaire santé obligatoire de l'entreprise ?"
					visible={effectifEntreprise < 10 || steps.get('codeINSEE')}
					name="mutuelle" />
				<Group
					text="Risques professionnels"
					visible={steps.get('mutuelle')}
					foldTrigger="tauxRisque"
					valueType={percentage}
					>
						<Question
							visible={true}
							title="Taux de risque connu"
							question="Connaissez-vous votre taux de risque AT/MP ?"
							name="tauxRisqueConnu" />
						<Input
							title="Taux de risque"
							question="Entrez votre taux de risque"
							visible={formValue('tauxRisqueConnu') == 'Oui'}
							name="tauxRisque" />
						<Group name="tauxInconnu" visible={formValue('tauxRisqueConnu')== 'Non'}>
							<SelectTauxRisque
								visible={true}
								title="Code de risque sélectionné"
								question="Quelle est la catégorie de risque de votre entreprise ?"
								name="selectTauxRisque" />
							<ResultATMP
								name="resultATMP"
								selectedTauxRisque={formValue('selectTauxRisque')}
								formValue={formValue}
								{...{steps}}
								effectif={formValue('effectifEntreprise', 'basicInput')} />
						</Group>
				</Group>

				<Input
					title="Pourcentage d'alternants"
					question="Quel est le pourcentage d'alternants dans votre entreprise ?"
					visible={effectifEntreprise >= 249 && steps.get('tauxRisque')}
					name="pourcentage_alternants" />

				<Question
					visible={
						(effectifEntreprise < 249 && steps.get('tauxRisque'))
						|| steps.get('pourcentage_alternants')}
					title="Régime Alsace-Moselle"
					question="Le salarié est-il affilié au régime d'Alsace-Moselle ?"
					name="alsaceMoselle" />

				<Question
					title="Pénibilité du travail"
					question="Le salarié est-il exposé à des facteurs de pénibilité au-delà des seuils d'exposition ?"
					visible={steps.get('alsaceMoselle')}
					name="penibilite" />

				<Question
					title="Exonération Jeune Entreprise Innovante"
					question="Profitez-vous du statut Jeune Entreprise Innovante pour cette embauche ?"
					visible={steps.get('penibilite')}
					name="jei" />

				<Question
					title="Votre avis"
					question="Votre estimation est terminée. En êtes-vous satisfait ?"
					visible={steps.get('jei')}
					name="serviceUtile" />
				<RhetoricalQuestion
					visible={formValue('serviceUtile') === ':-)'}
					name="partage"
					question={<span>
						Merci. N'hésitez pas à partager le simulateur !
					</span>
					} />
				<TextArea
					visible={formValue('serviceUtile') === ':-|'}
					name="remarque"
					title="Votre remarque"
					question={'Que pouvons-nous faire pour l\'améliorer ?'}
					/>
		</div>)
	}
}

export default Conversation
