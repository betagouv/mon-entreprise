import styled from 'styled-components'

export default styled.div`
	width: 100%;
	margin-right: auto;
	margin-left: auto;

	@media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
		padding-left: 16px;
		padding-right: 16px;
	}

	@media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
		padding-left: 16px;
		padding-right: 16px;
		max-width: 576px;
	}

	@media (min-width: ${({ theme }) => theme.breakpoints.md}) {
		padding-left: 24px;
		padding-right: 24px;
		max-width: 768px;
	}

	@media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
		padding-left: 24px;
		padding-right: 24px;
		max-width: 992px;
	}

	@media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
		padding-left: 24px;
		padding-right: 24px;
		max-width: 1200px;
	}
`
