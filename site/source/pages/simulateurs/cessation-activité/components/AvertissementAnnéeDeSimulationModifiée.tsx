import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FadeIn } from '@/components/ui/animate'
import { Body, Message } from '@/design-system'
import useYear from '@/hooks/useYear'

export const AvertissementAnnéeDeSimulationModifiée = () => {
	const année = useYear()
	const annéeRef = useRef(année)
	const [showAvertissement, setShowAvertissement] = useState(false)
	const { t } = useTranslation()

	useEffect(() => {
		if (annéeRef.current !== année) {
			setShowAvertissement(true)
			annéeRef.current = année
		}
	}, [année])

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
								{ année }
							)}
						</Body>
					</Message>
				</FadeIn>
			)}
		</div>
	)
}
