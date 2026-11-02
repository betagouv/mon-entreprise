import { Trans } from 'react-i18next'

import { WhenNotAlreadyDefined } from '@/components/EngineValue/WhenNotAlreadyDefined'
import { FadeIn } from '@/components/ui/animate'
import BrowserOnly from '@/components/utils/BrowserOnly'
import { Emoji, Link, Message, SmallBody } from '@/design-system'
import { useSitePaths } from '@/sitePaths'

/**
 * Invite le visiteur qui simule un salaire alors qu'il dirige une SAS(U) à
 * rejoindre le simulateur dédié.
 *
 * L'équipe Code Du Travail Numérique ne souhaite pas référencer le simulateur
 * dirigeant de SASU sur son site : l'invitation est masquée aux visiteurs qui
 * en viennent.
 */
export function MessageDirigeantSASU() {
	return (
		<BrowserOnly>
			<InvitationAuSimulateurSASU />
		</BrowserOnly>
	)
}

function InvitationAuSimulateurSASU() {
	const { absoluteSitePaths } = useSitePaths()

	if (document.referrer?.includes('code.travail.gouv.fr')) {
		return null
	}

	return (
		<WhenNotAlreadyDefined dottedName="entreprise . catégorie juridique">
			<FadeIn>
				<Message
					border={false}
					mini
					icon={<Emoji emoji="👨‍✈️" />}
					className="print-hidden"
				>
					<SmallBody>
						<Trans i18nKey="pages.simulateurs.salarié.SASU">
							Vous êtes dirigeant d'une SAS(U) ?{' '}
							<Link to={absoluteSitePaths.simulateurs.sasu}>
								Accédez au simulateur de revenu dédié
							</Link>
						</Trans>
					</SmallBody>
				</Message>
			</FadeIn>
		</WhenNotAlreadyDefined>
	)
}
