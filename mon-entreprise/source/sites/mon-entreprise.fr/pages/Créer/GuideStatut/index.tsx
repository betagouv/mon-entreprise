import { resetCompanyStatusChoice } from 'Actions/companyStatusActions'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { toPairs } from 'ramda'
import { useContext, useEffect } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { NavLink, Route, Switch, useLocation } from 'react-router-dom'
import Animate from 'Components/ui/animate'
import AutoEntrepreneur from './AutoEntrepreneur'
import DirectorStatus from './DirectorStatus'
import MinorityDirector from './MinorityDirector'
import NumberOfAssociate from './NumberOfAssociate'
import PickLegalStatus from './PickLegalStatus'
import PreviousAnswers from './PreviousAnswers'
import SoleProprietorship from './SoleProprietorship'

const useResetFollowingAnswers = () => {
	const dispatch = useDispatch()
	const sitePaths = useContext(SitePathsContext)
	const location = useLocation()
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
	const sitePaths = useContext(SitePathsContext)
	const location = useLocation()
	useResetFollowingAnswers()
	return (
		<>
			<div css="transform: translateY(2rem)">
				<NavLink
					to={sitePaths.créer.index}
					exact
					activeClassName="ui__ hide"
					className="ui__ simple push-left small button"
				>
					← <Trans>Retour</Trans>
				</NavLink>
			</div>
			<h1>
				<Trans i18nKey="formeJuridique.titre">Choix du statut juridique</Trans>
			</h1>
			<PreviousAnswers />
			<Animate.fromBottom key={location.pathname}>
				<Switch>
					<Route path={sitePaths.créer.guideStatut.soleProprietorship}>
						<SoleProprietorship />
					</Route>
					<Route path={sitePaths.créer.guideStatut.directorStatus}>
						<DirectorStatus />
					</Route>
					<Route path={sitePaths.créer.guideStatut.autoEntrepreneur}>
						<AutoEntrepreneur />
					</Route>
					<Route path={sitePaths.créer.guideStatut.multipleAssociates}>
						<NumberOfAssociate />
					</Route>
					<Route path={sitePaths.créer.guideStatut.minorityDirector}>
						<MinorityDirector />
					</Route>
					<Route path={sitePaths.créer.guideStatut.liste}>
						<PickLegalStatus />
					</Route>
				</Switch>
			</Animate.fromBottom>
		</>
	)
}
