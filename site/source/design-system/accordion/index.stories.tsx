import { Meta, StoryObj } from '@storybook/react'
import { ComponentProps } from 'react'
import { Item } from 'react-stately'

import { Message } from '../message'
import { H2 } from '../typography'
import { Body } from '../typography/paragraphs'
import { Accordion } from './'

const meta: Meta<typeof Accordion> = {
	component: Accordion,
}

export default meta

type Story = StoryObj<typeof Accordion>

export const Basic: Story = {
	render: (args: ComponentProps<typeof Accordion>) => (
		<Accordion {...args}>
			<Item key="lorem-ipsum" title="Lorem ipsum" hasChildItems={false}>
				<Body>
					Nam ipsum doloribus non. Deserunt consequatur quam consectetur odio.
					Dolor eos est et omnis quas nulla repellat. Velit voluptate sequi et
					voluptatibus sed dolorem dolorum.
				</Body>
				<Body>
					Totam et reprehenderit aliquam hic dolorum ipsum. Iste et neque eos
					voluptas deserunt harum. Mollitia numquam incidunt nihil laboriosam.
					Error autem possimus quaerat veniam ut explicabo ut. Error esse est
					reprehenderit quae dolor occaecati quas laboriosam.
				</Body>
			</Item>
			<Item
				key="eligendi-et-voluptatem"
				title="Eligendi et voluptatem"
				hasChildItems={false}
			>
				<Body>
					Qui tempora tenetur eum voluptatibus sit et assumenda fuga. Temporibus
					hic ut in maxime omnis esse et nam. Aliquam veritatis perferendis quia
					enim dolorem molestiae. Impedit eaque optio iste. Eligendi et
					voluptatem voluptate corporis perferendis.
				</Body>
			</Item>
		</Accordion>
	),
	args: {
		defaultExpandedKeys: ['lorem-ipsum'],
	},
}

export const AvecTitreEtBanner: Story = {
	render: (args: ComponentProps<typeof Accordion>) => (
		<Accordion
			{...args}
			title={<H2>Ceci est un titre</H2>}
			banner={
				<Message type="info">
					<Body>Ceci est une bannière</Body>
				</Message>
			}
		>
			<Item key="lorem-ipsum" title="Lorem ipsum" hasChildItems={false}>
				<Body>
					Nam ipsum doloribus non. Deserunt consequatur quam consectetur odio.
					Dolor eos est et omnis quas nulla repellat. Velit voluptate sequi et
					voluptatibus sed dolorem dolorum.
				</Body>
				<Body>
					Totam et reprehenderit aliquam hic dolorum ipsum. Iste et neque eos
					voluptas deserunt harum. Mollitia numquam incidunt nihil laboriosam.
					Error autem possimus quaerat veniam ut explicabo ut. Error esse est
					reprehenderit quae dolor occaecati quas laboriosam.
				</Body>
			</Item>
			<Item
				key="eligendi-et-voluptatem"
				title="Eligendi et voluptatem"
				hasChildItems={false}
			>
				<Body>
					Qui tempora tenetur eum voluptatibus sit et assumenda fuga. Temporibus
					hic ut in maxime omnis esse et nam. Aliquam veritatis perferendis quia
					enim dolorem molestiae. Impedit eaque optio iste. Eligendi et
					voluptatem voluptate corporis perferendis.
				</Body>
			</Item>
		</Accordion>
	),
	args: {
		defaultExpandedKeys: ['lorem-ipsum'],
	},
}
