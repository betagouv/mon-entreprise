import { DottedName } from 'modele-social'
import { utils } from 'publicodes'
import { styled } from 'styled-components'

import { useEngine } from '@/components/utils/EngineContext'
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
	const parentRefences =
		engine.baseContext.parsedRules[parentRule].rawNode.références
	/* TODO à remplacer une fois que https://github.com/publicodes/publicodes/issues/613
	 *  par un truc plus propre du genre const parentReferences = engine.dev.getRule(parentRule).références
	 */

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
							alt=""
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
	'agirc-arrco.fr': '/références-images/agirc-arrco.jpg',
	'ameli.fr': '/références-images/ameli.svg',
	'autoentrepreneur.urssaf.fr': '/références-images/urssaf.svg',
	'bofip.impots.gouv.fr': '/références-images/bofip.impots.gouv.jpg',
	'boss.gouv.fr': '/références-images/boss.svg',
	'bpifrance-creation.fr': '/références-images/bpifrance-creation.svg',
	'economie.gouv.fr': '/références-images/economie.gouv.png',
	'entreprendre.service-public.fr':
		'/références-images/entreprendre.service-public.jpg',
	'francetravail.fr': '/références-images/france-travail.svg',
	'impots.gouv.fr': '/références-images/impots.gouv.svg',
	'lassuranceretraite.fr': '/références-images/lassuranceretraite.svg',
	'legislation.lassuranceretraite.fr':
		'/références-images/lassuranceretraite.svg',
	'legifrance.gouv.fr': '/références-images/legifrance.svg',
	'secu-independants.fr': '/références-images/cpsti.svg',
	'service-public.fr': '/références-images/service-public.svg',
	'urssaf.fr': '/références-images/urssaf.svg',
}

const getDomain = (link: string) =>
	(link.includes('://') ? link.split('/')[2] : link.split('/')[0]).replace(
		'www.',
		''
	)
