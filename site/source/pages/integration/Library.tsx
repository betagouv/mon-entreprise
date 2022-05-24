import Emoji from '@/components/utils/Emoji'
import { ScrollToTop } from '@/components/utils/Scroll'
import { H1, H2, H3 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { Trans } from 'react-i18next'

export default function Library() {
	return (
		<div css="iframe{margin-top: 1em; margin-bottom: 1em}">
			<ScrollToTop />
			<Trans i18nKey="pages.développeur.bibliothèque">
				<H1>Intégrez notre bibliothèque de calcul</H1>
				<Body>
					Si vous pensez que votre site ou service gagnerait à afficher des
					calculs de salaire, par exemple passer du salaire brut au salaire net,
					bonne nouvelle : tous les calculs de cotisations et impôts qui sont
					derrière mon-entreprise sont libres et facilement réutilisable grâce à
					la{' '}
					<Link href="https://www.npmjs.com/package/publicodes">
						bibliothèque NPM publicodes
					</Link>
					.
				</Body>
				<H2>Comment utiliser cette librairie ?</H2>
				<Body>
					Toutes nos règles de calculs sont écrites en `publicodes`, un language
					déclaratif développé par beta.gouv.fr et l'Urssaf pour encoder des
					algorithmes d'intérêt public.{' '}
					<Link href="https://publi.codes">En savoir plus sur publicodes</Link>
				</Body>
				<Body>
					Pour effectuer vos propre calculs, vous devons donc installer
					l'interpréteur publicodes, télécharger les règles utilisées sur
					mon-entreprise, appeler la fonction d'évaluation.
				</Body>
				<H3>Installation</H3>
				<pre>
					<code>npm install --save publicodes modele-social</code>
				</pre>
				<em>
					Pour plus de détails sur l'installation, se référer à la{' '}
					<Link href="https://publi.codes" target="_blank" rel="noreferrer">
						documentation dédiée
					</Link>
				</em>
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
					permise dans la legislation.
				</Body>
				<Body>
					Toutes ces variables sont listées et expliquées sur la{' '}
					<Link target="_blank" rel="noreferrer" href="/documentation">
						documentation en ligne
					</Link>
					. Cette documentation est auto-générée depuis les fichiers de règles
					publicodes, elle est donc constamment à jour.
				</Body>
				<Body>
					Lançons un calcul plus proche d'une fiche de paie : voici une
					description de la situation d'entrée annotée de liens vers les pages
					correspondantes de la documentation :
				</Body>
				<blockquote>
					<Body>
						{' '}
						Un{' '}
						<Link href="https://mon-entreprise.urssaf.fr/documentation/contrat-salarié/statut-cadre/choix-statut-cadre">
							cadre
						</Link>{' '}
						gagnant{' '}
						<Link href="https://mon-entreprise.urssaf.fr/documentation/contrat-salarié/rémunération/brut-de-base">
							3 400€ bruts
						</Link>{' '}
						, qui bénéficie de{' '}
						<Link href="https://mon-entreprise.urssaf.fr/documentation/contrat-salari%C3%A9/frais-professionnels/titres%E2%80%91restaurant">
							titres-restaurant
						</Link>{' '}
						et qui travaille dans une entreprise de{' '}
						<Link href="https://mon-entreprise.urssaf.fr/documentation/entreprise/effectif">
							22 salariés
						</Link>
						.
					</Body>
				</blockquote>
				<Body>
					Voici ce que donne le calcul pour cet exemple plus complet :
				</Body>
				<div
					className="ui__ full-width"
					css={`
						text-align: center;
					`}
				>
					<iframe
						src="https://codesandbox.io/embed/mon-entreprise-exemple-2-cev02?fontsize=14&hidenavigation=1&theme=dark"
						css="width:100%; max-width: 1200px; height:500px; border:0; border-radius: 4px; overflow:hidden;"
						title="mon-entreprise (exemple 2)"
					></iframe>
				</div>
				<Body>
					<Emoji emoji="ℹ️ " />
					Notez que dans l'exemple précédent nous devons spécifier nous-même le
					taux de versement mobilité.
				</Body>
				<Body>
					Alors que dans le simulateur{' '}
					<Link href="https://mon-entreprise.urssaf.fr/simulateurs/salaire-brut-net">
						salarié
					</Link>
					, il suffit de renseigner la commune et le taux correspondant est
					automatiquement déterminé. C'est voulu : pour garder la bibliothèque
					(et le site) légers, nous utilisons deux API en ligne. L'
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
