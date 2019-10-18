import { ScrollToTop } from 'Components/utils/Scroll';
import { SitePathsContext } from 'Components/utils/withSitePaths';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import { LANDING_LEGAL_STATUS_LIST } from '../../sitePaths';
import AfterRegistration from './AfterRegistration';
import CreationChecklist from './CreationChecklist';
import GuideStatut from './GuideStatut';
import Home from './Home';


export default function CreateMyCompany() {
	const statutChoisi = useSelector(state => state.inFranceApp.companyStatusChoice);
	const sitePaths = useContext(SitePathsContext);
	const location = useLocation()
	return (
		<>
			<ScrollToTop key={location.pathname} />
			<Switch>
				{statutChoisi &&
					<Redirect
						exact
						from={sitePaths.créer.index}
						to={sitePaths.créer[statutChoisi]}
					/>
				}
				<Route
					exact
					path={sitePaths.créer.index}
					component={Home}
				/>
				{LANDING_LEGAL_STATUS_LIST.map(statut => (
					<Route path={sitePaths.créer[statut]} key={statut} >
						<CreationChecklist statut={statut} />
					</Route>
				))
				}
				<Route
					path={sitePaths.créer.après}
					component={AfterRegistration}
				/>
				<Route
					path={sitePaths.créer.guideStatut.index}
					component={GuideStatut}
				/>
			</Switch>

		</>
	)
}
