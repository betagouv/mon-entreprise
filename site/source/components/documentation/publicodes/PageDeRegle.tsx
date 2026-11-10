'use client'

import Engine from 'publicodes'
import { useTranslation } from 'react-i18next'

import { Page404 } from '@/components/Page404'
import { FromBottom } from '@/components/ui/animate'
import Meta from '@/components/utils/Meta'
import ScrollToTop from '@/components/utils/Scroll/ScrollToTop'
import { Spacing } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { NomModèle } from '@/domaine/PublicodesSimulationConfig'
import { useNavigation } from '@/lib/navigation'

import { RetourÀLaSimulation } from '../RetourALaSimulation'
import { useRègleDuCheminCourant } from './useRegleDuCheminCourant'
import { Visualiseur } from './Visualiseur'

type Props = {
	documentationPath: string
	engine: Engine<DottedName>
	nomModèle: NomModèle
}

export function PageDeRègle({ documentationPath, engine, nomModèle }: Props) {
	const { t } = useTranslation()
	const { currentPath } = useNavigation()
	const règle = useRègleDuCheminCourant({
		documentationPath,
		engine,
	})

	if (!règle) {
		return <Page404 />
	}

	return (
		<>
			<Meta
				title={t('pages.documentation.meta.title', 'Documentation')}
				description={t(
					'pages.documentation.meta.description',
					'Documentation des règles de calcul de nos simulateurs et assistants'
				)}
			/>
			<FromBottom>
				<ScrollToTop key={currentPath} />
				<RetourÀLaSimulation />
				<Spacing xl />
			</FromBottom>
			<Visualiseur
				documentationPath={documentationPath}
				engine={engine}
				nomModèle={nomModèle}
				règle={règle}
			/>
		</>
	)
}
