import { ReactNode } from 'react'

import { PageLayout } from '@/components/layout/PageLayout'

export default function MainLayout({ children }: { children: ReactNode }) {
	return <PageLayout>{children}</PageLayout>
}
