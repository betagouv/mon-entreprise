import Value from '@/components/EngineValue'
import { Radio, ToggleGroup } from '@/design-system/field'
import { Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { Li } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import { Grid } from '@mui/material'
import { ExoCovidDottedNames } from 'exoneration-covid'
import { Evaluation, PublicodesExpression } from 'publicodes'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'
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

	return (
		<>
			{exoS2Applicable ? (
				<>
					<Trans>
						<H3>
							Entre début {monthNames[firstMonth - 1]} {firstYear.toString()} et
							fin {monthNames[lastMonth - 1]} {lastYear.toString()}, combien de
							mois avez-vous été impacté par la crise sanitaire ?
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

							<Grid item xs="auto" alignSelf={'end'}>
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
									Montant de l’exonération sociale liée à la crise sanitaire sur
									l’année 2021
								</Trans>
							</Grid>

							<Grid item xs="auto" alignSelf={'end'}>
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

			<Trans>
				<H3>Résumé</H3>

				<RecapExpert>
					<Li>
						Secteur d'activité dont relève l'activité principale :{' '}
						<Bold as="span">{engine.evaluate('secteur').nodeValue}</Bold>
					</Li>
					<Li>
						Activité exercée en{' '}
						<Bold as="span">
							{engine.evaluate("lieu d'exercice").nodeValue}
						</Bold>
					</Li>
					<Li>
						Début d'activité :{' '}
						<Bold as="span">
							{engine.evaluate("début d'activité").nodeValue}
						</Bold>
					</Li>
					<Li>
						Nombres de mois pour lesquels vous remplissez les conditions
						d'éligibilité :{' '}
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
			</Trans>
		</>
	)
}
