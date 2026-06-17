import { Trans } from 'react-i18next'
import { Hit } from 'react-instantsearch-core'
import { connectHits } from 'react-instantsearch-dom'
import { styled } from 'styled-components'

import {
	Emoji,
	Grid,
	H3,
	InfoBulle,
	SmallBody,
	SmallCard,
} from '@/design-system'
import { MergedSimulatorDataValues } from '@/hooks/useCurrentSimulatorData'
import { useNavigationOrigin } from '@/hooks/useNavigationOrigin'

import { FromTop } from '../ui/animate'
import { Highlight } from './Hightlight'

type AlgoliaSimulatorHit = Hit<{
	icône: string
	title: string
	path: MergedSimulatorDataValues['path']
	pathId: MergedSimulatorDataValues['pathId']
	tooltip?: MergedSimulatorDataValues['tooltip']
}>

type SimulatorHitsProps = {
	hits: Array<AlgoliaSimulatorHit>
}

const SimulateurCardHit = ({ hit }: { hit: AlgoliaSimulatorHit }) => {
	const [, setNavigationOrigin] = useNavigationOrigin()

	return (
		<StyledSmallCard
			icon={<Emoji emoji={hit.icône} />}
			to={{ pathname: hit.path ?? '/' }}
			onPress={() => setNavigationOrigin({ fromSimulateurs: true })}
			title={
				<p>
					<Highlight hit={hit} attribute="title" />{' '}
					{hit.tooltip && <InfoBulle description={hit.tooltip} />}
				</p>
			}
		/>
	)
}

const StyledSmallCard = styled(SmallCard)`
	border: solid 1px ${({ theme }) => theme.colors.bases.primary[800]};
`

export const SimulatorHits = connectHits<
	{ hits: AlgoliaSimulatorHit[] },
	AlgoliaSimulatorHit
>(({ hits }: SimulatorHitsProps) => (
	<>
		<H3 as="h2">
			<Trans>Simulateurs</Trans>
		</H3>
		{!hits.length && (
			<FromTop>
				<SmallBody $grey>
					<Trans>
						Aucun résultat ne correspond à votre recherche. Essayez avec
						d'autres mots-clés.
					</Trans>
				</SmallBody>
			</FromTop>
		)}
		<Grid container spacing={2} as="ul" style={{ padding: 0 }}>
			{hits.map(
				(hit) =>
					hit.pathId && (
						<Grid
							item
							key={hit.objectID}
							xs={12}
							lg={6}
							as="li"
							style={{ listStyle: 'none' }}
						>
							<SimulateurCardHit hit={hit} />
						</Grid>
					)
			)}
		</Grid>
	</>
))
