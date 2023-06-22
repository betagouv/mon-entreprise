import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import Value from '@/components/EngineValue'
import { StatutTag } from '@/components/StatutTag'
import { Tag } from '@/design-system/tag'
import { Strong } from '@/design-system/typography'
import { H4 } from '@/design-system/typography/heading'

import { EngineComparison } from './Comparateur'

export default function RevenuTable({
	namedEngines,
}: {
	namedEngines: EngineComparison
}) {
	const { t } = useTranslation()

	return (
		<>
			<H4
				as="h3"
				css={`
					margin-bottom: 1rem;
				`}
			>
				<Trans>Calculer vos revenus</Trans>
			</H4>
			<WrapperTable>
				<StyledTable>
					<caption className="sr-only">
						{t(
							'comparateur.allerPlusLoin.tableCaption',
							'Tableau affichant le détail du calcul du revenu net pour chaque statut'
						)}
					</caption>
					<thead>
						<tr>
							<th className="sr-only">Type de structure</th>
							{namedEngines.map(({ name }) => (
								<th scope="col" key={name}>
									<span className="table-title">
										<StyledStatutTag statut={name} text="acronym" showIcon />
									</span>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">
								<Minus
									css={`
										opacity: 0;
									`}
									aria-hidden
								>
									-
								</Minus>{' '}
								<Trans>Chiffre d'affaires</Trans>
							</th>
							<td colSpan={3}>
								<StyledTag color="grey">
									<Value
										expression="entreprise . chiffre d'affaires"
										displayedUnit="€"
										linkToRule={false}
									/>
								</StyledTag>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<Minus aria-label={t('moins')}>-</Minus> <Trans>Charges</Trans>
							</th>
							<td colSpan={3}>
								<StyledTag color={'grey'}>
									<Value
										expression="entreprise . charges"
										unit="€/an"
										displayedUnit="€"
										linkToRule={false}
									/>
								</StyledTag>
							</td>
						</tr>
						<tr>
							<th scope="row">
								<Minus aria-label={t('moins')}>-</Minus>{' '}
								<Trans>Cotisations</Trans>
							</th>
							{namedEngines.map(({ name, engine }) => (
								<td key={name}>
									<StyledStatutTag statut={name} showIcon={false}>
										<Value
											expression="dirigeant . rémunération . cotisations"
											engine={engine}
											precision={0}
											unit="€/an"
											displayedUnit="€"
											linkToRule={false}
										/>
									</StyledStatutTag>
								</td>
							))}
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<th scope="row">
								<Minus
									css={`
										opacity: 0;
									`}
									aria-hidden
								>
									-
								</Minus>{' '}
								<Trans>Revenu avant impôt</Trans>
							</th>
							{namedEngines.map(({ name, engine }) => (
								<td key={name}>
									<StyledStatutTag statut={name} showIcon={false}>
										<Strong>
											<Value
												expression="dirigeant . rémunération . net"
												engine={engine}
												unit="€/an"
												precision={0}
												displayedUnit="€"
												linkToRule={false}
											/>
										</Strong>
									</StyledStatutTag>
								</td>
							))}
						</tr>
					</tfoot>
				</StyledTable>
			</WrapperTable>
			<WrapperTable>
				<StyledTable>
					<caption className="sr-only">
						{t(
							'comparateur.allerPlusLoin.tableCaption',
							'Tableau affichant le détail du calcul du revenu net après impôt pour chaque statut'
						)}
					</caption>
					<thead className="sr-only">
						<tr>
							<th>Type de structure</th>
							{namedEngines.map(({ name }) => (
								<th scope="col" key={name}>
									<span className="table-title">
										<StyledStatutTag statut={name} text="acronym" showIcon />
									</span>
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						<tr>
							<th scope="row">
								<Minus aria-label={t('moins')}>-</Minus> <Trans>Impôts</Trans>
							</th>
							{namedEngines.map(({ name, engine }) => (
								<td key={name}>
									{/* // TODO : color */}
									<StyledStatutTag statut={name} showIcon={false}>
										<Value
											expression="dirigeant . rémunération . impôt"
											engine={engine}
											unit="€/an"
											precision={0}
											displayedUnit="€"
											linkToRule={false}
										/>
									</StyledStatutTag>
								</td>
							))}
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<th scope="row">
								<Minus
									css={`
										opacity: 0;
									`}
									aria-hidden
								>
									-
								</Minus>{' '}
								<Trans>Revenu après impôt</Trans>
							</th>
							{namedEngines.map(({ name, engine }) => (
								<td key={name}>
									<StyledStatutTag statut={name} showIcon={false}>
										<Strong>
											<Value
												expression="dirigeant . rémunération . net . après impôt"
												engine={engine}
												unit="€/an"
												precision={0}
												displayedUnit="€"
												linkToRule={false}
											/>
										</Strong>
									</StyledStatutTag>
								</td>
							))}
						</tr>
					</tfoot>
				</StyledTable>
			</WrapperTable>
		</>
	)
}

const WrapperTable = styled.div`
	overflow: auto;
`

const StyledTable = styled.table`
	width: 100%;
	text-align: left;
	font-family: ${({ theme }) => theme.fonts.main};
	border-collapse: separate;
	border-spacing: 0.5rem;
	border: transparent;

	tr {
		border-spacing: ${({ theme }) => theme.spacings.md}!important;
	}

	th {
		color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.grey[200]
				: theme.colors.extended.grey[800]};
	}

	thead th {
		text-align: center;
		font-size: 0.75rem;
	}
	.table-title {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	/* color: ${({ theme }) => theme.colors.bases.secondary[600]};
  svg {
    fill: ${({ theme }) => theme.colors.bases.secondary[600]};
    margin-right: ${({ theme }) => theme.spacings.xxs};
  } */
	/* }
.table-title-ei {
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.publics.independant[600]};
  svg {
    fill: ${({ theme }) => theme.colors.publics.independant[600]};
    margin-right: ${({ theme }) => theme.spacings.xxs};
  }
}
.table-title-ae {
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.bases.tertiary[500]};
  svg {
    fill: ${({ theme }) => theme.colors.bases.tertiary[500]};
    margin-right: ${({ theme }) => theme.spacings.xxs};
  }
} */

	tbody th {
		font-weight: normal;
	}

	tbody tr:last-of-type td {
		padding-bottom: 0.5rem;
	}

	tfoot {
		position: relative;
	}

	tfoot:after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background-color: ${({ theme }) => theme.colors.extended.grey[500]};
	}
	tfoot td,
	tfoot th {
		padding-top: 1rem;
	}
`
const StyledStatutTag = styled(StatutTag)`
	width: 100%;
	justify-content: center;
	font-size: 0.75rem;
`

const StyledTag = styled(Tag)`
	width: 100%;
	justify-content: center;
	font-size: 0.75rem;
`

const Minus = styled.span`
	color: ${({ theme }) => theme.colors.bases.secondary[500]};
	margin-right: ${({ theme }) => theme.spacings.sm};
`

const StyledStrong = styled(Strong)`
	font-family: ${({ theme }) => theme.fonts.main};
`
