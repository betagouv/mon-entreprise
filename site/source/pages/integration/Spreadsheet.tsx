import { ScrollToTop } from '@/components/utils/Scroll'
import { H1, H2 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { useSitePaths } from '@/sitePaths'
import { Trans } from 'react-i18next'

export default function Spreadsheet() {
	const { absoluteSitePaths } = useSitePaths()

	return (
		<div css="iframe{margin-top: 1em; margin-bottom: 1em}">
			<ScrollToTop />
			<Trans i18nKey="pages.développeur.spreadsheet">
				<H1>Utiliser avec un tableur</H1>
				<Body>
					Vous souhaitez utiliser un simulateur dans une feuille Google Sheets
					ou Excel ? C'est possible grâce à notre{' '}
					<Link to={absoluteSitePaths.développeur.api}>API REST</Link> !
				</Body>

				<H2>Intégrer un simulateur dans Excel/Sheets</H2>
				<Body>
					À terme, il sera possible de réaliser une simulation type sur notre
					site puis d'exporter ces informations pour créer une fonction
					Excel/Sheets à intégrer dans votre fichier.
					<br />
					Actuellement, vous pouvez vous inspirer de l'exemple ci-dessous.
				</Body>

				<H2>Exemple</H2>
				<Body>
					Vous pouvez trouver un exemple complet avec{' '}
					<Link href="https://docs.google.com/spreadsheets/d/1wbfxRdmEbUBgsXbGVc0Q6uqAV4IfLvux6oUJXJLhlaU/copy">
						Google Sheets
					</Link>
					, cliquez sur "Créer une copie" (vous pouvez vérifier les scripts avec
					"Afficher le fichier de script Apps")
				</Body>
			</Trans>
		</div>
	)
}
