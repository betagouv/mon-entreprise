'use client'

import { ReactNode } from 'react'
import { styled } from 'styled-components'

import Footer from '@/components/layout/Footer/Footer'
import Header from '@/components/layout/Header'
import { Container } from '@/design-system'

export function PageLayout({ children }: { children: ReactNode }) {
	return (
		<StyledLayout>
			<Header />

			<StyledMain role="main" id="main">
				<Container>{children}</Container>
			</StyledMain>

			<Footer />
		</StyledLayout>
	)
}

const StyledLayout = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	min-height: 100vh;
`

const StyledMain = styled.main`
	flex: 1;
	display: flex;
	flex-direction: column;
`
