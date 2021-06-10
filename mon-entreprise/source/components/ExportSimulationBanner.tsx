import React, { useContext, useEffect, useState } from 'react'
import Banner from './Banner'
import { Trans, useTranslation } from 'react-i18next'
import { LinkButton } from 'Components/ui/Button'

export default function ExportSimulationBanner() {

	return (
		<Banner hideAfterFirstStep={false} icon="🖨">
			{
				<Trans i18nKey="ExportSimulation.Banner">
					Pour conserver cette simulation :{' '}
					<LinkButton
						onClick={() => {window.print()}}
					>
						Imprimer ou sauvegarder en PDF
					</LinkButton>
				</Trans>
			}
		</Banner>
	)
}

