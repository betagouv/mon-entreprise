import { useTranslation } from 'react-i18next'

import { useCMG } from '@/contextes/cmg'
import { Body, Li, Ul } from '@/design-system'
import { RelativeSitePaths } from '@/sitePaths'

import Navigation from '../components/Navigation'

type Props = {
	précédent?: keyof RelativeSitePaths['assistants']['cmg']
}

export default function NonÉligible({ précédent }: Props) {
	const { raisonsInéligibilité } = useCMG()
	const { t } = useTranslation()

	if (!raisonsInéligibilité.length) {
		return
	}

	return (
		<>
			<Body>
				{t(
					'pages.assistants.cmg.non-éligible',
					'Vous n’êtes pas éligible au complément transitoire pour les raisons suivantes :'
				)}
			</Body>
			<Ul>
				{raisonsInéligibilité.map((raison, index) => (
					<Li key={index}>{raison}</Li>
				))}
			</Ul>

			<Navigation précédent={précédent} />
		</>
	)
}
