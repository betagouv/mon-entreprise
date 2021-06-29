import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { path } from 'ramda'
import { useContext } from 'react'
import { connectHits, Highlight } from 'react-instantsearch-dom'
import { Link } from 'react-router-dom'

type AlgoliaSimulatorHit = {
	objectID: string
	icône: string
	title: string
	pathId: string
}

type SimulatorHitProps = {
	hit: AlgoliaSimulatorHit
	path?: string
}

const SimulatorHit = ({ hit, path = '' }: SimulatorHitProps) => (
	<Link
		className="simulator-hit-content ui__ interactive card box"
		to={path || ''}
	>
		<div className="ui__ box-icon">
			{hit.icône && <Emoji emoji={hit.icône} />}{' '}
		</div>
		<Highlight hit={hit} attribute="title" />
	</Link>
)

type SimulatorHitsProps = {
	hits: Array<AlgoliaSimulatorHit>
}

export const SimulatorHits = connectHits(({ hits }: SimulatorHitsProps) => {
	const sitePaths = useContext(SitePathsContext)
	return (
		<div className="ais-Hits-list">
			{hits.map((hit) => (
				<SimulatorHit
					key={hit.objectID}
					hit={hit}
					path={path(hit.pathId.split('.'), sitePaths)}
				/>
			))}
		</div>
	)
})
