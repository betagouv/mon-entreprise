import { Trans } from 'react-i18next'
import Banner from './Banner'

export default function ExportSimulationBanner() {
	return (
		<Banner hideAfterFirstStep={false} icon="🖨">
			{
				<Trans i18nKey="ExportSimulation.Banner">
					<button
						className="ui__ small simple button"
						onClick={() => {
							window.print()
						}}
					>
						Imprimer ou sauvegarder en PDF
					</button>
				</Trans>
			}
		</Banner>
	)
}
