import { DottedName } from 'modele-social'
import { utils } from 'publicodes'
import { useContext } from 'react'
import { styled } from 'styled-components'

import { EngineContext, useEngine } from '@/components/utils/EngineContext'
import { Grid } from '@/design-system/layout'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { capitalise0 } from '@/utils'

export function References({
	references,
	dottedName,
}: {
	references?: Record<string, string>
	dottedName?: DottedName | undefined
}): JSX.Element | null {
	const engine = useEngine()

	if (!dottedName && !references) {
		return null
	}

	if (references) {
		return (
			<Ul>
				{Object.entries(references).map(([title, href]) => (
					<Reference key={href} title={title} href={href} />
				))}
			</Ul>
		)
	}

	// If no reference, check if parent has some that we could use
	const parentRule = utils.ruleParent(dottedName as string) as DottedName
	if (!parentRule) {
		return null
	}
	const parentRefences = engine.getRule(parentRule).rawNode.références
	if (!parentRefences) {
		return null
	}

	return (
		<Ul>
			{Object.entries(parentRefences).map(([title, href]) => (
				<Reference key={href} title={title} href={href} />
			))}
		</Ul>
	)
}

function Reference({ href, title }: { href: string; title: string }) {
	const domain = getDomain(href)

	return (
		<Li key={href}>
			<Grid
				container
				spacing={2}
				style={{
					display: 'inline-flex',
				}}
			>
				<Grid item xs={12} sm="auto">
					<Link
						href={href}
						style={{
							display: 'flex',
						}}
					>
						{capitalise0(title)}
					</Link>
				</Grid>
				<Grid
					item
					xs="auto"
					style={{
						textAlign: 'right',
					}}
				>
					{domain in referencesImages && (
						<StyledImage
							src={referencesImages[domain as keyof typeof referencesImages]}
							alt={`logo du site ${domain}`}
						/>
					)}
				</Grid>
			</Grid>
		</Li>
	)
}

const StyledImage = styled.img`
	border: 1px solid ${({ theme }) => theme.colors.extended.grey[400]};
	padding: ${({ theme }) => theme.spacings.xs};
	top: -${({ theme }) => theme.spacings.xs};
	position: relative;

	max-width: 100%;
	border-radius: ${({ theme }) => theme.box.borderRadius};
	background-color: ${({ theme }) => theme.colors.extended.grey[100]};

	max-height: 2.25rem;
`
const referencesImages = {
	'service-public.fr': '/références-images/service-public.png',
	'impots.gouv.fr': '/références-images/impots.gouv.svg',
	'entreprendre.service-public.fr':
		'/références-images/entreprendre.service-public.png',
	'legifrance.gouv.fr': '/références-images/marianne.png',
	'urssaf.fr': '/références-images/Urssaf.svg',
	'autoentrepreneur.urssaf.fr': '/références-images/Urssaf.svg',
	'secu-independants.fr': '/références-images/Urssaf.svg',
	'gouv.fr': '/références-images/marianne.png',
	'agirc-arrco.fr': '/références-images/agirc-arrco.png',
	'pole-emploi.fr': '/références-images/pole-emploi.png',
	'ladocumentationfrançaise.fr':
		'/références-images/ladocumentationfrançaise.png',
	'senat.fr': '/références-images/senat.png',
	'ameli.fr': '/références-images/ameli.png',
	'bpifrance-creation.fr': '/références-images/bpi-création.png',
	'economie.gouv.fr': '/références-images/economie.gouv.png',
}

const getDomain = (link: string) =>
	(link.includes('://') ? link.split('/')[2] : link.split('/')[0]).replace(
		'www.',
		''
	)

export function RuleReferences({ dottedNames }: { dottedNames: DottedName[] }) {
	const engine = useContext(EngineContext)

	return (
		<Ul>
			{dottedNames
				.filter(
					(dottedName) => engine.evaluate(`${dottedName} != non`).nodeValue
				)
				.map((dottedName) =>
					Object.entries(
						engine.getRule(dottedName).rawNode.références ?? {}
					).map(([title, href]) => (
						<Reference key={href} title={title} href={href} />
					))
				)}
		</Ul>
	)
}
