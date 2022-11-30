import { DottedName as ExoCovidDottedNames } from 'exoneration-covid'
import { Evaluation, PublicodesExpression } from 'publicodes'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import Value from '@/components/EngineValue'
import { Radio, ToggleGroup } from '@/design-system/field'
import { Grid, Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { Li } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'

import { useExoCovidEngine } from '.'
import { Bold, GridTotal, Italic, Recap, RecapExpert, Total } from './Recap'

const Info = styled(Body)`
	background-color: ${({ theme }) => theme.colors.extended.info['100']};
	padding: 1rem;
	border: 2px solid ${({ theme }) => theme.colors.extended.info['300']};
	border-radius: 0.35rem;
`

export const FormulaireS2 = ({
	onChange,
}: {
	onChange?: (
		dottedName: ExoCovidDottedNames,
		value: PublicodesExpression
	) => void
}) => {
	const engine = useExoCovidEngine()
	const { t } = useTranslation()

	const monthNames = [
		t('janvier'),
		t('février'),
		t('mars'),
		t('avril'),
		t('mai'),
		t('juin'),
		t('juillet'),
		t('août'),
		t('septembre'),
		t('octobre'),
		t('novembre'),
		t('décembre'),
	]

	const exoS2Applicable = engine.evaluate('exonération S2').nodeValue !== null

	const [firstMonth, firstYear] = (
		(engine.evaluate('exonération S2 . mois éligibles . premier mois')
			.nodeValue as Evaluation<string>) || ''
	)
		.slice(3)
		.split('/')
		.map((x) => parseInt(x))

	const [lastMonth, lastYear] = (
		(engine.evaluate('exonération S2 . mois éligibles . dernier mois')
			.nodeValue as Evaluation<string>) || ''
	)
		.slice(3)
		.split('/')
		.map((x) => parseInt(x))

	const monthCount =
		(engine.evaluate('exonération S2 . mois éligibles . plafond')
			.nodeValue as Evaluation<number>) ?? 0

	const formatZeroToEmpty = (str?: string) =>
		typeof str === 'undefined' || str === '0' ? t('vide') : str

	const formatYesNo = (str?: string | null) =>
		str?.startsWith('O') ? t('oui') : t('non')

	return (
		<>
			{exoS2Applicable ? (
				<>
					<Trans>
						<H3 as="h2">
							Entre début {{ firstMonth: monthNames[firstMonth - 1] }}{' '}
							{{ firstYear: firstYear.toString() }} et fin{' '}
							{{ lastMonth: monthNames[lastMonth - 1] }}{' '}
							{{ lastYear: lastYear.toString() }}, combien de mois avez-vous été
							impacté par la crise sanitaire ?
						</H3>
						<Body>
							Précisez le nombre de mois durant lesquels vous avez fait l’objet
							d’une mesure d’interdiction affectant de manière prépondérante la
							poursuite de votre activité.
						</Body>
					</Trans>

					<ToggleGroup
						onChange={(valeur) => {
							onChange?.('exonération S2 . mois éligibles', {
								valeur,
								unité: 'mois',
							})
						}}
					>
						{new Array(monthCount + 1).fill(null).map((_, i) => (
							<Radio hideRadio key={i} value={`${i}`}>
								{i}
							</Radio>
						))}
					</ToggleGroup>

					<Spacing xl />

					<Recap>
						<Grid container>
							<Grid item xs>
								<Trans>
									<Bold>
										Dispositif loi de financement de la sécurité sociale (LFSS)
										pour 2021
									</Bold>

									<Italic>
										Mesure d’interdiction affectant de manière prépondérante la
										poursuite de votre activité
									</Italic>
								</Trans>
							</Grid>

							<Grid
								item
								xs="auto"
								css={`
									align-self: end;
								`}
							>
								<Total>
									<Value
										engine={engine}
										expression="exonération S2"
										linkToRule={false}
										precision={0}
									/>
								</Total>
							</Grid>
						</Grid>

						<hr />

						<GridTotal container>
							<Grid item xs>
								<Trans>
									<Bold>
										Montant total de l'exonération Covid applicable aux
										cotisations 2021
									</Bold>

									<Italic>
										L'exonération correspondante s'impute sur les cotisations et
										contributions sociale définitives 2021, hors CFP
										(contribution à la formation professionnelle) et CURPS
										(contribution aux unions régionales des professionnels de
										santé), dans la limite des cotisations restant dues à
										l'Urssaf.
									</Italic>
								</Trans>
							</Grid>

							<Grid
								item
								xs="auto"
								css={`
									align-self: end;
								`}
							>
								<Total>
									<Value
										engine={engine}
										expression="montant total"
										linkToRule={false}
										precision={0}
									/>
								</Total>
							</Grid>
						</GridTotal>
					</Recap>
				</>
			) : (
				<Trans>
					<Info>
						Vous n'êtes pas concerné par l'exonération de cotisations Covid pour
						les indépendants.
					</Info>
				</Trans>
			)}

			<Grid container>
				<Grid item md={6}>
					<Trans>
						<H3 as="h2">Résumé</H3>
					</Trans>

					<RecapExpert>
						<Li>
							<Trans>
								Secteur d'activité dont relève l'activité principale :{' '}
							</Trans>
							<Bold as="span">{engine.evaluate('secteur').nodeValue}</Bold>
						</Li>
						<Li>
							<Trans>Activité exercée en </Trans>
							<Bold as="span">
								{engine.evaluate("lieu d'exercice").nodeValue}
							</Bold>
						</Li>
						<Li>
							<Trans>Début d'activité : </Trans>
							<Bold as="span">
								{engine.evaluate("début d'activité").nodeValue}
							</Bold>
						</Li>
						<Li>
							<Trans>
								Nombres de mois pour lesquels vous remplissez les conditions
								d'éligibilité :{' '}
							</Trans>
							<Bold as="span">
								<Value
									engine={engine}
									expression="exonération S2 . mois éligibles"
									linkToRule={false}
									precision={0}
								/>
							</Bold>
						</Li>
					</RecapExpert>
				</Grid>

				<Grid item md={6}>
					<Trans>
						<H3 as="h2">Résumé pour les tiers-déclarants</H3>
						<Body>
							Reportez les éléments entre parenthèses dans la déclaration EDI de
							votre client
						</Body>
					</Trans>

					<RecapExpert>
						<Li>
							<Trans>
								Secteur d'activité dont relève l'activité principale :{' '}
							</Trans>
							<Bold as="span">{engine.evaluate('secteur').nodeValue}</Bold> (
							<Bold as="span">
								{engine.evaluate('code . secteur').nodeValue}
							</Bold>
							)
						</Li>

						<Li>
							<Trans>Activité exercée en </Trans>
							<Bold as="span">
								{engine.evaluate("lieu d'exercice").nodeValue}
							</Bold>{' '}
							(
							<Bold as="span">
								{engine.evaluate("code . lieu d'exercice").nodeValue}
							</Bold>
							)
						</Li>

						<Li>
							<Trans>Début d'activité : </Trans>
							<Bold as="span">
								{engine.evaluate("début d'activité").nodeValue}
							</Bold>{' '}
							(
							<Bold as="span">
								{engine.evaluate("code . début d'activité").nodeValue}
							</Bold>
							)
						</Li>

						<Li>
							<Trans>Eligibilité LFSS : </Trans>
							<Bold as="span">
								{formatYesNo(
									engine.evaluate('code . LFSS').nodeValue as Evaluation<string>
								)}
							</Bold>{' '}
							(
							<Bold as="span">
								{
									engine
										.evaluate('code . LFSS')
										.nodeValue?.toString()
										.split(';')[0]
								}
							</Bold>
							)
						</Li>

						<Li>
							<Trans>Eligibilité LFR : </Trans>
							<Bold as="span">
								{formatYesNo(
									engine.evaluate('code . LFR1').nodeValue?.toString()
								)}
							</Bold>{' '}
							(<Bold as="span">{engine.evaluate('code . LFR1').nodeValue}</Bold>
							)
						</Li>

						<Li>
							<Trans>Nombre de mois LFSS 600 : </Trans>
							<Bold as="span">
								<Value
									engine={engine}
									expression="exonération S2 . mois éligibles"
									linkToRule={false}
									precision={0}
								/>
							</Bold>{' '}
							(
							<Bold as="span">
								{formatZeroToEmpty(
									engine
										.evaluate('exonération S2 . mois éligibles')
										.nodeValue?.toString()
								)}
							</Bold>
							)
						</Li>

						<Li>
							<Trans>Nombre de mois LFSS 300 : </Trans>
							<Bold as="span">0 mois ({t('vide')})</Bold>
						</Li>

						<Li>
							<Trans>Nombre de mois LFR : </Trans>
							<Bold as="span">
								<Value
									engine={engine}
									expression="LFR1 . mois éligibles"
									linkToRule={false}
									precision={0}
								/>
							</Bold>{' '}
							(
							<Bold as="span">
								{formatZeroToEmpty(
									engine.evaluate('LFR1 . mois éligibles').nodeValue?.toString()
								)}
							</Bold>
							)
						</Li>
					</RecapExpert>
				</Grid>
			</Grid>
		</>
	)
}
