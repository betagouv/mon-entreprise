import { DottedName as ExoCovidDottedNames } from 'exoneration-covid'
import Engine, {
	EvaluatedNode,
	Evaluation,
	PublicodesExpression,
} from 'publicodes'
import { Key, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import Value from '@/components/EngineValue'
import { ExplicableRule } from '@/components/conversation/Explicable'
import { Situation } from '@/components/utils/SituationContext'
import { Grid, Spacing } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'

import { useExoCovidEngine, useExoCovidSituationState } from '.'
import { Bold, GridTotal, Italic, Recap, RecapExpert, Total } from './Recap'
import { Row, Table, Tbody, Th, Thead, Tr } from './Table'

const getTotalByMonth = (
	engine: Engine<ExoCovidDottedNames>,
	situation: Situation<ExoCovidDottedNames>
) => {
	const ret = Object.fromEntries(
		Object.entries(situation)
			.filter(([monthDottedName]) => monthDottedName.startsWith('mois . '))
			.map(([monthDottedName]) => {
				const parsedRules = engine.getParsedRules()

				const exoSelected = (
					engine.evaluate(monthDottedName) as EvaluatedNode<string>
				).nodeValue

				const exoApplicable =
					typeof exoSelected === 'string' &&
					monthDottedName + ' . ' + exoSelected in parsedRules &&
					engine.evaluate(monthDottedName + ' . ' + exoSelected).nodeValue

				if (
					!exoApplicable ||
					!(exoSelected + ' . montant mensuel' in parsedRules)
				) {
					return [monthDottedName, undefined]
				}

				const value = engine.evaluate(
					exoSelected + ' . montant mensuel'
				) as EvaluatedNode<number>

				return [monthDottedName, value]
			})
	)

	return ret
}

interface Props {
	onChange?: (
		dottedName: ExoCovidDottedNames,
		value: PublicodesExpression
	) => void
}

export const FormulaireS1S1Bis = ({ onChange }: Props) => {
	const engine = useExoCovidEngine()
	const { t } = useTranslation()
	const { situation = {} } = useExoCovidSituationState()

	const selectedKey = useRef<{ [key: string]: Key | undefined }>({})

	const totalByMonth = getTotalByMonth(engine, situation) ?? {}

	if (!engine.evaluate('mois').nodeValue) {
		return null
	}

	const months = Object.entries(engine.getParsedRules()).filter(([name]) =>
		name.match(/^mois \. [^.]*$/)
	)

	const formatZeroToEmpty = (str?: string) =>
		typeof str === 'undefined' || str === '0' ? t('vide') : str

	const formatYesNo = (str?: string | null) =>
		str?.startsWith('O') ? t('oui') : t('non')

	let isAnyRowShowed = false

	return (
		<>
			<H3>
				{engine.getRule('secteur . S1 ou S1bis').rawNode.question}
				<ExplicableRule
					aria-label={t('En savoir plus')}
					dottedName="secteur . S1 ou S1bis"
					light
					bigPopover
				/>
			</H3>
			<Table>
				<caption className="visually-hidden">
					<Trans>
						Tableau affichant pour chaque mois de la période précédemment
						sélectionnée le montant de réductions pour la situation
						sélectionnée.
					</Trans>
				</caption>
				<Thead>
					<Tr>
						<Trans>
							<Th>Mois</Th>
							<Th>Situation liée à la crise sanitaire</Th>
							<Th>Montant de la réduction</Th>
						</Trans>
					</Tr>
				</Thead>

				<Tbody>
					{months.map(([dotName, node], i) => {
						const showRow = engine.evaluate(dotName).nodeValue !== null

						if (!showRow) {
							if (isAnyRowShowed) {
								return (
									<Row
										{...months[i][1]}
										actualMonth={dotName}
										dottedNames={[]}
										key={months[i][0]}
									/>
								)
							}

							return null
						}
						isAnyRowShowed = true

						return (
							<Row
								actualMonth={dotName}
								dottedNames={['LFSS 600', 'LFSS 300', 'LFR1']}
								title={node.title}
								total={totalByMonth[dotName]}
								defaultSelectedKey={selectedKey.current[dotName]}
								onSelectionChange={(key) => {
									selectedKey.current[dotName] = key
									const val = (key as string).replace(/\.\d+$/, '')
									onChange?.(dotName as ExoCovidDottedNames, `'${val}'`)
								}}
								key={dotName}
							/>
						)
					})}
				</Tbody>
			</Table>

			<Spacing lg />

			<Recap>
				<Grid container>
					<Grid item xs>
						<Trans>
							<Bold>
								Dispositif loi de financement de la sécurité sociale (LFSS) pour
								2021
							</Bold>

							<Italic>
								Mesure d’interdiction d’accueil du public ou baisse d’au moins
								50% (ou 65% à compter de décembre 2021) du chiffre d’affaires
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
								expression="LFSS 600"
								linkToRule={false}
								precision={0}
							/>
						</Total>
					</Grid>
				</Grid>

				<Grid container>
					<Grid item xs>
						<Trans>
							<Italic>Baisse entre 30% et 64% du chiffre d'affaires</Italic>
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
								expression="LFSS 300"
								linkToRule={false}
								precision={0}
							/>
						</Total>
					</Grid>
				</Grid>

				<hr />

				<Grid container>
					<Grid item xs>
						<Trans>
							<Bold>
								Dispositif loi de finances rectificative (LFR1) pour 2021
							</Bold>

							<Italic>Éligibilité aux mois de mars, avril ou mai 2021</Italic>
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
								expression="LFR1"
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
								Montant total de l'exonération Covid applicable aux cotisations
								2021
							</Bold>

							<Italic>
								L'exonération correspondante s'impute sur les cotisations et
								contributions sociale définitives 2021, hors CFP (contribution à
								la formation professionnelle) et CURPS (contribution aux unions
								régionales des professionnels de santé), dans la limite des
								cotisations restant dues à l'Urssaf.
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

			<Grid container>
				<Grid item md={6}>
					<Trans>
						<H3>Résumé</H3>
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
								d'éligibilité
							</Trans>
							<Ul>
								<Li>
									LFSS :{' '}
									<Bold as="span">
										<Value
											engine={engine}
											expression="LFSS . mois éligibles"
											linkToRule={false}
											precision={0}
										/>
									</Bold>
								</Li>
								<Li>
									LFR1 :{' '}
									<Bold as="span">
										<Value
											engine={engine}
											expression="LFR1 . mois éligibles"
											linkToRule={false}
											precision={0}
										/>
									</Bold>
								</Li>
							</Ul>
						</Li>
					</RecapExpert>
				</Grid>

				<Grid item md={6}>
					<Trans>
						<H3>Résumé pour les tiers-déclarants</H3>
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
									engine.evaluate('code . LFR1').nodeValue as Evaluation<string>
								)}
							</Bold>{' '}
							(
							<Bold as="span">
								{
									(
										engine.evaluate('code . LFR1')
											.nodeValue as Evaluation<string>
									)?.split(';')[0]
								}
							</Bold>
							)
						</Li>

						<Li>
							<Trans>Nombre de mois LFSS 600 : </Trans>
							<Bold as="span">
								<Value
									engine={engine}
									expression="LFSS 600 . mois éligibles"
									linkToRule={false}
									precision={0}
								/>
							</Bold>{' '}
							(
							<Bold as="span">
								{formatZeroToEmpty(
									engine
										.evaluate('LFSS 600 . mois éligibles')
										.nodeValue?.toString()
								)}
							</Bold>
							)
						</Li>

						<Li>
							<Trans>Nombre de mois LFSS 300 : </Trans>
							<Bold as="span">
								<Value
									engine={engine}
									expression="LFSS 300 . mois éligibles"
									linkToRule={false}
									precision={0}
								/>
							</Bold>{' '}
							(
							<Bold as="span">
								{formatZeroToEmpty(
									engine
										.evaluate('LFSS 300 . mois éligibles')
										.nodeValue?.toString()
								)}
							</Bold>
							)
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
