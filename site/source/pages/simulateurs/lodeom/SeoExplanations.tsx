import { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { Body, Code, H2, H3, Li, Strong, Ul } from '@/design-system'
import { useBarèmeLodeom } from '@/hooks/useBarèmeLodeom'
import { useZoneLodeom } from '@/hooks/useZoneLodeom'
import { useEngine } from '@/utils/publicodes/EngineContext'

export const SeoExplanations = () => {
	const { i18n, t } = useTranslation()
	const engine = useEngine()
	const zone = useZoneLodeom()
	const barème = useBarèmeLodeom()

	const effectifMoinsDe50 =
		(engine.evaluate('entreprise . salariés . effectif').nodeValue as number) <
		50

	const seuilInflexionBrut = engine.evaluate(
		'salarié . cotisations . exonérations . lodeom . montant . seuil inflexion'
	).nodeValue

	const seuilIntermediaireBrut = engine.evaluate(
		'salarié . cotisations . exonérations . lodeom . montant . seuil intermédiaire'
	).nodeValue

	const seuilSortieBrut = engine.evaluate(
		'salarié . cotisations . exonérations . lodeom . montant . seuil sortie'
	).nodeValue

	const valeursT = useMemo(() => {
		const T1 = engine.evaluate({
			valeur: 'salarié . cotisations . exonérations . T',
			contexte: {
				'salarié . cotisations . allocations familiales . éligible taux réduit':
					'oui',
				'salarié . cotisations . maladie . employeur . éligible taux réduit':
					'oui',
			},
		}).nodeValue as number

		if (zone === 'mayotte') {
			const T2 = engine.evaluate({
				valeur: 'salarié . cotisations . exonérations . T',
				contexte: {
					'salarié . cotisations . allocations familiales . éligible taux réduit':
						'oui',
					'salarié . cotisations . maladie . employeur . éligible taux réduit':
						'non',
				},
			}).nodeValue as number

			const T3 = engine.evaluate({
				valeur: 'salarié . cotisations . exonérations . T',
				contexte: {
					'salarié . cotisations . allocations familiales . éligible taux réduit':
						'non',
					'salarié . cotisations . maladie . employeur . éligible taux réduit':
						'non',
				},
			}).nodeValue as number

			return [T1, T2, T3]
		}

		return [T1]
		// Le coefficient T varie avec l'effectif (cf coefficientT.test.ts)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [engine, zone, effectifMoinsDe50])

	if (
		!zone ||
		!barème ||
		typeof seuilInflexionBrut !== 'number' ||
		typeof seuilSortieBrut !== 'number' ||
		!valeursT.length
	) {
		return null
	}

	const hasSeuilIntermediaire = typeof seuilIntermediaireBrut === 'number'

	const formatSeuil = (seuil: number) => seuil.toLocaleString(i18n.language)

	const seuilInflexion = formatSeuil(seuilInflexionBrut)
	const seuilIntermediaire =
		hasSeuilIntermediaire && formatSeuil(seuilIntermediaireBrut)
	const seuilSortie = formatSeuil(seuilSortieBrut)

	const formatPourcentage = (valeur: number) =>
		`${(valeur * 100).toLocaleString(i18n.language, {
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
				<Trans
					i18nKey="pages.simulateurs.lodeom.documentation.conditions.sortie"
					shouldUnescape
				>
					L’exonération s’applique pour les{' '}
					<Strong>
						rémunérations inférieures à {{ seuilSortie } as unknown as string}
						&nbsp;Smic
					</Strong>
					.
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
						Jusqu'à{' '}
						<Strong>{{ seuilInflexion } as unknown as string}&nbsp;Smic</Strong>{' '}
						inclus, le cœfficient est égal au taux maximal T&nbsp;;
					</Trans>
				</Li>

				<Li>
					<Trans
						i18nKey="pages.simulateurs.lodeom.documentation.coefficient.sortie"
						shouldUnescape
					>
						À partir de{' '}
						<Strong>{{ seuilSortie } as unknown as string}&nbsp;Smic</Strong>,
						le cœfficient est nul&nbsp;;
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
								<Strong>
									{{ seuilIntermediaire } as unknown as string}&nbsp;Smic
								</Strong>
								&nbsp;:
							</Trans>
							<Ul>
								<Li>
									<Trans
										i18nKey="pages.simulateurs.lodeom.documentation.formule.1.texte"
										shouldUnescape
									>
										Entre {{ seuilInflexion }} et {{ seuilIntermediaire }}
										&nbsp;Smic&nbsp;:
									</Trans>

									<Body>
										<Code>
											{t(
												'pages.simulateurs.lodeom.documentation.formule.1.code',
												'Cœfficient = {{seuilInflexion}} × T × Smic ÷ rémunération brute',
												{ seuilInflexion }
											)}
										</Code>
									</Body>
								</Li>
								<Li>
									<Trans
										i18nKey="pages.simulateurs.lodeom.documentation.formule.2.texte"
										shouldUnescape
									>
										Entre {{ seuilIntermediaire }} et {{ seuilSortie }}
										&nbsp;Smic&nbsp;:
									</Trans>

									<Body>
										<Code>
											{t(
												'pages.simulateurs.lodeom.documentation.formule.2.code',
												'Cœfficient = {{seuilInflexion}} × T {{diviseur }} × ({{seuilSortie}} × Smic ÷ rémunération brute − 1)',
												{
													seuilInflexion,
													diviseur:
														seuilSortieBrut - seuilIntermediaireBrut !== 1
															? `÷ ${formatSeuil(seuilSortieBrut - seuilIntermediaireBrut)}`
															: '',
													seuilSortie,
												}
											)}
										</Code>
									</Body>
								</Li>
							</Ul>
						</>
					) : (
						<>
							<Trans
								i18nKey="pages.simulateurs.lodeom.documentation.formule.3.texte"
								shouldUnescape
							>
								Entre ces deux valeurs, le cœfficient diminue progressivement en
								fonction de la rémunération brute&nbsp;:
							</Trans>
							<Body>
								<Code>
									{t(
										'pages.simulateurs.lodeom.documentation.formule.3.code',
										'Cœfficient = {{seuilInflexion}} × T ÷ {{diviseur}} × ({{seuilSortie}} × Smic ÷ rémunération brute − 1)',
										{
											seuilInflexion,
											diviseur: formatSeuil(
												seuilSortieBrut - seuilInflexionBrut
											),
											seuilSortie,
										}
									)}
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
