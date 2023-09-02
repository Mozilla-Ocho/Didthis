import type { Meta, StoryObj } from '@storybook/react'
import { MockStoreWrapper, buildMockStore } from '../mocks/store/storybook'
import { StoreParams, StoreOverrides } from '../mocks/store/index'
import { KEY_TRIAL_ACCOUNT_CLAIMED } from '@/lib/store/store'
import { apiUserBlankSlate, apiUserWithProject } from '../mocks/apiUser'
import project from '../mocks/apiProject'

import { RemindersAndAlerts } from './RemindersAndAlerts'

import '@/styles/globals.css'

const meta = {
  title: 'components/RemindersAndAlerts',
  component: RemindersAndAlerts,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
  decorators: [
    Story => {
      window.sessionStorage.removeItem(KEY_TRIAL_ACCOUNT_CLAIMED)
      return <Story />
    },
  ],
} satisfies Meta<typeof RemindersAndAlerts>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  render: args => (
    <MockStoreWrapper authUser={{ ...apiUserBlankSlate }}>
      <RemindersAndAlerts {...args} />
    </MockStoreWrapper>
  ),
}

export const Trial: Story = {
  args: {},
  render: args => (
    <MockStoreWrapper authUser={{ ...apiUserBlankSlate, isTrial: true }}>
      <RemindersAndAlerts {...args} />
    </MockStoreWrapper>
  ),
}

export const TrialWithProjects: Story = {
  args: {},
  render: args => (
    <MockStoreWrapper authUser={{ ...apiUserWithProject, isTrial: true }}>
      <RemindersAndAlerts {...args} />
    </MockStoreWrapper>
  ),
}

export const TrialSignedUp: Story = {
  args: {},
  render: args => {
    window.sessionStorage.setItem(KEY_TRIAL_ACCOUNT_CLAIMED, 'true')
    return (
      <MockStoreWrapper authUser={{ ...apiUserWithProject }}>
        <RemindersAndAlerts {...args} />
      </MockStoreWrapper>
    )
  },
}
