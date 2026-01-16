import { forwardRef } from 'react'
import FlipMove from 'react-flip-move'
import { styled } from 'styled-components'

import { StatutTag, StatutType } from '@/components/StatutTag'
import { H5, Li, Message, Ul } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/utils/publicodes/EngineContext'

const STATUTS = [
	'entreprise . catégorie juridique . EI . EI',
	'entreprise . catégorie juridique . EI . auto-entrepreneur',
	'entreprise . catégorie juridique . SARL . EURL',
	'entreprise . catégorie juridique . SARL . SARL',
	'entreprise . catégorie juridique . SAS . SAS',
	'entreprise . catégorie juridique . SAS . SASU',
	'entreprise . catégorie juridique . SELARL . SELARL',
	'entreprise . catégorie juridique . SELARL . SELARLU',
	'entreprise . catégorie juridique . SELAS . SELAS',
	'entreprise . catégorie juridique . SELAS . SELASU',
	'entreprise . catégorie juridique . association',
] as DottedName[]

export default function StatutsPossibles() {
	const engine = useEngine()

	const nonAvailableStatus = STATUTS.filter(
		(statut) => engine.evaluate({ '=': [statut, 'non'] }).nodeValue
	)

	const availableStatus = STATUTS.filter(
		(statut) => !nonAvailableStatus.includes(statut)
	)

	return (
		<StyledMessage>
			<H5 as="h2">Statuts disponibles</H5>

			<StyledUl $noMarker as={FlipMove} typeName="ul">
				{availableStatus.map((statut) => (
					<Statut key={statut} statut={statut} />
				))}
			</StyledUl>

			<H5 as="h2">Statuts non disponibles</H5>

			<StyledUl $noMarker as={FlipMove} typeName="ul">
				{nonAvailableStatus.map((statut) => (
					<Statut key={statut} statut={statut} />
				))}
			</StyledUl>
		</StyledMessage>
	)
}

const StyledMessage = styled(Message)`
	padding-top: 2rem;
	border: none;
	position: sticky;
	top: 1rem;
	border-radius: 0.5rem;
	background: ${({ theme }) =>
		theme.darkMode
			? theme.colors.bases.primary[400]
			: theme.colors.bases.primary[100]};

	/* cut the top right corner */
	clip-path: polygon(0 100%, 0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%);

	&:before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		width: 40px;
		height: 40px;
		background: ${({ theme }) => theme.colors.bases.primary[300]};
		border-bottom-left-radius: 0.5rem;
		/* css blue triangle */
		clip-path: polygon(
			-10px -10px,
			0 calc(100% + 10px),
			calc(100% + 10px) calc(100% + 10px)
		);
	}
`

const Statut = forwardRef(function Statut(
	{ statut }: { statut: DottedName },
	ref: React.Ref<HTMLLIElement>
) {
	const engine = useEngine()
	const disabled = engine.evaluate({ '=': [statut, 'non'] }).nodeValue === true

	const acronyme = (engine.getRule(statut).rawNode.acronyme ??
		engine.getRule(statut).title.toLocaleLowerCase()) as StatutType

	return (
		<Li ref={ref} className={disabled ? 'disabled' : ''}>
			<StyledSpan>{engine.getRule(statut).title}</StyledSpan>
			<StatutTag statut={acronyme} text="acronym" showIcon />
		</Li>
	)
})

const StyledSpan = styled.span``

const StyledUl = styled(Ul)`
	${Li} {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: ${({ theme }) => theme.colors.extended.grey[100]};
		border-radius: ${({ theme }) => theme.box.borderRadius};
		padding: ${({ theme }) => theme.spacings.sm};

		${StyledSpan} {
			color: ${({ theme }) => theme.colors.bases.primary[700]};
			font-weight: bold;
		}

		&.disabled {
			background: ${({ theme }) => theme.colors.extended.grey[200]};
			${StyledSpan} {
				color: ${({ theme }) => theme.colors.extended.grey[600]};
				font-weight: bold;
				text-decoration-line: line-through;
			}
		}
	}
`
