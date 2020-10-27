import { ScrollToTop } from 'Components/utils/Scroll'
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
					Toutes nos règles de calculs sont écrite en `publicodes`, un language
					déclaratif développé par beta.gouv.fr et l'Urssaf pour encoder des
					algorithme d'intérêt public.{' '}
					<a href="https://publi.codes">En savoir plus sur publicodes</a>
				</p>
				<p>
					Pour effectuer vos propre calcul, il suffit donc d'installer
					l'interpreteur publicode, de télécharger les règles de mon-entreprise,
					et d'appeler la fonction d'évaluation.
				</p>
				<h3>1) Installer publicodes</h3>
				<pre>
					<code>
						npm install --save publicodes react react-router-dom
						react-router-hash-link
					</code>
				</pre>
				<em>
					Pour plus de détails sur l'installation, se référer à la{' '}
					<a href="https://publi.codes/api#installation" target="_blank">
						documentation dédiée
					</a>
				</em>
				<h3>2) Télécharger les règles mon-entreprise</h3>
				<p>
					Les règles de calculs de mon-entreprise ne sont pas (encore)
					disponible sous forme de paquet npm. Il faudra donc les télécharger
					manuellement.
				</p>
				<a href="https://github.com/betagouv/mon-entreprise/tree/master/mon-entreprise/source/rules">
					Voir les fichiers de règles publicodes de mon-entreprise
				</a>
				<p>
					Pour le faire rapidement, vous pouvez copier coller la commande
					suivante :
				</p>
				<blockquote>
					<code>
						wget
						https://raw.githubusercontent.com/betagouv/mon-entreprise/master/mon-entreprise/source/rules/base.yaml
						& wget
						https://raw.githubusercontent.com/betagouv/mon-entreprise/master/mon-entreprise/source/rules/dirigeant.yaml
						& wget
						https://raw.githubusercontent.com/betagouv/mon-entreprise/master/mon-entreprise/source/rules/salarié.yaml
						& wget
						https://raw.githubusercontent.com/betagouv/mon-entreprise/master/mon-entreprise/source/rules/protection-sociale.yaml
						& wget
						https://raw.githubusercontent.com/betagouv/mon-entreprise/master/mon-entreprise/source/rules/entreprise-établissement.yaml
						& wget
						https://raw.githubusercontent.com/betagouv/mon-entreprise/master/mon-entreprise/source/rules/impôt.yaml
						& wget
						https://raw.githubusercontent.com/betagouv/mon-entreprise/master/mon-entreprise/source/rules/situation-personnelle.yaml
					</code>
				</blockquote>
				<p>
					<strong>Attention</strong> : bien que les règles soient décomposées en
					fichier séparé, les dépendances ne sont pas encore bien gérées avec
					publicode. Il vous faudra donc veiller à bien télécharger et importer
					les fichiers "socles" pour être sûr de ne pas avoir de dépendances non
					satisfaite.
				</p>
				<h3>3) Lancer le calcul</h3>
				<p>
					Il ne vous reste plus qu'à paramètrer le moteur avec les règles
					téléchargées et à appeler la fonction `evaluate` sur la règle que dont
					vous souhaitez la valeur. Voici un exemple pour le calcul brut / net
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
					publicode, elle est donc constament à jour.
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
					{emoji('ℹ️ ')}
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
