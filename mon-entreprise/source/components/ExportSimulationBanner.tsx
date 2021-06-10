import { LinkButton } from 'Components/ui/Button'
import React, { useEffect, useState } from 'react'
import { Trans } from 'react-i18next'
import Banner from './Banner'

interface ExportSimulationBannerProps {
	userWillExport: () => void
	disableAnimation: boolean
}

export default function ExportSimulationBanner({
	userWillExport,
	disableAnimation,
}: ExportSimulationBannerProps) {
	const [printRequired, setPrintRequired] = useState(false)
	useEffect(() => {
		if (printRequired) {
			window.print()
			setPrintRequired(false)
		}
	}, [disableAnimation])
	return (
		<Banner
			hideAfterFirstStep={false}
			icon="🖨"
			className="ui__ print-display-none"
		>
			{
				<Trans i18nKey="ExportSimulation.Banner">
					Pour conserver cette simulation :{' '}
					<LinkButton
						onClick={() => {
							setPrintRequired(true)
							disableAnimation ? window.print() : userWillExport()
						}}
					>
						Imprimer ou sauvegarder en PDF
					</LinkButton>
				</Trans>
			}
		</Banner>
	)
}
