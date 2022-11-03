import { Trans } from 'react-i18next'

import { useUrl } from '@/components/ShareSimulationBanner'
import { Message } from '@/design-system'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'

export default function PrintExportRecover() {
	return (
		<section className="print-only">
			<Message>
				<Body>
					<Trans i18nKey="pages.simulateurs.print-info.recover">
						Retrouvez cette simulation ainsi que d'autres outils d'aide à la
						création et à la gestion d'entreprise, sur{' '}
						<Link href={useUrl()} target="_blank" rel="noreferrer">
							mon-entreprise.urssaf.fr
						</Link>
						.
					</Trans>
				</Body>

				<Body>
					<Trans i18nKey="pages.simulateurs.print-info.date">
						Cette simulation a été effectuée le
					</Trans>{' '}
					{new Date().toLocaleDateString()}.
				</Body>
			</Message>
		</section>
	)
}
