import type { Meta, StoryObj } from '@storybook/react'

import { MockStoreWrapper } from '../../mocks/store/storybook'
import mockApiClient from '../../mocks/apiClient/storybook'
import HomeUnauth from './Home'

import { action } from '@storybook/addon-actions'

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
  args: {},
  render: args => (
    <MockStoreWrapper>
      <HomeUnauth {...args} />
    </MockStoreWrapper>
  ),
}

export const WithSignupCode: Story = {
  args: {},
  render: args => (
    <MockStoreWrapper
      signupCodeInfo={{
        active: true,
        value: '1234',
        name: 'dev',
        envNames: ['dev'],
      }}
    >
      <HomeUnauth {...args} />
    </MockStoreWrapper>
  ),
}
