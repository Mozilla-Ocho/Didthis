import type { Meta, StoryObj } from '@storybook/react'
import { MockStoreWrapper } from '../../mocks/store/storybook'
import authUser from '../../mocks/apiUser'
import project from '../../mocks/apiProject'

import { LogoutButton } from './LogoutButton'

import '@/styles/globals.css'

const meta = {
  title: 'components/auth/LogoutButton',
  component: LogoutButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof LogoutButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  render: args => (
    <MockStoreWrapper authUser={authUser}>
      <LogoutButton {...args} />
    </MockStoreWrapper>
  ),
}

export const TrialAccount: Story = {
  args: {},
  render: args => (
    <MockStoreWrapper authUser={{ ...authUser, isTrial: true }}>
      <LogoutButton {...args} />
    </MockStoreWrapper>
  ),
}
