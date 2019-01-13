import React from 'react'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { compose } from 'ramda'
import { Redirect, Route, Switch } from 'react-router'
import * as Animate from 'Ui/animate'
import withSitePaths from 'Components/utils/withSitePaths'
import AfterRegistration from './AfterRegistration'
import CreationChecklist from './CreationChecklist'
import DefineDirectorStatus from './DirectorStatus'
import Find from './Find'
import Home from './Home'
import Liability from './Liability'
import Microenterprise from './Microenterprise'
import MinorityDirector from './MinorityDirector'
import NumberOfAssociate from './NumberOfAssociate'
import PickLegalStatus from './PickLegalStatus'
import YourCompany from './YourCompany'
const withAnimation = Component => {
	const AnimateRouteComponent = (...props) => (
		<Animate.fromBottom>
			<Component {...props} />
		</Animate.fromBottom>
	)
	return AnimateRouteComponent
}

const CreateMyCompany = ({
	match,
	location,
	companyStatusChoice,
	existingCompany,
	sitePaths,
}) => {
	
	return (
		<>
			<Animate.fromBottom>
				<Switch>
					<Route
						path={sitePaths.entreprise.votreEntreprise}
						component={YourCompany}
					/>
					<Route
						path={sitePaths.entreprise.créer(':status')}
						component={CreationChecklist}
					/>
					<Route path={sitePaths.entreprise.trouver} component={Find} />
					<Route path={sitePaths.entreprise.après} component={AfterRegistration} />
					<Route
						path={sitePaths.entreprise.statusJuridique.index}
						component={Home}
					/>
					{existingCompany && (
						<Redirect
							exact
							from={match.path}
							to={sitePaths.entreprise.votreEntreprise}
						/>
					)}
					{companyStatusChoice ? (
						<Redirect
							exact
							from={match.path}
							to={sitePaths.entreprise.créer(companyStatusChoice)}
						/>
					) : (
						<Redirect
							exact
							from={match.path}
							to={sitePaths.entreprise.statusJuridique.index}
						/>
					)}
				</Switch>
				<Switch location={location}>
					<Route
						path={sitePaths.entreprise.statusJuridique.liability}
						component={withAnimation(Liability)}
					/>
					<Route
						path={sitePaths.entreprise.statusJuridique.directorStatus}
						component={withAnimation(DefineDirectorStatus)}
					/>
					<Route
						path={sitePaths.entreprise.statusJuridique.microEnterprise}
						component={withAnimation(Microenterprise)}
					/>
					<Route
						path={sitePaths.entreprise.statusJuridique.multipleAssociates}
						component={withAnimation(NumberOfAssociate)}
					/>
					<Route
						path={sitePaths.entreprise.statusJuridique.minorityDirector}
						component={withAnimation(MinorityDirector)}
					/>
					<Route
						path={sitePaths.entreprise.statusJuridique.liste}
						component={withAnimation(PickLegalStatus)}
					/>
				</Switch>
			</Animate.fromBottom>
		</>
	)
}

export default compose(
	connect(state => ({
		companyStatusChoice: state.inFranceApp.companyStatusChoice,
		existingCompany: state.inFranceApp.existingCompanyDetails
	})),
	withNamespaces(), 
	withSitePaths
)(CreateMyCompany)
