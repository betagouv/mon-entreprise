'use client'

import { createContext } from 'react'

import { NavigationAPI } from './NavigationAPI'

export const NavigationContext = createContext<NavigationAPI | null>(null)
