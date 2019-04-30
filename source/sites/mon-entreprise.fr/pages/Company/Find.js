/* @flow */
import { saveExistingCompanyDetails } from 'Actions/existingCompanyActions';
import { React, T } from 'Components';
import withSitePaths from 'Components/utils/withSitePaths';
import { compose } from 'ramda';
import { Helmet } from 'react-helmet';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import ReactSelect from 'react-select';
// $FlowFixMe
import 'react-select/dist/react-select.css';
import './Find.css';
import { CompanyDetails as Company } from './YourCompany';
import type { SitePaths } from 'Components/utils/withSitePaths'
import type { TFunction } from 'react-i18next'
import type { RouterHistory } from 'react-router'

type State = {
	input: ?{ [string]: string }
}
type OwnProps = {}
type Props = {
	history: RouterHistory,
	t: TFunction,
	sitePaths: SitePaths
}

const isSIREN = (input: string) => input.match(/^ *([\d] *){9}$/)
const isSIRET = (input: string) => input.match(/^ *([\d] *){14}$/)

async function getOptions(input: string) {
	let etablissements
		try {
	if (isSIREN(input)) {
		input.replace(' ', '')
		const response = await fetch(
			`https://entreprise.data.gouv.fr/api/sirene/v1/siren/${input}`
		)
		if (!response.ok) {
			return
		}
		const json = await response.json()
		etablissements = [json.siege_social];
	} else if (isSIRET(input)) {
		input.replace(' ', '')
		const response = await fetch(
			`https://entreprise.data.gouv.fr/api/sirene/v1/siret/${input}`
		)
		if (!response.ok) {
			return
		}
		const json = await response.json()
		etablissements = [json.etablissement];
	} else {
		/* Full text search */
		const response = await fetch(
			`https://sirene.entreprise.api.gouv.fr/v1/full_text/${input}`
		)
		if (!response.ok) {
			return
		}
		const json = await response.json()
		etablissements = json.etablissement;
	}
		return { options: etablissements }
	} catch (error) {
		console.log(
			"Erreur dans la recherche d'entreprise à partir du SIREN / nom",
			error
		)
	}
}

class Search extends React.Component<Props, State> {
	state = {
		input: null
	}
	handleChange = input => {
		this.setState({ input })
	}
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
					autoFocus
					onChange={this.handleChange}
					optionRenderer={({ l1_normalisee, code_postal }) =>
						l1_normalisee + ` (${code_postal})`
					}
					placeholder={t("Entrez le nom, le SIREN ou le SIRET de l'entreprise")}
					noResultsText={t("Nous n'avons rien trouvé")}
					searchPromptText={null}
					loadingPlaceholder={t('Recherche en cours...')}
					loadOptions={getOptions}
					// We don't filter the API answer, the fulltext is more powerful than blind fuzzy matching
					filterOption={() => true}
				/>
				{!!this.state.input && (
					<>
						<Company {...this.state.input} />
						{this.state.input.nature_entrepreneur_individuel  ?
							<div className="ui__ plain card">
							<h2>Etes vous auto-entrepreneur ? </h2>
							<div className="ui__ answer-group">
							<button className="ui__ inverted-button" onClick={
							()=>	this.props.onCompanyDetailsConfirmation(this.state.input, true)
							}>Oui</button>
							<button  className="ui__ inverted-button" onClick={
							()=>	this.props.onCompanyDetailsConfirmation(this.state.input, false)
							}>Non</button>
							</div>
							</div>

						:
						<button
							onClick={() => {
								this.props.onCompanyDetailsConfirmation(this.state.input)
							}}
							className="ui__ plain button">
							<T k="trouver.ok">Confirmer et simuler vos cotisations</T>
						</button>}
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
