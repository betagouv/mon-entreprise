import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import { Route, Switch } from 'react-router'
import AssimiléSalarié from './AssimiléSalarié'
import AutoEntrepreneur from './AutoEntrepreneur'
import Indépendant from './Indépendant'
import Salarié from './Salarié'
import SchemeComparaison from './SchemeComparaison'

export default function Simulateurs() {
    const sitePaths = useContext(SitePathsContext);
    return (
        <>
            <ScrollToTop />
            <Switch>
                {/* <Route exact path={sitePaths.simulateurs.index} component={Home} /> */}
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