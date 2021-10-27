import { Grid } from '@mui/material'
import SocialIcon from 'Components/ui/SocialIcon'
import { Link } from 'DesignSystem/typography/link'
import styled from 'styled-components'

const Container = styled(Grid)`
	font-size: 1rem;
	font-family: ${({ theme }) => theme.fonts.main};
	text-transform: uppercase;
`

const Label = styled.div`
	font-weight: 700;
	place-self: center center;
`

const Title = styled.div`
	color: ${({ theme }) => theme.colors.bases.primary[700]};
	display: flex;
	align-items: center;
	height: 100%;

	justify-content: center;
	margin-top: 1rem;

	@media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
		margin-top: 0;
		justify-content: start;
	}
`

export const SocialLinks = () => (
	<Container container>
		<Grid item lg={3} xs={12}>
			<Title>Suivez-nous</Title>
		</Grid>
		<Grid item lg={3} xs={4}>
			<Link href="https://twitter.com/monentreprisefr">
				<SocialIcon media="twitter" />
				<Label>Twitter</Label>
			</Link>
		</Grid>
		<Grid item lg={3} xs={4}>
			<Link href="https://www.linkedin.com/company/mon-entreprise-fr/">
				<SocialIcon media="linkedin" />
				<Label>LinkedIn</Label>
			</Link>
		</Grid>
		<Grid item lg={3} xs={4}>
			<Link href="https://github.com/betagouv/mon-entreprise/">
				<SocialIcon media="github" />
				<Label>GitHub</Label>
			</Link>
		</Grid>
	</Container>
)
