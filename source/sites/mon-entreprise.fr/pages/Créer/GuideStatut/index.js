/* @flow */
import { resetCompanyStatusChoice } from 'Actions/companyStatusActions';
import { T } from 'Components';
import { SitePathsContext } from 'Components/utils/withSitePaths';
import { toPairs } from 'ramda';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { NavLink, Route, useLocation } from 'react-router-dom';
import Animate from 'Ui/animate';
import AutoEntrepreneur from './AutoEntrepreneur';
import DirectorStatus from './DirectorStatus';
import MinorityDirector from './MinorityDirector';
import NumberOfAssociate from './NumberOfAssociate';
import PickLegalStatus from './PickLegalStatus';
import PreviousAnswers from './PreviousAnswers';
import SoleProprietorship from './SoleProprietorship';


const withAnimation = Component => {
    const AnimateRouteComponent = (...props) => (
        <Animate.fromBottom>
            <Component {...props} />
        </Animate.fromBottom>
    )
    return AnimateRouteComponent
}

const useResetFollowingAnswers = () => {
    const dispatch = useDispatch();
    const sitePaths = useContext(SitePathsContext);
    const location = useLocation();
    useEffect(() => {
        const companyStatusCurrentQuestionName = (toPairs(
            sitePaths.créer.guideStatut
        ).find(([, pathname]) => location.pathname === pathname) || [])[0]
        if (!companyStatusCurrentQuestionName) {
            return
        }
        dispatch(resetCompanyStatusChoice(companyStatusCurrentQuestionName))
    }, [location.pathname, dispatch, sitePaths.créer.guideStatut])
}

export default function Créer() {
    const sitePaths = useContext(SitePathsContext);
    useResetFollowingAnswers();
    return (
        <>
            <div css="transform: translateY(2rem)">
                <NavLink
                    to={sitePaths.créer.index}
                    exact
                    activeClassName="ui__ hide"
                    className="ui__ simple push-left small button">
                    ← <T>Retour</T>
                </NavLink>
            </div>
            <h1>
                <T k="formeJuridique.titre">Choix du statut juridique</T>
            </h1>
            <PreviousAnswers />
            <Route
                path={sitePaths.créer.guideStatut.soleProprietorship}
                component={withAnimation(SoleProprietorship)}
            />
            <Route
                path={sitePaths.créer.guideStatut.directorStatus}
                component={withAnimation(DirectorStatus)}
            />
            <Route
                path={sitePaths.créer.guideStatut.autoEntrepreneur}
                component={withAnimation(AutoEntrepreneur)}
            />
            <Route
                path={sitePaths.créer.guideStatut.multipleAssociates}
                component={withAnimation(NumberOfAssociate)}
            />
            <Route
                path={sitePaths.créer.guideStatut.minorityDirector}
                component={withAnimation(MinorityDirector)}
            />
            <Route
                path={sitePaths.créer.guideStatut.liste}
                component={withAnimation(PickLegalStatus)}
            />
        </>
    )
}

