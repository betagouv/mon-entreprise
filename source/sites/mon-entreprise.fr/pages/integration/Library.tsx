import { ScrollToTop } from 'Components/utils/Scroll'
import React from 'react'
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
					derrière mon-entreprise.fr sont libres et{' '}
					<b>
						intégrables sous forme d'une{' '}
						<a href="https://www.npmjs.com/package/mon-entreprise">
							bibliothèque NPM
						</a>
					</b>
					.
				</p>
				<p>
					Dit plus simplement, les développeurs de votre équipe sont en mesure
					d'intégrer le calcul dans votre interface en 5 minutes
					{emoji('⌚')}, sans avoir à gérer la complexité de la paie et la mise
					à jour régulière des règles de calcul.
				</p>
				<p>
					Cette bibliothèque est un commun numérique développé par l'Etat et
					l'ACOSS. Elle repose sur un nouveau langage de programmation,{' '}
					<a href="https://publi.codes">publicodes</a>.
				</p>
				<h2>Comment l'utiliser ?</h2>
				<p>
					Les exemples suivants vous montrent comment utiliser la bibliothèque
					sur un site ReactJs très simple.
				</p>
				<h3>1) Faire un calcul très simple : du brut au net</h3>
				<div className="ui__ full-width">
					<iframe
						src="https://codesandbox.io/embed/damp-bird-0m8gl?fontsize=14&hidenavigation=1"
						title="mon-entreprise 1"
						allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
						css="width: 80%; margin-left: 10%; height: 600px; border:0; border-radius: 4px; overflow:hidden;"
						sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
					></iframe>
				</div>
				<h3>2) Parcourir la documentation en ligne</h3>
				<p>
					Vous l'aurez constaté dans l'exemple précédent, la recette d'un calcul
					est simple : des variables d'entrée (le salaire brut), une ou
					plusieurs variables de sorties (le salaire net).
				</p>
				<p>
					Toutes ces variables sont listées et expliquées sur notre{' '}
					<a target="_blank" href="/documentation">
						documentation en ligne
					</a>
					.
				</p>

				<p>
					Utilisez le moteur de recherche pour trouver la bonne variable, puis
					cliquez sur "Voir le code source" pour obtenir l'ensemble de la
					documentation : valeur par défaut, valeurs possibles quand c'est une
					énumération de choix, unité quand c'est un nombre, description,
					question utilisateur associée, etc.
				</p>
				<p>
					Lançons un calcul plus proche d'une fiche de paie : voici une
					description de la situation d'entrée annotée de liens vers les pages
					correspondantes de la documentation :
				</p>

				<p css="background: #eee">
					{' '}
					Un{' '}
					<a href="https://mon-entreprise.fr/documentation/contrat-salarié/statut-cadre/choix-statut-cadre">
						cadre
					</a>{' '}
					gagnant{' '}
					<a href="https://mon-entreprise.fr/documentation/contrat-salarié/rémunération/brut-de-base">
						3 400€ bruts
					</a>{' '}
					, qui bénéficie de l'
					<a href="https://mon-entreprise.fr/documentation/contrat-salarié/indemnité-kilométrique-vélo/active">
						indemnité kilométrique vélo
					</a>{' '}
					et qui travaille dans une entreprise de{' '}
					<a href="https://mon-entreprise.fr/documentation/entreprise/effectif">
						12 salariés
					</a>
					.
				</p>
				<p>Voici ce que donne le calcul pour cet exemple plus complet :</p>
				<div className="ui__ full-width">
					<iframe
						src="https://codesandbox.io/embed/mon-entreprise-2-60d6d?fontsize=14&hidenavigation=1"
						title="mon-entreprise 2"
						allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
						css="width: 80%; margin-left: 10%; height: 600px; border:0; border-radius: 4px; overflow:hidden;"
						sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
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
				<p>
					{emoji('⚠️ ')}Attention, cet exemple fait pas mal de calculs d'un
					coup, ce qui peut bloquer votre navigateur quelques secondes. Pour
					palier à ce problème, il faudrait faire l'appel à la bibliothèque dans
					un Web Worker, mais ça n'est pas possible{' '}
					<a href="https://github.com/facebook/create-react-app/pull/5886">
						pour l'instant
					</a>{' '}
					dans ces démos.
				</p>
				<div className="ui__ full-width">
					<iframe
						src="https://codesandbox.io/embed/mon-entreprise-3-248rg?fontsize=14&hidenavigation=1"
						title="mon-entreprise 2"
						allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
						css="width: 80%; margin-left: 10%; height: 600px; border:0; border-radius: 4px; overflow:hidden;"
						sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
					></iframe>
				</div>
			</Trans>
		</div>
	)
}
