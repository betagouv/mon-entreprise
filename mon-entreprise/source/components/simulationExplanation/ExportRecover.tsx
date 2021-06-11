import { Trans} from 'react-i18next'
import React from 'react'
import { GetUrl } from 'Components/ShareSimulationBanner'

export default function ExportRecover() {
	return (
		<section className="screen-display-none print-break-avoid">
			<h2><Trans i18nKey="pages.simulateurs.print-info.title">Vous souhaitez retrouver cette simulation ?</Trans></h2>

			<p>
				<Trans i18nKey="pages.simulateurs.print-info.recover">
					Retrouvez la, ainsi que d'autres outils d'aide à la création et à la gestion d'entreprise, sur{' '}
					<a href={GetUrl()} target="_blank">
						 mon-entreprise.fr
					</a>.
				</Trans>
			</p>

			<p>
				<Trans i18nKey="pages.simulateurs.print-info.date">
					Cette simulation a été effectuée le
				</Trans>
				{' '}{new Date().toLocaleDateString()}.
			</p>

		</section>
	)
}
