import { Trans } from 'react-i18next'

import PageHeader from '@/components/PageHeader'
import { ScrollToTop } from '@/components/utils/Scroll'
import { Button } from '@/design-system/buttons'
import { Code, Strong } from '@/design-system/typography'
import { H2, H3 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ol, Ul } from '@/design-system/typography/list'
import { Body, Intro } from '@/design-system/typography/paragraphs'

import { CasParticuliers } from './_components/CasParticuliers'
import StepByStep from './_components/StepByStep'
import illustration from './_images/API_illustration.svg'

export default function API() {
	return (
		<div css="iframe{margin-top: 1em; margin-bottom: 1em}">
			<ScrollToTop />

			<Trans i18nKey="pages.développeur.api">
				<PageHeader titre="API REST de simulation" picture={illustration}>
					<Intro>
						Vous pouvez réutiliser les calculs de mon-entreprise sur votre site
						ou service très facilement grâce à notre API REST ouverte et sans
						authentification.
					</Intro>
					<Button size="XL" href="/api/v1/doc">
						Accéder au Swagger
					</Button>
				</PageHeader>
				<H2>Comment effectuer un calcul via l'API ?</H2>
				<Body>
					Pour effectuer un calcul, il vous suffit de faire un <Code>POST</Code>{' '}
					sur la route <Code>/evaluate</Code> avec les paramètres suivants :
				</Body>
				<Ul>
					<Li>
						<Code>expressions</Code> : le nom des règles dont vous voulez
						calculer la valeur
					</Li>
					<Li>
						<Code>situation</Code> : la situation pour le paramétrage du calcul
					</Li>
				</Ul>
				<Body>
					<Link to="/api/v1/doc/#/publicodes-api/evaluate">
						Voir l'exemple dans le Swagger
					</Link>
				</Body>

				<H3>Comment reproduire un calcul d'un simulateur ?</H3>
				<Body>
					Pour répliquer un calcul d'un simulateur de mon-entreprise dans la
					bibliothèque, voici la marche à suivre :{' '}
				</Body>
				<Ol>
					<StepByStep />
					<Li>
						<Strong>
							Dans la section « Règle et situation », vous trouverez le nom de
							la règle et la situation à utiliser comme paramètres d'appel à
							<Code>/evaluate</Code>.
						</Strong>
						<br />
						Vous pouvez également retrouver la requête API à copier-coller sous
						forme d'appel <Code>curl</Code> ou de <Code>fetch</Code>
						JavaScript dans la section « Réutiliser ce calcul ».
						<br />
					</Li>
				</Ol>
				<CasParticuliers />
				<H2>Exemple</H2>
				<Body>
					Voici un exemple d'utilisation des différentes routes, vous pouvez
					explorer leur code dans le dossier <Code>example</Code>
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
