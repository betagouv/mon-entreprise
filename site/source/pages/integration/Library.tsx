import { Trans } from 'react-i18next'

import PageHeader from '@/components/PageHeader'
import { ScrollToTop } from '@/components/utils/Scroll'
import { Message } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { Code, Strong } from '@/design-system/typography'
import { H2, H3, H4 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ol } from '@/design-system/typography/list'
import { Body, Intro } from '@/design-system/typography/paragraphs'

import Meta from '../../components/utils/Meta'
import { CasParticuliers } from './components/CasParticuliers'
import StepByStep from './components/StepByStep'
import illustration from './images/illustration_library.svg'

export default function Library() {
	return (
		<div css="iframe{margin-top: 1em; margin-bottom: 1em}">
			<Meta
				page="library"
				title="Librairie de calcul"
				description="Outils pour les développeurs"
			/>
			<ScrollToTop />
			<Trans i18nKey="pages.développeur.bibliothèque">
				<PageHeader
					titre="Utilisez les calculs des simulateurs dans votre application"
					picture={illustration}
				>
					<Intro>
						Vous pouvez réutiliser les calculs de mon-entreprise sur votre site
						ou service très facilement grâce à la bibliothèque JavaScript
						open-source disponible sur npm.
					</Intro>
				</PageHeader>

				<H2>Comment utiliser cette librairie ?</H2>

				<H3>Installation</H3>
				<pre>
					<Code>npm install --save publicodes modele-social</Code>
				</pre>
				<Body>
					Pour lancer vos propres calculs, vous devez installer le paquet{' '}
					<Link
						href="https://www.npmjs.com/package/publicodes"
						aria-label="publicodes, voir la page npm de la librairie publicodes, nouvelle fenêtre"
					>
						<Code>publicodes</Code>
					</Link>{' '}
					contenant l'interpréteur publicodes, ainsi que le paquet{' '}
					<Link
						href="https://www.npmjs.com/package/modele-social"
						aria-label="modèle-social, voir la page npm de la librairie modèle-social, nouvelle fenêtre"
					>
						<Code>modele-social</Code>
					</Link>
					, qui contient les règles des simulateurs mon-entreprise.
				</Body>
				<Message icon>
					<H4>Qu'est-ce que publicodes ?</H4>
					<Body>
						Publicodes est un langage déclaratif développé par beta.gouv.fr et
						l'Urssaf pour encoder des algorithmes d'intérêt public. C'est le
						langage qui propulse tous les calculs des simulateurs de
						mon-entreprise.
					</Body>
					<Body>
						<Link
							href="https://publi.codes"
							aria-label="En savoir plus sur publicodes, nouvelle fenêtre"
						>
							En savoir plus sur publicodes
						</Link>
					</Body>
				</Message>
				<H3>Lancer le calcul</H3>
				<Body>
					Pour lancer le calcul, il vous faut paramétrer le moteur avec les
					règles du paquet <Code>modele-social</Code> et à appeler la fonction{' '}
					<Code>evaluate</Code> avec la règle dont vous souhaitez calculer la
					valeur. Voici un exemple pour le calcul brut / net
				</Body>
				<div
					className="ui__ full-width"
					css={`
						text-align: center;
					`}
				>
					<iframe
						src="https://codesandbox.io/embed/zen-keller-2dpct?fontsize=14&hidenavigation=1&theme=dark"
						css="width:100%; max-width: 1200px; height:500px; border:0; border-radius: 4px; overflow:hidden;"
						title="Exemple d'intégration sur codesandbox.io : lancement d'un calcul"
					></iframe>
				</div>
				<H2>Paramétrer le calcul</H2>
				<Body>
					Vous l'aurez constaté dans l'exemple précédent, la recette d'un calcul
					est simple : des variables d'entrée (le salaire brut), une ou
					plusieurs variables de sorties (le salaire net).
				</Body>
				<Body>
					Le calcul est cependant paramétrable avec toutes les possibilités
					permises dans les simulateurs de mon-entreprise !
				</Body>
				<Body>
					Toutes les règles disponibles sont listées et expliquées sur la{' '}
					<Link
						target="_blank"
						rel="noreferrer"
						href="/documentation"
						aria-label="documentation en ligne, voir la documentation en ligne, nouvelle fenêtre"
					>
						documentation en ligne
					</Link>
					. Cette documentation est auto-générée depuis les fichiers de règles
					publicodes, et alimentée par la simulation en cours.
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
							Copiez l'extrait de code personnalisé et intégrez-le dans votre
							application
						</Strong>
						<br />
						Vous le trouverez en cliquant sur la section « Réutiliser ce calcul
						».
						<br />
					</Li>
					<Li>
						<Strong>
							(facultatif) Modifiez les valeurs de la situation pour paramétrer
							le calcul selon vos besoins
						</Strong>
						<br /> Vous pouvez modifier sans hésiter les valeurs de la
						situation. Ces dernières acceptent n'importe quelle{' '}
						<Link
							href="https://publi.codes/docs/principes-de-base"
							aria-label="expression ou objet publicodes, en savoir plus sur publi.codes, nouvelle fenêtre"
						>
							expression ou objet publicodes.
						</Link>
					</Li>
				</Ol>

				<Body>
					Voici ce que donne le calcul avec l'exemple cité ci-dessus :
				</Body>
				<div>
					<iframe
						src="https://codesandbox.io/embed/mon-entreprise-exemple-2-cev02?fontsize=14&hidenavigation=1&theme=dark"
						css="width:100%; max-width: 1200px; height:500px; border:0; border-radius: 4px; overflow:hidden;"
						title="Exemple d'intégration sur codesandbox.io : paramétrage du calcul"
					></iframe>
				</div>
				<Message type="info" icon>
					<Body>
						La situation contient les données de votre simulation (cadre avec
						salaire à 3400 € brut), mais également les données relatives au
						paramétrage du simulateur.
					</Body>
				</Message>
				<CasParticuliers />

				<H2>
					Faire des graphiques économiques <Emoji emoji="📈" />
				</H2>
				<Body>
					Il est aussi possible d'utiliser la bibliothèque pour des calculs
					d'analyse économique ou politique. Ici, on trace le prix du travail et
					le salaire net en fonction du brut.
				</Body>
				<Body css="font-style: italic; border-left: 6px solid #eee; padding-left: .6rem">
					On peut constater la progressivité du salaire total, qui est en
					pourcent plus faible pour un SMIC que pour un haut revenu. Autrement
					dit, les hauts salaires paient une partie des cotisations sociales des
					bas salaires.
				</Body>
				<div
					className="ui__ full-width"
					css={`
						text-align: center;
					`}
				>
					<iframe
						src="https://codesandbox.io/embed/mon-entreprise-exemple-3-4j11c?fontsize=14&hidenavigation=1&theme=dark"
						css="width:100%; max-width: 1200px; height:500px; border:0; border-radius: 4px; overflow:hidden;"
						title="Exemple d'intégration sur codesandbox.io : association avec d'autres librairies"
					></iframe>
				</div>
			</Trans>
		</div>
	)
}
