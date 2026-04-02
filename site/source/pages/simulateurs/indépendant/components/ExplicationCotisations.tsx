import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import { WhenNotApplicable } from '@/components/EngineValue/WhenNotApplicable'

import CotisationsForfaitaires from './CotisationsForfaitaires'
import CotisationsRégularisation from './CotisationsRégularisation'

export default function ExplicationCotisations() {
	return (
		<section>
			<WhenApplicable dottedName="indépendant . cotisations et contributions . début activité">
				<CotisationsForfaitaires />
			</WhenApplicable>
			<WhenNotApplicable dottedName="indépendant . cotisations et contributions . début activité">
				<CotisationsRégularisation />
			</WhenNotApplicable>
		</section>
	)
}
