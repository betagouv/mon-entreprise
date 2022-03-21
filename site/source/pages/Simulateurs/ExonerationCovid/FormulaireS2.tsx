import { EngineContext } from '@/components/utils/EngineContext'
import { Radio, ToggleGroup } from '@/design-system/field'
import { Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { Li } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'
import { Grid } from '@mui/material'
import { DottedNames } from 'exoneration-covid'
import Engine, {
	Evaluation,
	formatValue,
	PublicodesExpression,
} from 'publicodes'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Bold, GridTotal, Italic, Recap, RecapExpert, Total } from './Recap'

export const FormulaireS2 = ({
	onChange,
}: {
	onChange?: (dottedName: DottedNames, value: PublicodesExpression) => void
}) => {
	const engine = useContext(EngineContext) as Engine<DottedNames>

	const exoS2 = engine.evaluate('exonération S2')
	const total = engine.evaluate('montant total')

	const toDate = (value: string) => {
		const [day, month, year] = value.split('/')
		return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
	}

	const firstMonth = engine.evaluate(
		'exonération S2 . mois éligibles . premier mois'
	).nodeValue as Evaluation<string>
	const lastMonth = engine.evaluate(
		'exonération S2 . mois éligibles . dernier mois'
	).nodeValue as Evaluation<string>

	const monthCount =
		lastMonth && firstMonth
			? toDate(lastMonth).getMonth() - toDate(firstMonth).getMonth() + 2
			: 0
	const radioComponents = []

	for (let i = 0; i < monthCount; i++) {
		radioComponents.push(
			<Radio hideRadio key={i} value={`${i}`}>
				{i}
			</Radio>
		)
	}

	return (
		<>
			<Trans>
				<H3>
					Entre {firstMonth} et {lastMonth}, combien de mois avez-vous été
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
				{radioComponents}
			</ToggleGroup>

			<Spacing xl />

			<Recap>
				<Grid container>
					<Grid item xs>
						<Trans>
							<Bold>
								Dispositif loi de financement de la sécurité sociale (LFSS) pour
								2021
							</Bold>

							<Italic>
								Mesure d’interdiction affectant de manière prépondérante la
								poursuite de votre activité
							</Italic>
						</Trans>
					</Grid>

					<Grid item xs="auto" alignSelf={'end'}>
						<Total>{formatValue(exoS2)}</Total>
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
						<Total>{formatValue(total)}</Total>
					</Grid>
				</GridTotal>
			</Recap>

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
							{formatValue(engine.evaluate('exonération S2 . mois éligibles'))}
						</Bold>
					</Li>
				</RecapExpert>
			</Trans>
		</>
	)
}
