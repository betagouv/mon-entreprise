import { T } from 'Components';
import { SitePathsContext } from 'Components/utils/withSitePaths';
import React, { useContext } from 'react';
import { Route, Switch } from 'react-router';
import { NavLink } from 'react-router-dom';
import Activité from './Activité';
import ActivitésSelection from './ActivitésSelection';
import reducer from './reducer';
import { StoreProvider } from './StoreContext';
import VotreSituation from './VotreSituation';

export default function ÉconomieCollaborative() {
	const sitePaths = useContext(SitePathsContext);
	return (
		<>
			<div css="transform: translateY(2rem)">
				<NavLink
					to={sitePaths.économieCollaborative.index}
					exact
					activeClassName="ui__ hide"
					className="ui__ simple small push-left button ">
					← <T k="économieCollaborative.retourAccueil">Retour à la selection d'activités</T>
				</NavLink>
			</div>
			<StoreProvider
				reducer={reducer}
				localStorageKey="app::économie-collaborative:v1">
				<Switch>
					<Route
						exact
						path={sitePaths.économieCollaborative.index}
						component={ActivitésSelection}
					/>
					<Route
						path={sitePaths.économieCollaborative.votreSituation}
						component={VotreSituation}
					/>
					<Route
						path={sitePaths.économieCollaborative.index + '/:title'}
						component={Activité}
					/>
				</Switch>
			</StoreProvider>
		</>
	)
}
