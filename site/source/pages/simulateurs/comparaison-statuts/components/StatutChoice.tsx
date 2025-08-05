import { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import { StatutType, TAG_DATA } from '@/components/StatutTag'
import { Button, Grid, H4, Li, Spacing, Strong, Ul } from '@/design-system'
import { EngineComparison } from '@/pages/simulateurs/comparaison-statuts/EngineComparison'
import { useSitePaths } from '@/sitePaths'

import { getGridSizes } from './DetailsRowCards'
import StatusCard from './StatusCard'

const StatutChoice = ({
	namedEngines,
	hideCTA = false,
}: {
	namedEngines: EngineComparison
	hideCTA?: boolean
}) => {
	const gridSizes = getGridSizes(1, namedEngines.length)

	return (
		<StatusChoiceWrapper>
			<Spacing lg />
			<Grid container spacing={4} as={Ul}>
				<Grid item {...gridSizes} as={Li}>
					<StatutBloc {...namedEngines[0]} hideCTA={hideCTA} />
				</Grid>
				<Grid item {...gridSizes} as={Li}>
					<StatutBloc {...namedEngines[1]} hideCTA={hideCTA} />
				</Grid>
				<Grid item {...gridSizes} as={Li}>
					{namedEngines[2] && (
						<StatutBloc {...namedEngines[2]} hideCTA={hideCTA} />
					)}
				</Grid>
			</Grid>
		</StatusChoiceWrapper>
	)
}

const StatusChoiceWrapper = styled.div`
	& > ul > li {
		padding-left: 1rem !important;

		&:empty {
			display: none;
		}

		&::before {
			content: none !important;
		}
	}
`

function StatutBloc({
	engine,
	name,
	hideCTA = false,
}: {
	engine: Engine<DottedName>
	name: StatutType
	hideCTA: boolean
}) {
	const { t } = useTranslation()
	const regime = engine.evaluate('dirigeant . régime social')
		.nodeValue as string
	const imposition = engine.evaluate('entreprise . imposition')
		.nodeValue as string
	const versementLibératoire = engine.evaluate(
		'dirigeant . auto-entrepreneur . impôt . versement libératoire'
	).nodeValue as string
	const { absoluteSitePaths } = useSitePaths()

	return (
		<StatusCard
			statut={[name]}
			footerContent={
				!hideCTA && (
					<div
						style={{
							textAlign: 'center',
						}}
					>
						<Button
							to={
								absoluteSitePaths.assistants['choix-du-statut'].résultat[name]
							}
							size="XS"
						>
							Choisir ce statut
						</Button>
					</div>
				)
			}
		>
			<H4 as="h3">{TAG_DATA[name].longName}</H4>
			<Ul
				style={{
					display: 'flex',
					flex: '1',
					marginBottom: '0',
					flexDirection: 'column',
				}}
			>
				<Li>
					{versementLibératoire ? (
						<Trans>
							<Strong>Versement libératoire</Strong> de l'impôt sur le revenu
						</Trans>
					) : imposition === 'IS' ? (
						<Trans>
							<Strong>Impôt sur les sociétés</Strong> (IS)
						</Trans>
					) : (
						<Trans>
							<Strong>Impôt sur le revenu</Strong> (IR)
						</Trans>
					)}
				</Li>
				<Li>
					<Trans i18nKey="statutchoice.regime">
						Régime social des {{ regime }}s
					</Trans>
				</Li>
				<Li>
					{engine.evaluate({
						valeur: 'dirigeant . exonérations . ACRE',
					}).nodeValue
						? t('Avec ACRE')
						: t('Option ACRE non activée')}
					<ExplicableRule dottedName="dirigeant . exonérations . ACRE" />
				</Li>
			</Ul>
		</StatusCard>
	)
}

export default StatutChoice
