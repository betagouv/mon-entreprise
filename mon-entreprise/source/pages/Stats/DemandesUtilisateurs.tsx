import { FromTop } from 'Components/ui/animate'
import { useState } from 'react'
import stats from '../../data/stats.json'

export default function DemandeUtilisateurs() {
	const [extendedView, setExtendedView] = useState(false)
	return (
		<section>
			<h2 id="demandes-utilisateurs">Demandes utilisateurs</h2>
			<p>
				<small>
					Demandes formulées en utilisant le bouton "faire une suggestion"
					présent sur toutes les pages
				</small>
			</p>
			<h3>En attente d'implémentation</h3>
			<ul>
				{stats.retoursUtilisateurs.open
					.slice(0, !extendedView ? 10 : undefined)
					.map(Issue)}
			</ul>
			<div css={{ textAlign: 'center' }}>
				<button
					className="ui__ small button"
					onClick={() => setExtendedView(!extendedView)}
				>
					{extendedView ? 'Replier' : 'Voir plus'}
				</button>
			</div>
			<h3>Réalisées</h3>
			<ul style={{ opacity: 0.8 }}>
				{stats.retoursUtilisateurs.closed.map(Issue)}
			</ul>
		</section>
	)
}

function Issue({
	title,
	number,
	count,
	closedAt,
}: {
	title: string
	number: number
	count: number
	closedAt: string | null
}) {
	return (
		<FromTop>
			<li>
				{count > 1 && (
					<span className="ui__ small label">{count} demandes</span>
				)}{' '}
				<a href={`https://github.com/betagouv/mon-entreprise/issues/${number}`}>
					{title}
				</a>{' '}
				{closedAt && (
					<small>(Résolu en {formatMonth(new Date(closedAt))})</small>
				)}
			</li>
		</FromTop>
	)
}

function formatMonth(date: string | Date) {
	return new Date(date).toLocaleString('default', {
		month: 'long',
		year: 'numeric',
	})
}
