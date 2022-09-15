import PageHeader from '@/components/PageHeader'
import Emoji from '@/components/utils/Emoji'
import { ScrollToTop } from '@/components/utils/Scroll'
import { Message } from '@/design-system'
import { Strong } from '@/design-system/typography'
import { H2, H3, H4 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ol } from '@/design-system/typography/list'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { useSitePaths } from '@/sitePaths'
import { Trans } from 'react-i18next'
import illustration from './illustration_library.svg'

export default function Library() {
	return (
		<div css="iframe{margin-top: 1em; margin-bottom: 1em}">
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
					<code>npm install --save publicodes modele-social</code>
				</pre>
				<Message icon>
					<H4>Que signifie publicodes ?</H4>
					<Body>
						Publicodes est un language déclaratif développé par beta.gouv.fr et
						l'Urssaf pour encoder des algorithmes d'intérêt public.{' '}
						<Link href="https://publi.codes">
							En savoir plus sur publicodes
						</Link>
					</Body>
					<Body>
						Pour lancer vos propre calculs, vous devons donc installer le paquet{' '}
						<Link href="https://www.npmjs.com/package/publicodes">
							<code>publicodes</code>
						</Link>{' '}
						contenant l'intepreteur, ainsi que le paquet{' '}
						<Link href="https://www.npmjs.com/package/modele-social">
							<code>modele-social</code>
						</Link>
						, qui contient les règles des simulateurs mon-entreprise.
					</Body>
				</Message>
				<H3>Lancer le calcul</H3>
				<Body>
					Il ne vous reste plus qu'à paramétrer le moteur avec les règles du
					paquet `modele-social` et à appeler la fonction `evaluate` sur la
					règle que dont vous souhaitez la valeur. Voici un exemple pour le
					calcul brut / net
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
						title="mon-entreprise (exemple 1)"
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
					<Link target="_blank" rel="noreferrer" href="/documentation">
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
					<Li>
						<Strong>
							Choisir le simulateur en fonction du calcul qui nous intéresse
						</Strong>
						<br />
						Par exemple le{' '}
						<Link to={useSitePaths().absoluteSitePaths.simulateurs.salarié}>
							simulateur salarié
						</Link>{' '}
						pour calculer un net à partir du brut.
					</Li>
					<Li>
						<Strong>
							Effectuer une simulation avec les données que l'on souhaite
							réutiliser
						</Strong>
						<br />
						Par exemple{' '}
						<Link
							to={{
								pathname: useSitePaths().absoluteSitePaths.simulateurs.salarié,
								search:
									'salaire-brut=3400%E2%82%AC%2Fmois&salari%C3%A9+.+contrat=%27CDI%27&salari%C3%A9+.+contrat+.+statut+cadre=oui&salari%C3%A9+.+r%C3%A9mun%C3%A9ration+.+frais+professionnels+.+titres-restaurant=oui',
							}}
						>
							un cadre à 3400 € brut avec des titres-restaurants
						</Link>
						.
					</Li>
					<Li>
						<Strong>
							Aller sur la page de documentation de la donnée à calculer
						</Strong>
						<br />
						Par exemple en cliquant sur « Salaire net » dans le simulateur, ou
						en recherchant « Salaire net » dans la recherche en haut à droite.
					</Li>
					<Li>
						<Strong>
							Copiez l'extrait de code personalisé et intégrez-le dans votre
							application
						</Strong>
						<br />
						Vous le trouverez en cliquant sur la section « Réutiliser ce calcul
						».
						<br />
					</Li>
					<Li>
						<Strong>
							(facultatif) Modifiez les valeur de la situation pour paramétrer
							le calcul selon vos besoin
						</Strong>
						<br /> Vous pouvez modifier sans hésiter les valeurs de la
						situation. Ces dernières acceptent n'importe quelle{' '}
						<Link href="https://publi.codes/docs/principes-de-base">
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
						title="mon-entreprise (exemple 2)"
					></iframe>
				</div>
				<Message type="info" icon>
					<Body>
						La situation contient les données de votre simulation (cadre avec
						salaire à 3400 € brut), mais également les données relative au
						paramétrage du simulateur.
					</Body>
				</Message>
				<H4>Cas particulier : le taux versement mobilité</H4>

				<Body>
					Alors que dans le simulateur{' '}
					<Link href="https://mon-entreprise.urssaf.fr/simulateurs/salaire-brut-net">
						salarié
					</Link>
					, il suffit de renseigner la commune et le taux correspondant est
					automatiquement déterminé. Ce comportement n'est pas présent dans la
					librairie. C'est voulu : pour garder la bibliothèque (et le site)
					légers, nous utilisons deux API en ligne. L'
					<Link href="https://api.gouv.fr/api/api-geo.html#doc_tech">
						API Géo - communes
					</Link>{' '}
					pour passer du nom de la commune au code commune. Puis l'
					<Link href="">API versement mobilité</Link>, développé et maintenu par
					nos soins, qui n'est pas documenté mais son utilisation est très
					simple et compréhensible{' '}
					<Link href="https://github.com/betagouv/mon-entreprise/blob/f3e79f42516c0822e8c6d8f6e9fc5646c82fd018/source/components/conversation/select/SelectGéo.js#L7-L14">
						dans ce composant React qui l'appelle
					</Link>
					, composant qui fait aussi appel à l'API commune.
				</Body>

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
						title="mon-entreprise (exemple 3)"
					></iframe>
				</div>
			</Trans>
		</div>
	)
}
