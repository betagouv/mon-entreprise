import { Trans } from 'react-i18next'

import BrowserOnly from '@/components/utils/BrowserOnly'
import { Body, Link, Message } from '@/design-system'
import { useUrl } from '@/hooks/useUrl'

export default function PrintExportRecover() {
	return (
		<BrowserOnly>
			<SectionÀImprimer />
		</BrowserOnly>
	)
}

// L'URL de la simulation et la date du jour ne sont connues que du navigateur.
function SectionÀImprimer() {
	return (
		<section className="print-only">
			<Message>
				<Body>
					<Trans i18nKey="pages.simulateurs.commun.print-info.recover">
						Retrouvez cette simulation ainsi que d'autres outils d'aide à la
						création et à la gestion d'entreprise, sur{' '}
						<Link href={useUrl()} target="_blank" rel="noreferrer">
							mon-entreprise.urssaf.fr
						</Link>
						.
					</Trans>
				</Body>

				<Body>
					<Trans i18nKey="pages.simulateurs.commun.print-info.date">
						Cette simulation a été effectuée le
					</Trans>{' '}
					{new Date().toLocaleDateString()}.
				</Body>
			</Message>
		</section>
	)
}
