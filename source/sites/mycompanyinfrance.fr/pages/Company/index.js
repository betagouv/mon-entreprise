import withSitePaths from 'Components/utils/withSitePaths';
import { compose } from 'ramda';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import * as Animate from 'Ui/animate';
import AfterRegistration from './AfterRegistration';
import AutoEntrepreneur from './AutoEntrepreneur';
import CreationChecklist from './CreationChecklist';
import DefineDirectorStatus from './DirectorStatus';
import Find from './Find';
import Home from './Home';
import Liability from './Liability';
import MinorityDirector from './MinorityDirector';
import NumberOfAssociate from './NumberOfAssociate';
import PickLegalStatus from './PickLegalStatus';
import YourCompany from './YourCompany';
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
	sitePaths
}) => {
	return (
		<>
			<Animate.fromBottom>
				<Switch>
					<Route
						path={sitePaths.entreprise.votreEntreprise}
						component={YourCompany}
					/>
					{sitePaths.entreprise.créer(':status').map(path => <Route path={path} key={path} component={CreationChecklist} />)}
					<Route path={sitePaths.entreprise.trouver} component={Find} />
					<Route
						path={sitePaths.entreprise.après}
						component={AfterRegistration}
					/>
					<Route
						path={sitePaths.entreprise.statutJuridique.index}
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
							to={sitePaths.entreprise.statutJuridique.index}
						/>
					)}
				</Switch>
				<Switch location={location}>
					<Route
						path={sitePaths.entreprise.statutJuridique.liability}
						component={withAnimation(Liability)}
					/>
					<Route
						path={sitePaths.entreprise.statutJuridique.directorStatus}
						component={withAnimation(DefineDirectorStatus)}
					/>
					<Route
						path={sitePaths.entreprise.statutJuridique.autoEntrepreneur}
						component={withAnimation(AutoEntrepreneur)}
					/>
					<Route
						path={sitePaths.entreprise.statutJuridique.multipleAssociates}
						component={withAnimation(NumberOfAssociate)}
					/>
					<Route
						path={sitePaths.entreprise.statutJuridique.minorityDirector}
						component={withAnimation(MinorityDirector)}
					/>
					<Route
						path={sitePaths.entreprise.statutJuridique.liste}
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
	withTranslation(),
	withSitePaths
)(CreateMyCompany)
