import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FadeIn } from '@/components/ui/animate'
import { Body, Message } from '@/design-system'
import useYear from '@/hooks/useYear'
import { useEngine } from '@/utils/publicodes/EngineContext'

export const AvertissementAnnéeDeSimulationModifiée = () => {
	const année = useYear()
	const annéeRef = useRef(année)

	const engine = useEngine()
	const dottedName = 'entreprise . date de cessation'
	const evaluation = engine.evaluate(dottedName)
	const estDateDeCessationParDéfaut = dottedName in evaluation.missingVariables

	const [showAvertissement, setShowAvertissement] = useState(false)
	const { t } = useTranslation()

	useEffect(() => {
		if (annéeRef.current !== année) {
			setShowAvertissement(!estDateDeCessationParDéfaut)
			annéeRef.current = année
		}
	}, [année, estDateDeCessationParDéfaut])

	return (
		<div role="status">
			{showAvertissement && (
				<FadeIn>
					<Message
						type="success"
						mini
						className="print-hidden"
						dismissible
						onDismiss={() => setShowAvertissement(false)}
					>
						<Body>
							{t(
								'pages.simulateurs.cessation-activité.date-modifiée',
								'L’année de simulation a été changée pour {{ année }}.',
								{ année: annéeRef.current }
							)}
						</Body>
					</Message>
				</FadeIn>
			)}
		</div>
	)
}
