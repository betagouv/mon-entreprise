import { Trans, useTranslation } from 'react-i18next'

import illustration from '@/assets/images/illustrations/library.svg'
import PageHeader from '@/components/PageHeader'
import ScrollToTop from '@/components/utils/Scroll/ScrollToTop'
import {
	Body,
	Code,
	Emoji,
	H2,
	H3,
	H4,
	Intro,
	Link,
	Message,
	SmallBody,
	Strong,
} from '@/design-system'
import { useSitePaths } from '@/sitePaths'

import Meta from '../../components/utils/Meta'
import { StyledExempleIframe } from './API'
import { CasParticuliers } from './components/CasParticuliers'
import ÉtapesPourReproduireUnCalcul from './components/EtapesPourReproduireUnCalcul'

export default function Library() {
	const { absoluteSitePaths } = useSitePaths()
	const { t } = useTranslation()

	return (
		<div>
			<Meta
				title={t('library.title', 'Librairie de calcul')}
				description={t('library.description', 'Outils pour les développeurs')}
			/>
			<ScrollToTop />
			<Trans i18nKey="pages.développeur.bibliothèque.texte">
				<PageHeader
					titre="Utilisez les calculs des simulateurs dans votre application"
					picture={illustration}
				>
					<Intro>
						Vous pouvez réutiliser les calculs de mon-entreprise sur votre site
						ou service très facilement grâce aux bibliothèques JavaScript open
						source disponibles sur npm.
					</Intro>
				</PageHeader>

				<H2>Quelle librairie choisir ?</H2>

				<H3>modele-as</H3>

				<Body>
					Cette librairie contient les règles et calculs pour les dirigeants{' '}
					<Strong>assimilés salariés</Strong> et dirigeantes assimilées
					salariées, comme les dirigeantes et dirigeants de SAS et de SASU.
					C’est la librairie utilisée dans le{' '}
					<Link to={absoluteSitePaths.simulateurs.sasu}>
						simulateur de revenus pour dirigeant de SAS(U)
					</Link>
					.
				</Body>

				<H3>modele-ti</H3>

				<Body>
					Cette librairie contient les règles et calculs pour les{' '}
					<Strong>travailleurs indépendants</Strong> et travailleuses
					indépendantes, comme les dirigeantes et dirigeants d'entreprise
					individuelle (hors auto-entreprise) ou d’EURL, et les professions
					libérales. C’est la librairie utilisée dans le{' '}
					<Link to={absoluteSitePaths.simulateurs.indépendant}>
						simulateur de revenus pour indépendant
					</Link>{' '}
					et ses variantes.
				</Body>

				<H3>modele-social</H3>

				<Body>
					C’est la librairie historique, qui contient encore les règles pour les
					salariées/salariés et employeurs/employeuses (dont Lodeom), les
					auto-entrepreneurs/auto-entrepreneuses, les bénéficiaires de
					dividendes, le calcul de l’impôt sur les sociétés et les coûts de
					création d’une entreprise. Elle est utilisée dans les autres
					simulateurs et assistants de mon-entreprise que ceux pour SAS(U) et
					travailleurs indépendants.
				</Body>

				<Message type="error" icon>
					Attention, bien qu’elles soient toujours présentes, les règles de
					cette librairie qui concernent les assimilés salariés et les
					travailleurs indépendants ne sont plus maintenues.
				</Message>

				<H2>Comment utiliser ces librairies ?</H2>

				<H3>Installation</H3>

				<pre>
					<Code>npm install --save publicodes modele-xx</Code>
				</pre>

				<SmallBody>
					Remplacez <Code>modele-xx</Code> par <Code>modele-as</Code>,
					<Code>modele-ti</Code> ou <Code>modele-social</Code> selon les calculs
					que vous souhaitez effectuer.
				</SmallBody>

				<Body>
					Pour lancer vos propres calculs, vous devez installer le paquet{' '}
					<Link
						href="https://www.npmjs.com/package/publicodes"
						aria-label={t(
							'pages.développeur.bibliothèque.aria-label.publicodes.npm',
							'publicodes, voir la page npm, nouvelle fenêtre'
						)}
					>
						<Code>publicodes</Code>
					</Link>{' '}
					contenant l'interpréteur publicodes, ainsi que le paquet de votre
					choix{' '}
					<Link
						href="https://www.npmjs.com/package/modele-as"
						aria-label={t(
							'pages.développeur.bibliothèque.aria-label.modele-as',
							'modele-as, voir la page npm, nouvelle fenêtre'
						)}
					>
						<Code>modele-as</Code>
					</Link>
					,{' '}
					<Link
						href="https://www.npmjs.com/package/modele-ti"
						aria-label={t(
							'pages.développeur.bibliothèque.aria-label.modele-ti',
							'modele-ti, voir la page npm, nouvelle fenêtre'
						)}
					>
						<Code>modele-ti</Code>
					</Link>{' '}
					ou{' '}
					<Link
						href="https://www.npmjs.com/package/modele-social"
						aria-label={t(
							'pages.développeur.bibliothèque.aria-label.modele-social',
							'modele-social, voir la page npm, nouvelle fenêtre'
						)}
					>
						<Code>modele-social</Code>
					</Link>
					, qui contiennent les règles des simulateurs de mon-entreprise.
				</Body>

				<Message icon>
					<H4>Qu’est-ce que publicodes ?</H4>
					<Body>
						Publicodes est un langage déclaratif développé par beta.gouv.fr et
						l’Urssaf pour encoder des algorithmes d'intérêt public. C’est le
						langage qui propulse les calculs de la plupart des simulateurs de
						mon-entreprise.
					</Body>
					<Body>
						<Link
							href="https://publi.codes"
							aria-label={t(
								'pages.développeur.bibliothèque.aria-label.publicodes.site',
								'En savoir plus sur publicodes, nouvelle fenêtre'
							)}
						>
							En savoir plus sur publicodes
						</Link>
					</Body>
				</Message>

				<H3>Utilisation</H3>

				<Body>
					Pour lancer le calcul, il vous faut paramétrer le moteur avec les
					règles du paquet <Code>modele-social</Code> et à appeler la fonction{' '}
					<Code>evaluate</Code> avec la règle dont vous souhaitez calculer la
					valeur. Voici un exemple pour le calcul brut / net avec le paquet{' '}
					<Code>modele-social</Code> :
				</Body>
				<div
					style={{
						textAlign: 'center',
					}}
				>
					<StyledExempleIframe
						src="https://codesandbox.io/embed/zen-keller-2dpct?fontsize=14&hidenavigation=1&theme=dark"
						title={t(
							'pages.développeur.bibliothèque.exemples.lancement',
							'Exemple d’intégration sur codesandbox.io : lancement d’un calcul'
						)}
					/>
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
						aria-label={t(
							'pages.développeur.bibliothèque.aria-label.documentation',
							'documentation en ligne, nouvelle fenêtre'
						)}
					>
						documentation en ligne
					</Link>
					. Cette documentation est auto-générée depuis les fichiers de règles
					publicodes, et alimentée par la simulation en cours.
				</Body>

				<H3>Comment reproduire le calcul d’un simulateur ?</H3>
				<Body>
					Pour répliquer le calcul d’un simulateur de mon-entreprise dans la
					bibliothèque, voici la marche à suivre :{' '}
				</Body>

				<ÉtapesPourReproduireUnCalcul mode="npm" />

				<Body>
					Voici ce que donne le calcul avec l'exemple cité ci-dessus :
				</Body>
				<div>
					<StyledExempleIframe
						src="https://codesandbox.io/embed/mon-entreprise-exemple-2-cev02?fontsize=14&hidenavigation=1&theme=dark"
						title={t(
							'pages.développeur.bibliothèque.exemples.paramétrage',
							'Exemple d’intégration sur codesandbox.io : paramétrage du calcul'
						)}
					/>
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
				<SmallBody $grey>
					On peut constater la progressivité du salaire total, qui est en
					pourcent plus faible pour un SMIC que pour un haut revenu. Autrement
					dit, les hauts salaires paient une partie des cotisations sociales des
					bas salaires.
				</SmallBody>
				<div
					style={{
						textAlign: 'center',
					}}
				>
					<StyledExempleIframe
						src="https://codesandbox.io/embed/mon-entreprise-exemple-3-4j11c?fontsize=14&hidenavigation=1&theme=dark"
						title={t(
							'pages.développeur.bibliothèque.exemples.association',
							'Exemple d’intégration sur codesandbox.io : association avec d’autres librairies'
						)}
					/>
				</div>
			</Trans>
		</div>
	)
}
