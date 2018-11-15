import React from 'react'
import { withI18n } from 'react-i18next'
import { connect } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router'
import * as Animate from 'Ui/animate'
import { ScrollToElement } from '../../../../components/utils/Scroll'
import sitePaths from '../../sitePaths'
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
		<ScrollToElement onlyIfNotVisible>
			<Animate.fromBottom>
				<Component {...props} />
			</Animate.fromBottom>
		</ScrollToElement>
	)
	return AnimateRouteComponent
}

const CreateMyCompany = ({
	match,
	location,
	companyStatusChoice,
	existingCompany
}) => {
	const paths = sitePaths()
	return (
		<>
			<Animate.fromBottom>
				<Switch>
					<Route
						path={paths.entreprise.votreEntreprise}
						component={YourCompany}
					/>
					<Route
						path={paths.entreprise.créer(':status')}
						component={CreationChecklist}
					/>
					<Route path={paths.entreprise.trouver} component={Find} />
					<Route path={paths.entreprise.après} component={AfterRegistration} />
					<Route
						path={paths.entreprise.statusJuridique.index}
						component={Home}
					/>
					{existingCompany && (
						<Redirect
							exact
							from={match.path}
							to={paths.entreprise.votreEntreprise}
						/>
					)}
					{companyStatusChoice ? (
						<Redirect
							exact
							from={match.path}
							to={paths.entreprise.créer(companyStatusChoice)}
						/>
					) : (
						<Redirect
							exact
							from={match.path}
							to={paths.entreprise.statusJuridique.index}
						/>
					)}
				</Switch>
				<Switch location={location}>
					<Route
						path={paths.entreprise.statusJuridique.liability}
						component={withAnimation(Liability)}
					/>
					<Route
						path={paths.entreprise.statusJuridique.directorStatus}
						component={withAnimation(DefineDirectorStatus)}
					/>
					<Route
						path={paths.entreprise.statusJuridique.microEnterprise}
						component={withAnimation(Microenterprise)}
					/>
					<Route
						path={paths.entreprise.statusJuridique.multipleAssociates}
						component={withAnimation(NumberOfAssociate)}
					/>
					<Route
						path={paths.entreprise.statusJuridique.minorityDirector}
						component={withAnimation(MinorityDirector)}
					/>
					<Route
						path={paths.entreprise.statusJuridique.liste}
						component={withAnimation(PickLegalStatus)}
					/>
				</Switch>
			</Animate.fromBottom>
		</>
	)
}

export default connect(state => ({
	companyStatusChoice: state.inFranceApp.companyStatusChoice,
	existingCompany: state.inFranceApp.existingCompanyDetails
}))(withI18n()(CreateMyCompany))
