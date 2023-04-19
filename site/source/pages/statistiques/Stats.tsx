import { Message } from '@/design-system'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { useFetchData } from '@/hooks/useFetchData'

import DemandeUtilisateurs from './DemandesUtilisateurs'
import { StatsDetail } from './StatsDetail'
import StatsGlobal from './StatsGlobal'
import { StatsStruct } from './types'

interface StatsProps {
	accessibleMode: boolean
}

export default function Stats({ accessibleMode }: StatsProps) {
	const { data: stats, loading } = useFetchData<StatsStruct>('/data/stats.json')

	const statsAvailable = stats?.visitesMois != null

	return (
		<>
			{statsAvailable ? (
				<>
					<StatsDetail stats={stats} accessibleMode={accessibleMode} />

					<StatsGlobal stats={stats} accessibleMode={accessibleMode} />
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
