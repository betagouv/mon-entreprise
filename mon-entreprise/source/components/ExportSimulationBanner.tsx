import React, { useContext, useEffect, useState } from 'react'
import Banner from './Banner'
import { Trans, useTranslation } from 'react-i18next'
import { LinkButton } from 'Components/ui/Button'

interface ExportSimulationBannerProps {
	userWillExport:()=>void
	disableAnimation: boolean
}

export default function ExportSimulationBanner({userWillExport, disableAnimation} : ExportSimulationBannerProps) {
	const [printRequired, setPrintRequired] = useState(false);
	useEffect(() => {
		if(printRequired) {
			window.print();
			setPrintRequired(false);
		}
	}, [disableAnimation])
	return (
		<Banner hideAfterFirstStep={false} icon="🖨" className='print-display-none'>
			{
				<Trans i18nKey="ExportSimulation.Banner">
					Pour conserver cette simulation :{' '}
					<LinkButton
						onClick={() => {setPrintRequired(true); disableAnimation ? window.print() : userWillExport(); }}
					>
						Imprimer ou sauvegarder en PDF
					</LinkButton>
				</Trans>
			}
		</Banner>
	)
}

