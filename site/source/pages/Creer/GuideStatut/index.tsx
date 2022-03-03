import { resetCompanyStatusChoice } from 'Actions/companyStatusActions'
import { FromBottom } from 'Components/ui/animate'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { H1 } from 'DesignSystem/typography/heading'
import { Link } from 'DesignSystem/typography/link'
import { dropWhile, toPairs } from 'ramda'
import { useContext, useEffect } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch, useLocation } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import { TrackChapter } from '../../../ATInternetTracking'
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
	const answeredQuestion = useSelector(
		(state: RootState) =>
			Object.keys(
				state.inFranceApp.companyLegalStatus
			) as (keyof typeof state.inFranceApp.companyLegalStatus)[]
	)
	useEffect(() => {
		const companyStatusCurrentQuestionName = (toPairs(
			sitePaths.créer.guideStatut
		).find(([, pathname]) => location.pathname === pathname) || [])[0]
		if (!companyStatusCurrentQuestionName) {
			return
		}

		const answersToReset = dropWhile(
			(a) => a !== companyStatusCurrentQuestionName,
			answeredQuestion
		)
		if (!answersToReset.length) {
			return
		}
		dispatch(resetCompanyStatusChoice(answersToReset))
	}, [location.pathname, dispatch, sitePaths.créer.guideStatut])
}

export default function Créer() {
	const sitePaths = useContext(SitePathsContext)
	const location = useLocation()
	useResetFollowingAnswers()
	return (
		<>
			<Link to={sitePaths.créer.index}>
				← <Trans>Retour</Trans>
			</Link>
			<TrackChapter chapter2="guide" />
			<H1>
				<Trans i18nKey="formeJuridique.titre">Choix du statut juridique</Trans>
			</H1>
			<PreviousAnswers />
			<FromBottom key={location.pathname}>
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
			</FromBottom>
		</>
	)
}
