import { Condition } from '@/components/EngineValue/Condition'

import CotisationsForfaitaires from './CotisationsForfaitaires'
import CotisationsRégularisation from './CotisationsRégularisation'

export default function ExplicationCotisations() {
	return (
		<section>
			{/* TODO: remplacer Condition par When(Not)Applicable quand
					https://github.com/betagouv/mon-entreprise/issues/4035
					sera résolu */}
			<Condition expression="entreprise . date de création >= période . début d'année">
				<CotisationsForfaitaires />
			</Condition>
			<Condition expression="entreprise . date de création < période . début d'année">
				<CotisationsRégularisation />
			</Condition>
		</section>
	)
}
