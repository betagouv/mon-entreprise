/* @flow */
import { saveExistingCompanyDetails } from 'Actions/existingCompanyActions'
import { React, T } from 'Components'
import { compose } from 'ramda'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
// $FlowFixMe
import ReactSelect from 'react-select'
// $FlowFixMe
import 'react-select/dist/react-select.css'
import sitePaths from '../../sitePaths'
import './Find.css'
import { CompanyDetails as Company } from './YourCompany'
import type { RouterHistory } from 'react-router'

const goToNextStep = (history: RouterHistory) => {
	history.push(sitePaths().sécuritéSociale.index)
}

type State = {
	input: ?{ [string]: string }
}

type Props = {
	// $FlowFixMe
	onCompanyDetailsConfirmation: ({ [string]: string }) => void,
	history: RouterHistory
}

class Search extends React.Component<Props, State> {
	state = {
		input: null
	}
	handleChange = input => {
		this.setState({ input })
	}
	getOptions = (input: string) =>
		fetch(`https://sirene.entreprise.api.gouv.fr/v1/full_text/${input}`)
			.then(response => {
				if (response.ok) {
					return response.json().then(json => ({ options: json.etablissement }))
				}
			})
			.catch(function(error) {
				console.log(
					'Erreur dans la recherche de communes à partir du code postal',
					error
				) // eslint-disable-line no-console
			})

	render() {
		let { t } = this.props
		return (
			<div id="findYourCompany">
				<Helmet>
					<title>Find your company</title>
					<meta
						name="description"
						content="Find your existing company, and start simulate hiring cost customized to your situation"
					/>
				</Helmet>
				<h1 className="question__title">
					<T k="trouver.titre">Trouver mon entreprise</T>
				</h1>
				<p>
					<Link to={sitePaths().entreprise.index}>
						<T k="trouver.non">Je n'ai pas encore d'entreprise</T>
					</Link>
				</p>
				<p>
					<T k="trouver.description">
						Grâce à la base SIREN, les données publiques sur votre entreprise
						seront automatiquement disponibles pour la suite du parcours sur le
						site.
					</T>
				</p>
				{/* $FlowFixMe */}
				<ReactSelect.Async
					valueKey="id"
					labelKey="l1_normalisee"
					value={this.state.input}
					onChange={this.handleChange}
					optionRenderer={({ l1_normalisee, code_postal }) =>
						l1_normalisee + ` (${code_postal})`
					}
					placeholder={t('Entrez le nom de votre société')}
					noResultsText={t("Nous n'avons rien trouvé")}
					searchPromptText={null}
					loadingPlaceholder={t('Recherche en cours...')}
					loadOptions={this.getOptions}
				/>
				{!!this.state.input && (
					<>
						<Company {...this.state.input} />
						<button
							onClick={() => {
								this.props.onCompanyDetailsConfirmation(this.state.input)
								goToNextStep(this.props.history)
							}}
							className="ui__ button">
							<T k="trouver.ok">Confirm and simulate hiring costs</T>
						</button>
					</>
				)}
			</div>
		)
	}
}

export default compose(
	withRouter,
	connect(
		null,
		{
			onCompanyDetailsConfirmation: saveExistingCompanyDetails
		}
	),
	translate()
)(Search)
