import { Trans } from 'react-i18next'

import { TrackPage } from '@/components/ATInternetTracking'
import { Message } from '@/design-system'
import { Spacing } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'

import SearchCodeAPE from './SearchCodeAPE'

export default function SearchCodeApePage() {
	return (
		<>
			<TrackPage name="accueil" />
			<Trans i18nKey="pages.assistants.recherche-code-ape.description">
				<Body>
					Cet assistant vous permet de trouver rapidement le code APE (activité
					principale exercée) qui correspond à votre activité. Ce code est
					attribué par l'INSEE à chaque entreprise en France afin de les
					catégoriser.
				</Body>

				<Message border={false} icon mini>
					<SmallBody>
						Retrouvez plus d'informations sur le code APE sur{' '}
						<Link
							aria-label="Plus d'infos, en savoir plus sur service-public.fr, nouvelle fenêtre"
							href="https://entreprendre.service-public.fr/vosdroits/F33050"
						>
							entreprendre.service-public.fr
						</Link>{' '}
						et{' '}
						<Link
							aria-label="Plus d'infos, en savoir plus sur service-public.fr, nouvelle fenêtre"
							href="https://www.economie.gouv.fr/entreprises/activite-entreprise-code-ape-code-naf"
						>
							economie.gouv.fr
						</Link>
						.
					</SmallBody>
				</Message>
			</Trans>
			<Spacing md />
			<SearchCodeAPE disabled />
		</>
	)
}
