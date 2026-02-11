import { Trans, useTranslation } from 'react-i18next'
import { Route, Routes } from 'react-router-dom'

import { TrackChapter } from '@/components/ATInternetTracking'
import ScrollToTop from '@/components/utils/Scroll/ScrollToTop'
import { Banner, Emoji, InnerBanner, Link } from '@/design-system'
import { useFetchData } from '@/hooks/useFetchData'
import { useNavigation } from '@/lib/navigation'
import { useSitePaths } from '@/sitePaths'

import API from './API'
import Home from './Home'
import Iframe from './Iframe'
import Library from './Library'
import Spreadsheet from './Spreadsheet'

type JobOffer = {
	title: string
	link: string
	content: string
}

export default function Integration() {
	const { relativeSitePaths, absoluteSitePaths } = useSitePaths()
	const { currentPath: pathname } = useNavigation()
	const { data: jobOffers } = useFetchData<JobOffer[]>('/data/job-offers.json')
	const openJobOffer = jobOffers?.[0]

	const { t } = useTranslation()

	return (
		<TrackChapter chapter1="integration">
			<ScrollToTop />

			{pathname !== absoluteSitePaths.développeur.index && (
				<Link to={absoluteSitePaths.développeur.index}>
					<span aria-hidden>←</span> <Trans>Outils pour les développeurs</Trans>{' '}
					<Emoji emoji="👨‍💻" />
				</Link>
			)}
			{openJobOffer && (
				<Banner>
					<InnerBanner>
						<span>
							<Emoji emoji="📯" />{' '}
							<strong>
								<a
									href={openJobOffer.link}
									aria-label={t(
										"Mon entreprise recrute ! Voir les offres d'emplois de mon-entreprise.urssaf.fr"
									)}
								>
									Mon-entreprise recrute !
								</a>
							</strong>{' '}
							<small>{openJobOffer.title}</small>
						</span>
					</InnerBanner>
				</Banner>
			)}
			<Routes>
				<Route index element={<Home />} />
				<Route path={relativeSitePaths.développeur.api} element={<API />} />
				<Route
					path={relativeSitePaths.développeur.iframe}
					element={<Iframe />}
				/>
				<Route
					path={relativeSitePaths.développeur.library}
					element={<Library />}
				/>
				<Route
					path={relativeSitePaths.développeur.spreadsheet}
					element={<Spreadsheet />}
				/>
			</Routes>
		</TrackChapter>
	)
}
