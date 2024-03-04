import { Message } from '@/design-system'
import { Loader } from '@/design-system/icons/Loader'
import { H1 } from '@/design-system/typography/heading'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { useFetchData } from '@/hooks/useFetchData'

import StatPage from './StatsPage'
import { StatsStruct } from './types'

export default function Stats() {
	const { data: stats, loading } = useFetchData<StatsStruct>('/data/stats.json')

	const statsAvailable = stats?.visitesMois != null

	return (
		<>
			{statsAvailable ? (
				<>
					<StatPage stats={stats} />
				</>
			) : loading ? (
				<>
					<H1>Statistiques 📊</H1>
					<Intro>
						Chargement des statistiques <Loader />{' '}
					</Intro>
				</>
			) : (
				<>
					<H1>Statistiques 📊</H1>
					<Message type="error" icon mini>
						<Body>Statistiques indisponibles.</Body>
					</Message>
				</>
			)}
		</>
	)
}
