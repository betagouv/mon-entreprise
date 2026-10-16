import { Trans, useTranslation } from 'react-i18next'

import { Body, Code, H2, H3, Li, Strong, Ul } from '@/design-system'
import { useBarèmeLodeom } from '@/hooks/useBarèmeLodeom'
import { useZoneLodeom } from '@/hooks/useZoneLodeom'
import { useEngine } from '@/utils/publicodes/EngineContext'

export const DocumentationLodeom = () => {
	const { t } = useTranslation()
	const engine = useEngine()
	const zone = useZoneLodeom()
	const barème = useBarèmeLodeom()

	const seuilInflexionBrut = engine.evaluate(
		'salarié . cotisations . exonérations . lodeom . montant . seuil inflexion'
	).nodeValue

	const seuilIntermediaireBrut = engine.evaluate(
		'salarié . cotisations . exonérations . lodeom . montant . seuil intermédiaire'
	).nodeValue

	const seuilSortieBrut = engine.evaluate(
		'salarié . cotisations . exonérations . lodeom . montant . seuil sortie'
	).nodeValue

	if (
		!zone ||
		!barème ||
		typeof seuilInflexionBrut !== 'number' ||
		typeof seuilSortieBrut !== 'number'
	) {
		return null
	}

	const hasSeuilIntermediaire = typeof seuilIntermediaireBrut === 'number'

	const effectifMoinsDe50 =
		(engine.evaluate('entreprise . salariés . effectif').nodeValue as number) <
		50

	const valeursT = (() => {
		if (zone === 'zone un') {
			return [effectifMoinsDe50 ? 0.3201 : 0.3241]
		}

		if (zone === 'zone deux') {
			return [0.2111]
		}

		if (zone === 'mayotte') {
			return effectifMoinsDe50
				? [0.1996, 0.2264, 0.2449]
				: [0.2036, 0.2304, 0.2489]
		}

		return []
	})()

	const formatSeuil = (seuil: number) => seuil.toLocaleString('fr-FR')

	const seuilInflexion = formatSeuil(seuilInflexionBrut)
	const seuilIntermediaire =
		hasSeuilIntermediaire && formatSeuil(seuilIntermediaireBrut)
	const seuilSortie: string = formatSeuil(seuilSortieBrut)

	const formatPourcentage = (valeur: number) =>
		`${(valeur * 100).toLocaleString('fr-FR', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		// eslint-disable-next-line no-irregular-whitespace
		})} %`

	return (
		<>
			<H2>
				{t(
					'pages.simulateurs.lodeom.documentation.titre',
					'Calcul de l’exonération Lodeom'
				)}
			</H2>

			<Body>
				<Trans i18nKey="pages.simulateurs.lodeom.documentation.montant">
					Le montant de l’exonération est obtenu en multipliant la rémunération
					brute par un <Strong>cœfficient</Strong>.
				</Trans>
			</Body>

			<Body>
				<Code>
					{t(
						'pages.simulateurs.lodeom.documentation.formuleMontant',
						'Montant de l’exonération = rémunération brute × cœfficient'
					)}
				</Code>
			</Body>

			<H3>
				{t(
					'pages.simulateurs.lodeom.documentation.conditions.titre',
					'Condition d’application'
				)}
			</H3>

			<Body>
				<Trans i18nKey="pages.simulateurs.lodeom.documentation.conditions.sortie" shouldUnescape>
					L’exonération s’applique pour les{' '}
					<Strong>rémunérations inférieures à {{ seuilSortie }}&nbsp;Smic</Strong>.
				</Trans>
			</Body>

			<H3>
				{t(
					'pages.simulateurs.lodeom.documentation.coefficient.titre',
					'Calcul du cœfficient'
				)}
			</H3>

			<Body>
				{t(
					'pages.simulateurs.lodeom.documentation.coefficient.taux',
					'La valeur du cœfficient évolue avec la rémunération brute :'
				)}
			</Body>

			<Ul>
				<Li>
					<Trans
						i18nKey="pages.simulateurs.lodeom.documentation.coefficient.inflexion"
						shouldUnescape
					>
						Jusqu'à <Strong>{{ seuilInflexion }}&nbsp;Smic</Strong> inclus, le
						cœfficient est égal au taux maximal T&nbsp;;
					</Trans>
				</Li>

				<Li>
					<Trans
						i18nKey="pages.simulateurs.lodeom.documentation.coefficient.sortie"
						shouldUnescape
					>
						À partir de <Strong>{{ seuilSortie }}&nbsp;Smic</Strong>, le cœfficient
						est nul&nbsp;;
					</Trans>
				</Li>

				<Li>
					{hasSeuilIntermediaire ? (
						<>
							<Trans
								i18nKey="pages.simulateurs.lodeom.documentation.coefficient.intermediaire"
								shouldUnescape
							>
								Entre ces deux valeurs, le cœfficient diminue progressivement.
								Sa formule change à{' '}
								<Strong>{{ seuilIntermediaire }}&nbsp;Smic</Strong>&nbsp;:
							</Trans>
							<Ul>
								<Li>
									<Trans
										i18nKey="pages.simulateurs.lodeom.documentation.formule.1"
										shouldUnescape
									>
										Entre {{ seuilInflexion }} et {{ seuilIntermediaire }}&nbsp;Smic&nbsp;:
									</Trans>

									<Body>
										<Code>
											{`Cœfficient = ${seuilInflexion} × T × Smic ÷ rémunération brute`}
										</Code>
									</Body>
								</Li>
								<Li>
									<Trans
										i18nKey="pages.simulateurs.lodeom.documentation.formule.2"
										shouldUnescape
									>
										Entre {{ seuilIntermediaire }} et {{ seuilSortie }}&nbsp;Smic&nbsp;:
									</Trans>

									<Body>
										<Code>
											{`Cœfficient = ${seuilInflexion} × T ${seuilSortieBrut - seuilIntermediaireBrut !== 1 ? `÷ ${formatSeuil(seuilSortieBrut - seuilIntermediaireBrut)}` : ''} × (${seuilSortie} × Smic ÷ rémunération brute − 1)`}
										</Code>
									</Body>
								</Li>
							</Ul>
						</>
					) : (
						<>
							<Trans i18nKey="pages.simulateurs.lodeom.documentation.formule.3" shouldUnescape>
								Entre ces deux valeurs, le cœfficient diminue progressivement en
								fonction de la rémunération brute&nbsp;:
							</Trans>
							<Body>
								<Code>
									{`Cœfficient = ${seuilInflexion} × T ÷ ${formatSeuil(seuilSortieBrut - seuilInflexionBrut)} × (${seuilSortie} × Smic ÷ rémunération brute − 1)`}
								</Code>
							</Body>
						</>
					)}
				</Li>
			</Ul>

			<H3>
				{t('pages.simulateurs.lodeom.documentation.T.titre', 'Valeur de T')}
			</H3>

			<Body>
				{t(
					'pages.simulateurs.lodeom.documentation.T.taux',
					'Le taux maximal T correspond à la somme des taux des cotisations patronales exonérées.'
				)}
			</Body>

			{zone === 'mayotte' ? (
				<>
					<Body>
						{t(
							'pages.simulateurs.lodeom.documentation.T.mayotte',
							'À Mayotte, le taux dépend également de la rémunération. Les valeurs possibles sont :'
						)}
					</Body>
					<Ul>
						{valeursT.map((valeur) => (
							<Li key={valeur}>
								<Strong>{formatPourcentage(valeur)}</Strong>
							</Li>
						))}
					</Ul>
				</>
			) : (
				<Body>
					<Trans i18nKey="pages.simulateurs.lodeom.documentation.T.default">
						Pour votre situation, le taux maximal T est de{' '}
						<Strong>{{ taux: formatPourcentage(valeursT[0]) }}</Strong>.
					</Trans>
				</Body>
			)}

			<H3>
				{t(
					'pages.simulateurs.lodeom.documentation.smic.titre',
					'Valeur du Smic'
				)}
			</H3>

			<Body>
				{zone === 'mayotte' ? (
					t(
						'pages.simulateurs.lodeom.documentation.smic.valeur.mayotte',
						'À Mayotte, il s’agit de la valeur du Smic en vigueur.'
					)
				) : (
					<Trans i18nKey="pages.simulateurs.lodeom.documentation.smic.valeur.default">
						Hors Mayotte, la valeur de référence est celle du{' '}
						<Strong>1er janvier 2026</Strong>.
					</Trans>
				)}
			</Body>
			<Trans
				i18nKey="pages.simulateurs.lodeom.documentation.smic.ajustements"
				shouldUnescape
			>
				<Body>
					Le Smic utilisé pour calculer l’exonération dépend du temps de travail
					et de la période travaillée&nbsp;:
				</Body>

				<Ul>
					<Li>
						En cas de <Strong>temps partiel</Strong> ou d’
						<Strong>heures supplémentaires</Strong>, le Smic est ajusté au temps
						de travail.
					</Li>
					<Li>
						En cas de <Strong>mois incomplet</Strong>, le Smic est ajusté au
						pro-rata en tenant compte des éléments de rémunération qui ne sont
						pas affectés par l’absence (comme certaines primes).
					</Li>
				</Ul>
			</Trans>
		</>
	)
}
