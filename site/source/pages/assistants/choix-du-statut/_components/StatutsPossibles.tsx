import { DottedName } from 'modele-social'
import { forwardRef } from 'react'
import FlipMove from 'react-flip-move'
import styled from 'styled-components'

import { StatutTag, StatutType } from '@/components/StatutTag'
import { useEngine } from '@/components/utils/EngineContext'
import { Message } from '@/design-system'
import { H5 } from '@/design-system/typography/heading'
import { Li, Ul } from '@/design-system/typography/list'
import { SmallBody } from '@/design-system/typography/paragraphs'

export default function StatutsPossibles() {
	const engine = useEngine()
	const statuts = [
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
	].sort(
		(a, b) =>
			(engine.evaluate({ '=': [a, 'non'] }).nodeValue ? 1 : -1) -
			(engine.evaluate({ '=': [b, 'non'] }).nodeValue ? 1 : -1)
	) as DottedName[]

	return (
		<StyledMessage>
			<H5 as="h2"> Statuts disponibles</H5>
			<SmallBody>
				Les statuts disponibles diffèrent en fonction de l'activité
				professionnelle que vous exercez
			</SmallBody>

			<StyledUl noMarker as={FlipMove} typeName="ul">
				{statuts.map((statut) => (
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
	top: 0;
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
