import { Grid } from '@mui/material'
import SocialIcon from 'Components/ui/SocialIcon'
import { GenericButtonOrLinkProps } from 'DesignSystem/buttons/Button'
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

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.xl}) {
		margin-top: 0;
		justify-content: start;
	}
`

const SocialLink = styled(Link)<GenericButtonOrLinkProps>`
	display: flex;
	flex-direction: row;
`

export const SocialLinks = () => (
	<Container container>
		<Grid item lg={3} xs={12}>
			<Title>Suivez-nous</Title>
		</Grid>
		<Grid item lg={3} xs={4}>
			<SocialLink href="https://twitter.com/monentreprisefr">
				<SocialIcon media="twitter" />
				<Label>Twitter</Label>
			</SocialLink>
		</Grid>
		<Grid item lg={3} xs={4}>
			<SocialLink href="https://www.linkedin.com/company/mon-entreprise-fr/">
				<SocialIcon media="linkedin" />
				<Label>LinkedIn</Label>
			</SocialLink>
		</Grid>
		<Grid item lg={3} xs={4}>
			<SocialLink href="https://github.com/betagouv/mon-entreprise/">
				<SocialIcon media="github" />
				<Label>GitHub</Label>
			</SocialLink>
		</Grid>
	</Container>
)
