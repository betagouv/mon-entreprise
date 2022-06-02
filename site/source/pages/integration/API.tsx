import Emoji from '@/components/utils/Emoji'
import { ScrollToTop } from '@/components/utils/Scroll'
import { H1, H2, H3 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { Trans } from 'react-i18next'

const js = `
async function salaireNetEnBrutMensuel(net) {
  const body = {
    situation: {
      "contrat salarié . rémunération . net": net + " €",
    },
    expressions: [
      "contrat salarié . rémunération . brut de base",
      "contrat salarié . prix du travail",
    ],
  };

  const response = await fetch(
    "https://2138--mon-entreprise.netlify.app/api/v1/evaluate",
    {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  console.log(response);

  const json = await response.json();

  console.log(response.status);
  console.log(json);

  return json.evaluate.map(({ nodeValue }) => nodeValue);
}

const [brut, superBrut] = await salaireNetEnBrutMensuel(3500);

console.log(brut, superBrut);
`

export default function API() {
	return (
		<div css="iframe{margin-top: 1em; margin-bottom: 1em}">
			<ScrollToTop />
			<Trans i18nKey="pages.dévelopeurs.api">
				<H1>Utiliser notre API REST</H1>
				<Body>
					Si votre site ou service requiert de faire des calculs de salaire, par
					exemple passer du salaire brut au salaire net, bonne nouvelle : tous
					les calculs de cotisations et impôts qui sont derrière mon-entreprise
					sont libres et utilisé via notre{' '}
					<Link href="/api/v1/doc/">API REST</Link>.
					<Link href="https://docs.google.com/spreadsheets/d/1wbfxRdmEbUBgsXbGVc0Q6uqAV4IfLvux6oUJXJLhlaU/edit?usp=sharing">
						Google Sheets
					</Link>
				</Body>
				<H2>Comment utiliser cette API ?</H2>

				<Body>
					Toutes nos règles de calculs sont écrites en `publicodes`, un language
					déclaratif développé par beta.gouv.fr et l'Urssaf pour encoder des
					algorithmes d'intérêt public.{' '}
					<Link href="https://publi.codes">En savoir plus sur publicodes</Link>
				</Body>

				<Body></Body>
				{/* <H3>Installation</H3> */}
				<pre>
					<code>{js}</code>
				</pre>

				<div
					className="ui__ full-width"
					css={`
						text-align: center;
					`}
				>
					<iframe
						css="width:100%; max-width: 1200px; height:500px; border:0; border-radius: 4px; overflow:hidden;"
						src="https://stackblitz.com/edit/vitejs-vite-hgagfj?ctl=1&embed=1&file=main.js"
					></iframe>
				</div>

				<H3>Lancer le calcul</H3>
				<Body>
					Il ne vous reste plus qu'à paramétrer le moteur avec les règles du
					paquet `modele-social` et à appeler la fonction `evaluate` sur la
					règle que dont vous souhaitez la valeur. Voici un exemple pour le
					calcul brut / net
				</Body>
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
			</Trans>
		</div>
	)
}
