import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import { WhenNotApplicable } from '@/components/EngineValue/WhenNotApplicable'

import CotisationsForfaitaires from './CotisationsForfaitaires'
import CotisationsRégularisation from './CotisationsRegularisation'

export default function ExplicationCotisations() {
	return (
		<section>
			<WhenApplicable dottedName="independant . cotisations et contributions . début activité">
				<CotisationsForfaitaires />
			</WhenApplicable>
			<WhenNotApplicable dottedName="independant . cotisations et contributions . début activité">
				<CotisationsRégularisation />
			</WhenNotApplicable>
		</section>
	)
}
