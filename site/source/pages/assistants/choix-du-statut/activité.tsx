import { Spacing } from '@/design-system/layout'
import { H1, H3 } from '@/design-system/typography/heading'

import SearchCodeAPE from '../recherche-code-ape/SearchCodeAPE'
import Navigation from './_components/Navigation'

export default function Activité() {
	return (
		<>
			<H1>Votre activité</H1>
			<H3 as="h2">
				Je souhaite créer une entreprise avec comme activité principale :
			</H3>
			<SearchCodeAPE />
			<Navigation currentStepIsComplete />
		</>
	)
}
