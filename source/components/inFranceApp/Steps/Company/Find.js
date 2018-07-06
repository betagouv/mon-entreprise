/* @flow */
import React from 'react'
// $FlowFixMe
import ReactSelect from 'react-select'
// $FlowFixMe
import 'react-select/dist/react-select.css'
import './Find.css'
import { Link, withRouter } from 'react-router-dom'
import { toPairs } from 'ramda'
import { connect } from 'react-redux'
import { compose }from 'ramda';
import type {  RouterHistory } from 'react-router'
import type {  SaveExistingCompanyDetailsAction } from '../../types'


const goToNextStep = (history: RouterHistory) => {
	history.push('/social-security')
}

type CompanyType = {[string]: string};

type State = {
	input: ?Company,
}

type Props = {
	// $FlowFixMe
	onCompanyDetailsConfirmation: {[string]: string} => void,
	history: RouterHistory,
}

class Search extends React.Component<Props, State> {
	state = {
		input: null,
		
	}
	handleChange = input => {
		this.setState({ input })
	}
	getOptions = (input: string) =>
			fetch(`https://sirene.entreprise.api.gouv.fr/v1/full_text/${input}`)
					.then(response => {
						if (!response.ok) console.log('not ok')
						return response.json()
					})
					.then(json => ({ options: json.etablissement }))
					.catch(function(error) {
						console.log(
							'Erreur dans la recherche de communes à partir du code postal',
							error
						) // eslint-disable-line no-console
					})
	
	render() {
		
		return (
			<>
			<h1 className="question__title">Find your company</h1>
			<p>
			<Link to="/my-company">
				I don&apos;t have a company yet
			</Link>
			</p>
			<p> Thanks to the SIREN database, the public informations of your company will be automatically available for the next steps.</p>
			
				<ReactSelect.Async
					valueKey="id"
					labelKey="l1_normalisee"
					value={this.state.input}
					onChange={this.handleChange}
					optionRenderer={({ l1_normalisee, code_postal }) =>
						l1_normalisee + ` (${code_postal})`
					}
					placeholder="Company name and city"
					noResultsText="We didn't find any matching registered company."
					searchPromptText={null}
					loadingPlaceholder="Searching..."
					loadOptions={this.getOptions}
				/>

					{!!this.state.input &&
						<>
							<Company {...this.state.input} />
							<button onClick={() => {
								this.props.onCompanyDetailsConfirmation(this.state.input);
								goToNextStep(this.props.history)
							}} className="ui__ button">
								Confirm and simulate hiring costs
							</button>
						</>
					}
			</>
		)
	}
}

let companyDataSelection = {
	l1_normalisee: 'Address',
	libelle_activite_principale: 'Main activity',
	libelle_region: 'Region',
	libelle_tranche_effectif_salarie_entreprise: 'Number of employees',
	date_creation: 'Creation date'
}

let Company = (data: CompanyType) => {
	return (
		<ul>
			{toPairs(data).map(
				([key, value]) =>
					companyDataSelection[key] != null ? (
						<li key={key}>
							<strong>{companyDataSelection[key]}</strong><br/>
							{value}
						</li>
					) : null
			)}
		</ul>
	)
}

export default compose(withRouter,connect(null, {
	onCompanyDetailsConfirmation: (details: {[string]: string}): SaveExistingCompanyDetailsAction => ({ type: 'SAVE_EXISTING_COMPANY_DETAILS', details })
}))(Search);