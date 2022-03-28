import Emoji from '@/components/utils/Emoji'
import { ScrollToTop } from '@/components/utils/Scroll'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { Link } from '@/design-system/typography/link'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Route, Switch, useLocation } from 'react-router-dom'
import { TrackChapter } from '../../ATInternetTracking'
import Iframe from './Iframe'
import Library from './Library'
import Options from './Options'
import jobOffers from '@/data/job-offers.json'
import { Banner, InnerBanner } from '@/design-system/banner'

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
		<>
			<TrackChapter chapter1="integration" />
			<ScrollToTop />

			{pathname !== sitePaths.integration.index && (
				<Link
					className="ui__ simple small push-left button"
					to={sitePaths.integration.index}
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
				<Route exact path={sitePaths.integration.index} component={Options} />
				<Route path={sitePaths.integration.iframe} component={Iframe} />
				<Route path={sitePaths.integration.library} component={Library} />
			</Switch>
		</>
	)
}
