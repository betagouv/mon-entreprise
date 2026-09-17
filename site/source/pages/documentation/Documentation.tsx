import Engine from 'publicodes'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes } from 'react-router-dom'

import {
	useRègleDocumentée,
	VisualiseurPublicodes,
} from '@/components/documentation'
import { TrackPage } from '@/components/PianoAnalytics'
import { FromBottom } from '@/components/ui/animate'
import Meta from '@/components/utils/Meta'
import ScrollToTop from '@/components/utils/Scroll/ScrollToTop'
import { Spacing } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { NomModèle } from '@/domaine/PublicodesSimulationConfig'
import { useNavigation } from '@/lib/navigation'

import BackToSimulation from './BackToSimulation'
import DocumentationLanding from './DocumentationLanding'

type Props = {
	documentationPath: string
	engine: Engine<DottedName>
	nomModèle: NomModèle
}

export default function Documentation({
	documentationPath,
	engine,
	nomModèle,
}: Props) {
	return (
		<Routes>
			<Route index element={<DocumentationLanding />} />
			<Route
				path="*"
				element={
					<PageDeLaRègle
						documentationPath={documentationPath}
						engine={engine}
						nomModèle={nomModèle}
					/>
				}
			/>
		</Routes>
	)
}

const PageDeLaRègle = ({ documentationPath, engine, nomModèle }: Props) => {
	const { t } = useTranslation()
	const { currentPath } = useNavigation()
	const règle = useRègleDocumentée({ documentationPath, engine })

	if (!règle) {
		return <Navigate to="/404" replace />
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
				<TrackPage chapter1="documentation" name={règle} />
				<ScrollToTop key={currentPath} />
				<BackToSimulation />
				<Spacing xl />
			</FromBottom>
			<VisualiseurPublicodes
				documentationPath={documentationPath}
				engine={engine}
				nomModèle={nomModèle}
			/>
		</>
	)
}
