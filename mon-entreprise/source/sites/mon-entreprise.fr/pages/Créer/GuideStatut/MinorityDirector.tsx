import { directorIsInAMinority } from 'Actions/companyStatusActions'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

export default function MinorityDirector() {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	return (
		<>
			<Helmet>
				<title>
					{t(
						'gérant minoritaire.page.titre',
						'Gérant majoritaire ou minoritaire'
					)}{' '}
				</title>
				<meta
					name="description"
					content={t(
						'gérant minoritaire.page.description',
						"Certaines règles particulières s'appliquent en fonction du nombre d'actions détenues par l'administrateur, ce qui peut conduire à un statut différent lors de la création de votre société"
					)}
				/>
			</Helmet>
			<h2>
				<Trans i18nKey="gérant minoritaire.titre">
					Gérant majoritaire ou minoritaire
				</Trans>{' '}
			</h2>
			<Trans i18nKey="gérant minoritaire.description">
				<p>
					Certaines règles spéciales s'appliquent selon le nombre d'actions
					détenues.
				</p>
				<ul>
					<li>
						<strong>Gérant majoritaire</strong> : Vous êtes l'administrateur
						majoritaire (ou faite partie d'un conseil d'administration
						majoritaire).
					</li>
					<li>
						<strong>Gérant minoritaire</strong> : Vous êtes administrateur
						minoritaire ou égalitaire (ou faites partie d'un conseil
						d'administration minoritaire ou égalitaire).
					</li>
				</ul>
			</Trans>

			<div className="ui__ answer-group">
				<button
					onClick={() => {
						dispatch(directorIsInAMinority(false))
					}}
					className="ui__ button"
				>
					<Trans>Gérant majoritaire</Trans>
				</button>
				<button
					onClick={() => {
						dispatch(directorIsInAMinority(true))
					}}
					className="ui__ button"
				>
					<Trans>Gérant minoritaire</Trans>
				</button>
			</div>
		</>
	)
}
