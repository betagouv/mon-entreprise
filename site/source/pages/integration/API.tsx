import BetaBanner from '@/components/BetaBanner'
import { ScrollToTop } from '@/components/utils/Scroll'
import { Message } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { H1, H2, H3, H4 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { Trans } from 'react-i18next'
import styled from 'styled-components'

const InlineCode = styled.code`
	background-color: #eee;
	padding: 0.25rem;
	border-radius: 0.25rem;
`

export default function API() {
	return (
		<div css="iframe{margin-top: 1em; margin-bottom: 1em}">
			<ScrollToTop />

			<Trans i18nKey="pages.développeur.api">
				<H1>Utiliser notre API REST </H1>
				<BetaBanner>
					<H3 as="h1">API en version beta</H3>
					<Intro>
						Des changements cassants sont succeptibles d'être apportés dans les
						prochaines semaine.
					</Intro>
					<Body>
						N'hésitez pas à faire des retours sur son utilisation directement
						sur Github.
					</Body>
				</BetaBanner>
				<Intro>
					Si votre site ou service requiert de faire des calculs sur des
					salaires, par exemple passer du salaire brut au salaire net, bonne
					nouvelle : tous les calculs de cotisations et impôts de mon-entreprise
					sont libres et utilisable via notre API REST.
				</Intro>
				<Body>
					<Button size="XL" href="/api/v1/doc">
						Essayer l'API
					</Button>
				</Body>
				<H2>Comment utiliser cette API ?</H2>

				<Body>
					L'api mon-entreprise est totalement ouverte et sans authentification,
					elle se compose de 3 routes qui s'inspirent des méthodes de
					l'interpréteur <Link href="https://publi.codes">Publicodes</Link> :{' '}
					<InlineCode>/evaluate</InlineCode>, <InlineCode>/rules</InlineCode> et{' '}
					<InlineCode>/rules/:rule</InlineCode>. Retrouvez plus d'informations
					sur notre{' '}
					<Link href="/api/v1/doc/#/publicodes-api/evaluate">Swagger UI</Link>.
					<br />
				</Body>

				<Message>
					<H4 as="h3">Qu'est ce que Publicodes ?</H4>
					<Body>
						Publicodes est un language déclaratif développé par beta.gouv.fr et
						l'Urssaf pour encoder des algorithmes d'intérêt public. Toutes nos
						règles de calculs sont implémentées dans ce language.
					</Body>
					<Body>
						<Link href="https://publi.codes">
							En savoir plus sur publicodes
						</Link>
					</Body>
				</Message>

				<H2>Exemple</H2>
				<Body>
					Voici un exemple d'utilisation des différentes routes, vous pouvez
					explorer leur code dans le dossier <InlineCode>example</InlineCode>
				</Body>

				<div
					className="ui__ full-width"
					css={`
						text-align: center;
					`}
				>
					<iframe
						css="width:100%; max-width: 1200px; height:500px; border:0; border-radius: 4px; overflow:hidden;"
						src="https://stackblitz.com/edit/api-mon-entreprise?ctl=1&embed=1&file=main.js"
						title="Exemple d'intégration dans un éditeur de code en ligne"
					></iframe>
				</div>
			</Trans>
		</div>
	)
}
