/* @flow */
import { chooseCompanyLiability } from 'Actions/companyStatusActions'
import { React, T } from 'Components'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { SkipButton } from 'Ui/Button'
import type { CompanyLiability } from 'Types/companyTypes'
type Props = {
	multipleAssociates: ?boolean,
	chooseCompanyLiability: (?CompanyLiability) => void
}

const Liability = ({ chooseCompanyLiability, multipleAssociates }: Props) => (
	<>
		<Helmet>
			<title>Choosing the liability for your company in France</title>
			<meta
				name="description"
				content="Sole proprietorship or limited liability? Each option has legal implications, and leads to a different status for creating your company in France"
			/>
		</Helmet>
		<h2>
			<T>Responsabilité de l'entreprise</T>
		</h2>
		<p>
			<T k="responsabilité.intro">Plusieurs options légales s'offrent à vous</T>
			:
		</p>
		<ul>
			<li>
				{multipleAssociates === false ? (
					<T k="responsabilité.1">
						<strong>Entreprise individuelle :</strong>
						Une activité économique exercée par une seule personne physique, en
						son nom propre. Moins de paperasse, mais plus de problèmes en cas de
						faillite, car votre patrimoine personnel peut être mis à
						contribution.
					</T>
				) : (
					<>
						<strong>
							{multipleAssociates ? (
								<T k="responsabilité.2">
									Responsabilité illimitée conjointe et solidaire{' '}
								</T>
							) : (
								<T k="responsabilité.2bis">Responsabilité illimitée </T>
							)}
							:{' '}
						</strong>
						<T k="responsabilité.2Description">
							La responsabilité financière des actionnaires ne se limite pas à
							leur apport. En cas de faillite, leur patrimoine personnel peut
							être mis à contribution
						</T>
					</>
				)}
			</li>

			<li>
				<T k="responsabilité.3">
					<strong>Responsabilité limitée : </strong>
					Structure organisationnelle dans laquelle le Les membres de la société
					ne peuvent être tenus personnellement responsables des dettes ou
					obligations de la société. Cependant, c'est plus lourd à mettre en
					place, et vous devez fournir un capital initial.
				</T>
			</li>
		</ul>
		<div className="ui__ answer-group">
			<button
				onClick={() => {
					chooseCompanyLiability('UNLIMITED_LIABILITY')
				}}
				className="ui__ button">
				{multipleAssociates === false
					? 'Sole proprietorship'
					: 'Unlimited Liability'}
			</button>
			<button
				onClick={() => {
					chooseCompanyLiability('LIMITED_LIABILITY')
				}}
				className="ui__ button">
				Limited liability
			</button>
			<SkipButton onClick={() => chooseCompanyLiability(null)} />
		</div>
		{/* this is an economic activity conducted by a single natural person, in his own name ; */}
		{/* Company  : This is an economic activity conducted by a single partner - single member company with limited liability (EURL) - or several partners (limited liability company (SARL), public limited company (SA), simplified joint-stock company (SAS)...). */}
	</>
)

export default connect(
	state => ({
		multipleAssociates: state.inFranceApp.companyLegalStatus.multipleAssociates
	}),
	{ chooseCompanyLiability }
)(Liability)
