import { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Emoji } from '@/design-system'
import { useTheme } from '@/hooks/useDarkMode'

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <Container ref={dropdownRef}>
            <ToggleButton
                onClick={() => setIsOpen(!isOpen)}
                title="Changer de thème"
                aria-label="Changer de thème"
                $isOpen={isOpen}
            >
                <EmojiWrapper>
                    <Emoji emoji="🔦" />
                </EmojiWrapper>
            </ToggleButton>

            {isOpen && (
                <Dropdown>
                    <Option
                        onClick={() => {
                            setTheme('light')
                            setIsOpen(false)
                        }}
                        $isSelected={theme === 'light'}
                    >
                        <OptionContent>
                            <Emoji emoji="☀️" />
                            <span>Clair</span>
                        </OptionContent>
                        {theme === 'light' && <Emoji emoji="☑️" />}
                    </Option>

                    <Option
                        onClick={() => {
                            setTheme('dark')
                            setIsOpen(false)
                        }}
                        $isSelected={theme === 'dark'}
                    >
                        <OptionContent>
                            <Emoji emoji="🌙" />
                            <span>Sombre</span>
                        </OptionContent>
                        {theme === 'dark' && <Emoji emoji="☑️" />}
                    </Option>

                    <Option
                        onClick={() => {
                            setTheme('system')
                            setIsOpen(false)
                        }}
                        $isSelected={theme === 'system'}
                    >
                        <OptionContent>
                            <Emoji emoji="💻" />
                            <span>Système</span>
                        </OptionContent>
                        {theme === 'system' && <Emoji emoji="☑️" />}
                    </Option>
                </Dropdown>
            )}
        </Container>
    )
}

const Container = styled.div`
	position: relative;
	display: flex;
	align-items: center;
`

const ToggleButton = styled.button<{ $isOpen: boolean }>`
	background: none;
	border: none;
	cursor: pointer;
	padding: 0.5rem;
	border-radius: 0.5rem;
	transition: background-color 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;

	&:hover {
		background-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.dark[500]
				: theme.colors.bases.primary[100]};
	}

	${({ $isOpen, theme }) =>
		$isOpen &&
		css`
			background-color: ${theme.darkMode
				? theme.colors.extended.dark[500]
				: theme.colors.bases.primary[100]};
		`}
`

const EmojiWrapper = styled.div`
	transform: rotate(90deg);
	font-size: 1.25rem;
	line-height: 1;
`

const Dropdown = styled.div`
	position: absolute;
	top: 100%;
	right: 0;
	margin-top: 0.5rem;
	width: 10rem;
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.dark[700]
			: theme.colors.bases.primary[100]};
	border-radius: 0.5rem;
	box-shadow:
		0 4px 6px -1px rgba(0, 0, 0, 0.1),
		0 2px 4px -1px rgba(0, 0, 0, 0.06);
	padding: 0.25rem;
	z-index: 50;
	border: 1px solid
		${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.dark[500]
				: theme.colors.bases.primary[200]};
`

const Option = styled.button<{ $isSelected: boolean }>`
	display: flex;
	width: 100%;
	align-items: center;
	justify-content: space-between;
	padding: 0.5rem;
	border-radius: 0.25rem;
	border: none;
	background: none;
	cursor: pointer;
	font-size: 0.875rem;
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[100]
			: theme.colors.extended.grey[800]};
	transition: background-color 0.2s;

	&:hover {
		background-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.dark[600]
				: theme.colors.bases.primary[200]};
	}

	${({ $isSelected, theme }) =>
		$isSelected &&
		css`
			background-color: ${theme.darkMode
				? theme.colors.extended.dark[600]
				: theme.colors.bases.primary[200]};
			font-weight: bold;
		`}
`

const OptionContent = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
`