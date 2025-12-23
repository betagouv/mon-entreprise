import { Body, H1, Intro, Message, Spinner } from '@/design-system'
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
						Chargement des statistiques <Spinner />{' '}
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
