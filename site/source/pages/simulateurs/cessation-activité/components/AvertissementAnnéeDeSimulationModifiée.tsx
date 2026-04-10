import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { FadeIn } from '@/components/ui/animate'
import { Body, CloseButton, Message } from '@/design-system'
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
		showAvertissement && (
			<FadeIn>
				<Message type="info" mini className="print-hidden">
					<Body>
						{t(
							'pages.simulateurs.cessation-activité.date-modifiée',
							'L’année de simulation a été changée pour {{ année }}.',
							{ année }
						)}
					</Body>
					<HideButton
						onPress={() => setShowAvertissement(false)}
						aria-label={t('Cacher le message')}
						color="tertiary"
					/>
				</Message>
			</FadeIn>
		)
	)
}

const HideButton = styled(CloseButton)`
	position: absolute;
	top: ${({ theme }) => theme.spacings.sm};
	right: ${({ theme }) => theme.spacings.sm};
`
