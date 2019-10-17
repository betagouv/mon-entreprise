import { usePersistingState } from 'Components/utils/persistState'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Route, Switch } from 'react-router'
import { Link, useLocation } from 'react-router-dom'
import AssimiléSalarié from './AssimiléSalarié'
import AutoEntrepreneur from './AutoEntrepreneur'
import Indépendant from './Indépendant'
import Salarié from './Salarié'
import SchemeComparaison from './SchemeComparaison'

export default function Simulateurs() {
    const sitePaths = useContext(SitePathsContext)
    const { state } = useLocation()
    const [lastState] = usePersistingState(
        'navigation::simulateurs::locationState::v2',
        state
    )
    return (
        <>
            <ScrollToTop />
            <div css="transform: translateY(2rem);">
                {lastState ?.fromGérer && (
                    <Link to={sitePaths.gérer.index} className="ui__ simple small button">
                        {emoji('⬅️')} Retour à mon activité
					</Link>
                )}
                {lastState ?.fromCréer && (
                    <Link to={sitePaths.gérer.index} className="ui__ simple small button">
                        {emoji('⬅️')} Retour à la création
					</Link>
                )}
            </div>
            <Switch>
                <Route path={sitePaths.simulateurs.salarié} component={Salarié} />
                <Route
                    path={sitePaths.simulateurs.comparaison}
                    component={SchemeComparaison}
                />
                <Route
                    path={sitePaths.simulateurs['assimilé-salarié']}
                    component={AssimiléSalarié}
                />
                <Route
                    path={sitePaths.simulateurs.indépendant}
                    component={Indépendant}
                />
                <Route
                    path={sitePaths.simulateurs['auto-entrepreneur']}
                    component={AutoEntrepreneur}
                />
            </Switch>
        </>
    )
}
