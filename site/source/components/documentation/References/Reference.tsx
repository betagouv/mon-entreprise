import { styled } from 'styled-components'

import { Grid, Link } from '@/design-system'
import { capitalise0 } from '@/utils'
import {
	AGIRC_ARRCO,
	ASSURANCE_MALADIE,
	ASSURANCE_RETRAITE,
	BOFIP,
	BOSS,
	BPI,
	CARCDSF,
	CPSTI,
	ECONOMIE_GOUV,
	ENTREPRENDRE_SERVICE_PUBLIC,
	FRANCE_TRAVAIL,
	IMPOTS_GOUV,
	LEGIFRANCE,
	SERVICE_PUBLIC,
	URSSAF,
} from '@/utils/logos'

export function Référence({ href, titre }: { href: string; titre: string }) {
	const domain = getDomain(href)

	return (
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
					aria-label={titre + ', nouvelle fenêtre'}
				>
					{capitalise0(titre)}
				</Link>
			</Grid>
			{domain in referencesImages && (
				<Grid
					item
					xs="auto"
					style={{
						textAlign: 'right',
					}}
				>
					<StyledImage
						src={referencesImages[domain as keyof typeof referencesImages]}
						alt=""
					/>
				</Grid>
			)}
		</Grid>
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
	'agirc-arrco.fr': AGIRC_ARRCO,
	'ameli.fr': ASSURANCE_MALADIE,
	'autoentrepreneur.urssaf.fr': URSSAF,
	'bofip.impots.gouv.fr': BOFIP,
	'boss.gouv.fr': BOSS,
	'bpifrance-creation.fr': BPI,
	'carcdsf.fr': CARCDSF,
	'economie.gouv.fr': ECONOMIE_GOUV,
	'entreprendre.service-public.fr': ENTREPRENDRE_SERVICE_PUBLIC,
	'francetravail.fr': FRANCE_TRAVAIL,
	'impots.gouv.fr': IMPOTS_GOUV,
	'lassuranceretraite.fr': ASSURANCE_RETRAITE,
	'legislation.lassuranceretraite.fr': ASSURANCE_RETRAITE,
	'legifrance.gouv.fr': LEGIFRANCE,
	'secu-independants.fr': CPSTI,
	'service-public.fr': SERVICE_PUBLIC,
	'urssaf.fr': URSSAF,
}

const getDomain = (link: string) =>
	(link.includes('://') ? link.split('/')[2] : link.split('/')[0]).replace(
		'www.',
		''
	)
