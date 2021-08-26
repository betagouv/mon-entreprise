import { LinkButton } from 'Components/ui/Button'
import React from 'react'
import { Trans } from 'react-i18next'
import Banner from './Banner'

export default function ExportSimulationBanner() {
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
							window.print()
						}}
					>
						Imprimer ou sauvegarder en PDF
					</LinkButton>
				</Trans>
			}
		</Banner>
	)
}
