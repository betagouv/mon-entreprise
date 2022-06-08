import Emoji from '@/components/utils/Emoji'
import { ScrollToTop } from '@/components/utils/Scroll'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import jobOffers from '@/data/job-offers.json'
import { Banner, InnerBanner } from '@/design-system/banner'
import { Link } from '@/design-system/typography/link'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Route, Switch, useLocation } from 'react-router-dom'
import { TrackChapter } from '../../ATInternetTracking'
import API from './API'
import Iframe from './Iframe'
import Library from './Library'
import Options from './Options'
import Spreadsheet from './Spreadsheet'

type JobOffer = {
	title: string
	link: string
	content: string
}

export default function Integration() {
	const sitePaths = useContext(SitePathsContext)
	const { pathname } = useLocation()
	const openJobOffer = (jobOffers as Array<JobOffer>)[0]

	return (
		<TrackChapter chapter1="integration">
			<ScrollToTop />

			{pathname !== sitePaths.développeur.index && (
				<Link
					className="ui__ simple small push-left button"
					to={sitePaths.développeur.index}
				>
					← <Trans>Outils pour les développeurs</Trans> <Emoji emoji="👨‍💻" />
				</Link>
			)}
			{openJobOffer && (
				<Banner>
					<InnerBanner>
						<span>
							<Emoji emoji="📯" />{' '}
							<strong>
								<a href={openJobOffer.link}>Mon-entreprise recrute !</a>
							</strong>{' '}
							<small>{openJobOffer.title}</small>
						</span>
					</InnerBanner>
				</Banner>
			)}
			<Switch>
				<Route exact path={sitePaths.développeur.index} component={Options} />
				<Route path={sitePaths.développeur.iframe} component={Iframe} />
				<Route path={sitePaths.développeur.library} component={Library} />
				<Route path={sitePaths.développeur.api} component={API} />
				<Route
					path={sitePaths.développeur.spreadsheet}
					component={Spreadsheet}
				/>
			</Switch>
		</TrackChapter>
	)
}
