import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

import { declareLanguage } from '@/services/applicationLanguage'

import './test/matchers/toEvaluate'

declareLanguage('fr')

afterEach(() => {
	cleanup()
})
