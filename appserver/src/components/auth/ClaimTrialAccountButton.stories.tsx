import type { Meta, StoryObj } from '@storybook/react'
import { MockStoreWrapper } from '../../mocks/store/storybook'
import authUser from '../../mocks/apiUser'
import project from '../../mocks/apiProject'

import { ClaimTrialAccountButton } from './ClaimTrialAccountButton'

import '@/styles/globals.css'

const meta = {
  title: 'components/auth/ClaimTrialAccountButton',
  component: ClaimTrialAccountButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof ClaimTrialAccountButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  render: args => (
    <MockStoreWrapper authUser={{ ...authUser, isTrial: true }}>
      <ClaimTrialAccountButton {...args} />
    </MockStoreWrapper>
  ),
}
