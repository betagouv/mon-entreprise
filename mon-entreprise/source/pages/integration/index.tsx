import Emoji from 'Components/utils/Emoji'
import { ScrollToTop } from 'Components/utils/Scroll'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Link } from 'DesignSystem/typography/link'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Route, Switch, useLocation } from 'react-router-dom'
import { TrackChapter } from '../../ATInternetTracking'
import Iframe from './Iframe'
import Library from './Library'
import Options from './Options'

export default function Integration() {
	const sitePaths = useContext(SitePathsContext)
	const { pathname } = useLocation()
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
			{/* TODO: Nous pourrions automatiser la publication de cette bannière
			de recrutement lorsqu'une annonce est postée sur beta.gouv.fr
			https://github.com/betagouv/beta.gouv.fr/issues/6343 */}
			{/* <div
				className="ui__ card plain"
				css={`
					margin: 1rem 0;
					transform: translateY(1rem);

					text-align: center;
					padding: 0.4rem;
				`}
			>
				📯{' '}
				<strong>
					<a href="https://beta.gouv.fr/recrutement/2021/05/25/mon-entreprise-fr.recrute.js.html">
						Mon-entreprise recrute !
					</a>
				</strong>{' '}
				<small>Freelance Typescript / React pour 6 mois minimum</small>
			</div> */}
			<Switch>
				<Route exact path={sitePaths.integration.index} component={Options} />
				<Route path={sitePaths.integration.iframe} component={Iframe} />
				<Route path={sitePaths.integration.library} component={Library} />
			</Switch>
		</>
	)
}
