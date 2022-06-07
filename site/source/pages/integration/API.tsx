import { ScrollToTop } from '@/components/utils/Scroll'
import { Message } from '@/design-system'
import { H1, H2, H3, H4 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
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
				<H1>Utiliser notre API REST</H1>
				<Body>
					Si votre site ou service requiert de faire des calculs sur des
					salaires, par exemple passer du salaire brut au salaire net, bonne
					nouvelle : tous les calculs de cotisations et impôts qui sont derrière
					mon-entreprise sont libres et utilisable via notre{' '}
					<Link href="/api/v1/doc/">API REST</Link>.
					{/* <Link href="https://docs.google.com/spreadsheets/d/1wbfxRdmEbUBgsXbGVc0Q6uqAV4IfLvux6oUJXJLhlaU/edit?usp=sharing">
						Google Sheets
					</Link> */}
				</Body>
				<H2>Comment utiliser cette API ?</H2>

				<Body>
					L'api mon-entreprise est totalement ouverte et sans authentification,
					elle se compose de 3 routes qui s'inspirent des méthodes de
					l'interpréteur Publicodes : <InlineCode>/evaluate</InlineCode>,{' '}
					<InlineCode>/rules</InlineCode> et{' '}
					<InlineCode>/rules/:rule</InlineCode>.
				</Body>

				<Message type="info">
					<H4>Qu'est ce que Publicodes ?</H4>
					<Body>
						C'est un language déclaratif développé par beta.gouv.fr et l'Urssaf
						pour encoder des algorithmes d'intérêt public.
						<br />
						Toutes nos règles de calculs sont donc écrites dans ce language.
						<br />
						<a href="https://publi.codes">En savoir plus sur publicodes</a>
					</Body>
				</Message>

				<H3>POST /evaluate</H3>
				<Body>
					Permet d'évaluer les expressions de publicode avec une situation
					donnée
					<br />
					Vous trouverez plus d'infos sur la structure du JSON à envoyer sur
					notre{' '}
					<Link href="/api/v1/doc/#/publicodes-api/evaluate">Swagger</Link>.
				</Body>

				<H3>GET /rules</H3>
				<Body>Permet de récupérer toutes les règles publicodes</Body>

				<H3>GET /rules/:rule</H3>
				<Body>Permet de récupérer une règle publicodes</Body>

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
					></iframe>
				</div>
			</Trans>
		</div>
	)
}
