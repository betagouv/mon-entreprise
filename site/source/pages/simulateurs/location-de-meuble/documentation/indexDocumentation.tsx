import * as O from 'effect/Option'
import { Conseil, Info, Tableau, Valeur, ValeurImportante } from '@/design-system'
import { montantToString } from '@/domaine/Montant'
import { useEconomieCollaborative } from '@/contextes/economie-collaborative'
import { SEUIL_PROFESSIONNALISATION } from '@/contextes/economie-collaborative'

export const metadata = {
	title: "Location meublée : vue d'ensemble",
	description: 'Comprendre les régimes fiscaux et sociaux de la location meublée',
}

export const RecettesDéclaréesS = () => {
	const { situation } = useEconomieCollaborative()

	if (O.isSome(situation.recettes)) {
		return (
			<div>
				Vous avez indiqué <ValeurImportante>{montantToString(situation.recettes.value)}</ValeurImportante> de recettes.
			</div>
		)
	}

	return <div>Remplissez le simulateur pour plus d’information</div>
}

const IndexDocumentation = () => (
	<>
		<h1>Location meublée : vue d'ensemble</h1>

		<p>
			La <strong>location meublée</strong> est soumise à des régimes fiscaux et sociaux spécifiques qui dépendent principalement du montant de vos recettes annuelles.
		</p>

		<h2>Principe général</h2>

		<p>En tant que loueur en meublé, vous devez :</p>
		<ul>
			<li><strong>Déclarer vos recettes</strong> issues de la location</li>
			<li><strong>Choisir un régime fiscal</strong> (micro-BIC ou régime réel)</li>
			<li><strong>Cotiser au régime social</strong> adapté à votre situation : <Valeur>{montantToString(SEUIL_PROFESSIONNALISATION.MEUBLÉ)}</Valeur></li>
		</ul>

		<RecettesDéclaréesS />

		<h2>Seuils importants</h2>

		<Tableau>
			<thead>
				<tr>
					<th>Montant des recettes</th>
					<th>Régime social</th>
					<th>Particularités</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Moins de <Valeur couleur="primary">{montantToString(SEUIL_PROFESSIONNALISATION.MEUBLÉ)}</Valeur></td>
					<td>Pas de cotisations obligatoires</td>
					<td>Revenus considérés comme patrimoniaux</td>
				</tr>
				<tr>
					<td>Plus de <Valeur couleur="primary">{montantToString(SEUIL_PROFESSIONNALISATION.MEUBLÉ)}</Valeur></td>
					<td>Régime général ou micro-social</td>
					<td>Activité professionnelle</td>
				</tr>
			</tbody>
		</Tableau>

		<Info>
			La fiscalité suit ses propres seuils avec des plafonds différents selon le type de location (classique ou tourisme classé).
		</Info>

		<Conseil>
			Consultez les différentes sections ci-dessous pour comprendre en détail chaque régime et optimiser votre situation.
		</Conseil>
	</>
)

export default IndexDocumentation
