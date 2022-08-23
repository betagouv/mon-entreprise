import { resetCompanyStatusChoice } from '@/actions/companyStatusActions'
import { FromBottom } from '@/components/ui/animate'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { H1 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { RootState } from '@/reducers/rootReducer'
import { useRelativeSitePaths } from '@/sitePaths'
import { useContext, useEffect } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
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
				state.choixStatutJuridique.companyLegalStatus
			) as (keyof typeof state.choixStatutJuridique.companyLegalStatus)[]
	)
	useEffect(() => {
		const companyStatusCurrentQuestionName = (Object.entries(
			sitePaths.créer.guideStatut
		).find(([, pathname]) => location.pathname === pathname) || [])[0]
		if (!companyStatusCurrentQuestionName) {
			return
		}

		const firstAnswerToResetIndex = answeredQuestion.findIndex(
			(a) => a === companyStatusCurrentQuestionName
		)

		if (firstAnswerToResetIndex !== -1) {
			dispatch(
				resetCompanyStatusChoice(
					answeredQuestion.slice(firstAnswerToResetIndex)
				)
			)
		}
	}, [location.pathname, dispatch, sitePaths.créer.guideStatut])
}

export default function Créer() {
	const sitePaths = useContext(SitePathsContext)
	const relativeSitePaths = useRelativeSitePaths()
	const location = useLocation()
	useResetFollowingAnswers()

	return (
		<>
			<Link to={sitePaths.créer.index}>
				← <Trans>Retour</Trans>
			</Link>
			<TrackChapter chapter2="guide">
				<H1>
					<Trans i18nKey="formeJuridique.titre">
						Choix du statut juridique
					</Trans>
				</H1>
				<PreviousAnswers />
				<FromBottom key={location.pathname}>
					<Routes>
						<Route
							path={relativeSitePaths.créer.guideStatut.soleProprietorship}
							element={<SoleProprietorship />}
						/>
						<Route
							path={relativeSitePaths.créer.guideStatut.directorStatus}
							element={<DirectorStatus />}
						/>
						<Route
							path={relativeSitePaths.créer.guideStatut.autoEntrepreneur}
							element={<AutoEntrepreneur />}
						/>
						<Route
							path={relativeSitePaths.créer.guideStatut.multipleAssociates}
							element={<NumberOfAssociate />}
						/>
						<Route
							path={relativeSitePaths.créer.guideStatut.minorityDirector}
							element={<MinorityDirector />}
						/>
						<Route
							path={relativeSitePaths.créer.guideStatut.liste}
							element={<PickLegalStatus />}
						/>
						<Route
							index
							element={
								<Navigate to={sitePaths.créer.guideStatut.liste} replace />
							}
						/>
					</Routes>
				</FromBottom>
			</TrackChapter>
		</>
	)
}
