import { useEconomieCollaborative } from '@/contextes/economie-collaborative'
import {
	ABATTEMENT_REGIME_GENERAL,
	PLAFOND_REGIME_GENERAL,
} from '@/contextes/economie-collaborative'
import {
	Attention,
	Conseil,
	ExemplePratique,
	Info,
	Tableau,
	Valeur,
} from '@/design-system'
import { eurosParAn, montantToString } from '@/domaine/Montant'

export const metadata = {
	title: 'Le régime micro-BIC',
	description: 'Comprenez le régime fiscal simplifié pour les petits loueurs en meublé.',
}

export const TableauSeuilsDynamique = () => (
	<Tableau>
		<thead>
			<tr>
				<th>Type de location</th>
				<th>Plafond annuel</th>
				<th>Abattement forfaitaire</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Location meublée classique</td>
				<td>
					<Valeur couleur="primary">{montantToString(PLAFOND_REGIME_GENERAL)}</Valeur>
				</td>
				<td>
					<strong>{ABATTEMENT_REGIME_GENERAL * 100}%</strong>
				</td>
			</tr>
			<tr>
				<td>Location meublée de tourisme classée</td>
				<td>
					<Valeur couleur="primary"></Valeur>
				</td>
				<td>
					<strong>0%</strong>
				</td>
			</tr>
		</tbody>
	</Tableau>
)

export const ExempleCalculDynamique = () => {
	const { situation } = useEconomieCollaborative()
	const recettesExemple = eurosParAn(20_000)
	const abattement = ABATTEMENT_REGIME_GENERAL
	const montantAbattement = eurosParAn(20_000 * abattement)
	const baseImposable = eurosParAn(20_000 * (1 - abattement))

	return (
		<ExemplePratique>
			Pour des recettes de {montantToString(recettesExemple)} en location classique :
			<ul>
				<li>
					Abattement de {abattement * 100}% : <strong>{montantToString(montantAbattement)}</strong>
				</li>
				<li>
					Base imposable : <strong>{montantToString(baseImposable)}</strong>
				</li>
			</ul>
		</ExemplePratique>
	)
}

const MicroBicDocumentation = () => (
	<>
		<h1>Le régime micro-BIC</h1>

		<p>
			Le régime micro-BIC (Bénéfices Industriels et Commerciaux) est un régime fiscal simplifié pour les loueurs en meublé dont les recettes ne dépassent pas certains plafonds.
		</p>

		<h2>Plafonds de recettes</h2>

		<TableauSeuilsDynamique />

		<Attention>
			Au-delà de ces plafonds, vous basculez automatiquement au régime réel d'imposition.
		</Attention>

		<h2>Avantages du régime</h2>

		<ul>
			<li><strong>Simplicité</strong> : Pas de comptabilité complexe à tenir</li>
			<li><strong>Déclaration simplifiée</strong> : Une simple declaration de recettes suffit</li>
			<li><strong>Abattement automatique</strong> : Les charges sont déduites forfaitairement</li>
		</ul>

		<ExempleCalculDynamique />

		<h2>Obligations comptables</h2>

		<ul>
			<li>Tenir un livre de recettes</li>
			<li>Conserver les justificatifs pendant 6 ans</li>
			<li>Déclarer les recettes brutes annuelles</li>
		</ul>

		<Conseil>
			Utilisez un logiciel de gestion locative ou un simple tableur pour suivre vos recettes tout au long de l'année.
		</Conseil>

		<h2>Passage au régime réel</h2>

		<p>Le passage au régime réel est :</p>

		<h3>Obligatoire si :</h3>
		<ul>
			<li>Dépassement des plafonds de recettes</li>
			<li>Activité exercée dans le cadre d'une société</li>
		</ul>

		<h3>Optionnel si :</h3>
		<ul>
			<li>Vos charges réelles dépassent l’abattement forfaitaire</li>
			<li>Vous souhaitez reporter un déficit</li>
			<li>Vous voulez récupérer la TVA sur les travaux</li>
		</ul>

		<Info>
			L'option pour le régime réel est valable 2 ans minimum et se reconduit tacitement par période de 2 ans.
		</Info>
	</>
)

export default MicroBicDocumentation
