import { useUrl } from 'Components/ShareSimulationBanner'
import React from 'react'
import { Trans } from 'react-i18next'

export default function ExportRecover() {
	return (
		<section className="ui__ screen-display-none  notice">
			<p>
				<Trans i18nKey="pages.simulateurs.print-info.recover">
					Retrouvez cette simulation ainsi que d'autres outils d'aide à la
					création et à la gestion d'entreprise, sur{' '}
					<a href={useUrl()} target="_blank">
						mon-entreprise.fr
					</a>
					.
				</Trans>
			</p>

			<p>
				<Trans i18nKey="pages.simulateurs.print-info.date">
					Cette simulation a été effectuée le
				</Trans>{' '}
				{new Date().toLocaleDateString()}.
			</p>
		</section>
	)
}
