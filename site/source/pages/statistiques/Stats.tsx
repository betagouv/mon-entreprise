import { Message } from '@/design-system'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { useFetchData } from '@/hooks/useFetchData'

import DemandeUtilisateurs from './DemandesUtilisateurs'
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
				<Intro>Chargement des statistiques...</Intro>
			) : (
				<Message type="error" icon mini>
					<Body>Statistiques indisponibles.</Body>
				</Message>
			)}

			<DemandeUtilisateurs />
		</>
	)
}
