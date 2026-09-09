import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

import './test/modele-social/matchers/toEvaluate'

afterEach(() => {
	cleanup()
})
