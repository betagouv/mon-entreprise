/* @flow */
import { saveExistingCompanyDetails } from 'Actions/existingCompanyActions'
import { React, T } from 'Components'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose } from 'ramda'
import Helmet from 'react-helmet'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import ReactSelect from 'react-select'
// $FlowFixMe
import 'react-select/dist/react-select.css'
import type { SitePaths } from 'Components/utils/withSitePaths'
import type { TFunction } from 'react-i18next'
import './Find.css'
import { CompanyDetails as Company } from './YourCompany'
import type { RouterHistory } from 'react-router'

const goToNextStep = (history: RouterHistory, sitePaths: Object) => {
	history.push(sitePaths.sécuritéSociale.index)
}

type State = {
	input: ?{ [string]: string }
}
type OwnProps = {}
type Props = {
	history: RouterHistory,
	t: TFunction,
	sitePaths: SitePaths,
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
		let { t, sitePaths } = this.props
		return (
			<div id="findYourCompany">
				<Helmet>
					<title>{t('trouver.titre', 'Retrouver votre entreprise')}</title>
					<meta
						name="description"
						content={t(
							'trouver.page.description',
							"Trouvez votre entreprise existante et commencez à simuler des coûts d'embauche adaptés à votre situation."
						)}
					/>
				</Helmet>
				<h1 className="question__title">
					<T k="trouver.titre">Retrouver votre entreprise</T>
				</h1>
				<p>
					<Link to={sitePaths.entreprise.index}>
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
								goToNextStep(this.props.history, sitePaths)
							}}
							className="ui__ button">
							<T k="trouver.ok">Confirmer et simuler vos cotisations</T>
						</button>
					</>
				)}
			</div>
		)
	}
}

export default (compose(
	withSitePaths,
	withRouter,
	connect(
		null,
		{
			onCompanyDetailsConfirmation: saveExistingCompanyDetails
		}
	),
	withTranslation()
)(Search): React$ComponentType<OwnProps>)
