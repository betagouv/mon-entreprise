import styled from 'styled-components'

type UlProps = {
	small?: boolean
}
export const Ul = styled.ul<UlProps>`
	color: ${({ theme }) => theme.colors.bases.primary[800]};
	font-family: ${({ theme }) => theme.fonts.main};
	font-size: ${({ small }) => (small ? '0.875rem' : '1rem')};
	line-height: ${({ small }) => (small ? '1.25rem' : '1.5rem')};
`
export const Li = styled.li``
