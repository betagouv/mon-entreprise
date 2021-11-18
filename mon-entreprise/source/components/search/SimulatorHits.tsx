import { Grid } from '@mui/material'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { H3 } from 'DesignSystem/typography/heading'
import { path } from 'ramda'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { connectHits } from 'react-instantsearch-dom'
import { SimulateurCard } from '../../pages/Simulateurs/Home'

type AlgoliaSimulatorHit = {
	objectID: string
	icône: string
	title: string
	pathId: string
}

type SimulatorHitsProps = {
	hits: Array<AlgoliaSimulatorHit>
}

export const SimulatorHits = connectHits(({ hits }: SimulatorHitsProps) => {
	const sitePaths = useContext(SitePathsContext)
	return (
		<>
			{hits.length > 0 && (
				<H3 as="h2">
					<Trans>Simulateurs</Trans>
				</H3>
			)}
			<Grid container spacing={2}>
				{hits.map((hit) => (
					<SimulateurCard
						key={hit.objectID}
						small
						shortName={hit.title}
						icône={hit.icône}
						path={path(hit.pathId.split('.'), sitePaths)}
					/>
				))}
			</Grid>
		</>
	)
})
