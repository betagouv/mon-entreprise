import { ScrollToTop } from 'Components/utils/Scroll'
import Emoji from 'Components/utils/Emoji'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'

export default function Library() {
	return (
		<div css="iframe{margin-top: 1em; margin-bottom: 1em}">
			<ScrollToTop />
			<Trans i18nKey="pages.dévelopeurs.bibliothèque">
				<h1>Intégrez notre bibliothèque de calcul</h1>
				<p>
					Si vous pensez que votre site ou service gagnerait à afficher des
					calculs de salaire, par exemple passer du salaire brut au salaire net,
					bonne nouvelle : tous les calculs de cotisations et impôts qui sont
					derrière mon-entreprise.fr sont libres et facilement réutilisable
					grâce à la{' '}
					<a href="https://www.npmjs.com/package/publicodes">
						bibliothèque NPM publicodes
					</a>
					.
				</p>
				<h2>Comment utiliser cette librairie ?</h2>
				<p>
					Toutes nos règles de calculs sont écrites en `publicodes`, un language
					déclaratif développé par beta.gouv.fr et l'Urssaf pour encoder des
					algorithme d'intérêt public.{' '}
					<a href="https://publi.codes">En savoir plus sur publicodes</a>
				</p>
				<p>
					Pour effectuer vos propre calculs, vous devons donc installer
					l'interpréteur publicodes, télécharger les règles utilisées sur
					mon-entreprise, appeler la fonction d'évaluation.
				</p>
				<h3>Installation</h3>
				<pre>
					<code>npm install --save publicodes systeme-social</code>
				</pre>
				<p>
					<Emoji emoji="🚧" /> Les dépendances suivantes sont aussi nécessaires
					pour le moment, mais seront rendues facultatives dans une prochaine
					version du paquet publicodes.
				</p>
				<pre>
					<code>
						npm install --save react react-router-dom react-router-hash-link
					</code>
				</pre>
				<em>
					Pour plus de détails sur l'installation, se référer à la{' '}
					<a href="https://publi.codes/api#installation" target="_blank">
						documentation dédiée
					</a>
				</em>
				<h3>Lancer le calcul</h3>
				<p>
					Il ne vous reste plus qu'à paramétrer le moteur avec les règles du
					paquet `systeme-social` et à appeler la fonction `evaluate` sur la
					règle que dont vous souhaitez la valeur. Voici un exemple pour le
					calcul brut / net
				</p>
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
				<h2>Paramétrer le calcul</h2>
				<p>
					Vous l'aurez constaté dans l'exemple précédent, la recette d'un calcul
					est simple : des variables d'entrée (le salaire brut), une ou
					plusieurs variables de sorties (le salaire net).
				</p>
				<p>
					Le calcul est cependant paramétrable avec toutes les possibilités
					permise dans la legislation.
				</p>
				<p>
					Toutes ces variables sont listées et expliquées sur la{' '}
					<a target="_blank" href="/documentation">
						documentation en ligne
					</a>
					. Cette documentation est auto-générée depuis les fichiers de règles
					publicodes, elle est donc constamment à jour.
				</p>
				<p>
					Lançons un calcul plus proche d'une fiche de paie : voici une
					description de la situation d'entrée annotée de liens vers les pages
					correspondantes de la documentation :
				</p>
				<blockquote>
					<p>
						{' '}
						Un{' '}
						<a href="https://mon-entreprise.fr/documentation/contrat-salarié/statut-cadre/choix-statut-cadre">
							cadre
						</a>{' '}
						gagnant{' '}
						<a href="https://mon-entreprise.fr/documentation/contrat-salarié/rémunération/brut-de-base">
							3 400€ bruts
						</a>{' '}
						, qui bénéficie de{' '}
						<a href="https://mon-entreprise.fr/documentation/contrat-salari%C3%A9/frais-professionnels/titres%E2%80%91restaurant">
							titres-restaurant
						</a>{' '}
						et qui travaille dans une entreprise de{' '}
						<a href="https://mon-entreprise.fr/documentation/entreprise/effectif">
							22 salariés
						</a>
						.
					</p>
				</blockquote>
				<p>Voici ce que donne le calcul pour cet exemple plus complet :</p>
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
				<p>
					<Emoji emoji="ℹ️ " />
					Notez que dans l'exemple précédent nous devons spécifier nous-même le
					taux de versement transport.
				</p>
				<p>
					Alors que dans le simulateur{' '}
					<a href="https://mon-entreprise.fr/simulateurs/salarié">salarié</a>,
					il suffit de renseigner la commune et le taux correspondant est
					automatiquement déterminé. C'est voulu : pour garder la bibliothèque
					(et le site) légers, nous utilisons deux API en ligne. L'
					<a href="https://api.gouv.fr/api/api-geo.html#doc_tech">
						API Géo - communes
					</a>{' '}
					pour passer du nom de la commune au code commune. Puis l'
					<a href="">API versement transport</a>, développé et maintenu par nos
					soins, qui n'est pas documenté mais son utilisation est très simple et
					compréhensible{' '}
					<a href="https://github.com/betagouv/mon-entreprise/blob/f3e79f42516c0822e8c6d8f6e9fc5646c82fd018/source/components/conversation/select/SelectGéo.js#L7-L14">
						dans ce composant React qui l'appelle
					</a>
					, composant qui fait aussi appel à l'API commune.
				</p>
				<h2>Faire des graphiques économiques{emoji(' 📈')}</h2>
				<p>
					Il est aussi possible d'utiliser la bibliothèque pour des calculs
					d'analyse économique ou politique. Ici, on trace le prix du travail et
					le salaire net en fonction du brut.
				</p>
				<p css="font-style: italic; border-left: 6px solid #eee; padding-left: .6rem">
					On peut constater la progressivité du salaire total, qui est en
					pourcent plus faible pour un SMIC que pour un haut revenu. Autrement
					dit, les hauts salaires paient une partie des cotisations sociales des
					bas salaires.
				</p>
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
