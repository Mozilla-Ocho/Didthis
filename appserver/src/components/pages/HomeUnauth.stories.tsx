import type { Meta, StoryObj } from '@storybook/react'

import { MockStoreWrapper } from "../../lib/store/mocks"
import HomeUnauth from './Home'

import '@/styles/globals.css'

const meta = {
  title: 'components/pages/HomeUnauth',
  component: HomeUnauth,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof HomeUnauth>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
  },
  render: args => (
    <MockStoreWrapper>
      <HomeUnauth {...args} />
    </MockStoreWrapper>
  ),
}
