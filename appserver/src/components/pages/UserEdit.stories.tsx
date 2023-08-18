import type { Meta, StoryObj } from '@storybook/react'

import { MockStoreWrapper } from '../../mocks/store/storybook'
import apiClientDefault from '../../mocks/apiClient/storybook'
import authUser from "../../mocks/apiUser"
import { ApiClient } from '../../lib/apiClient'

import UserEdit from './UserEdit'

import { action } from '@storybook/addon-actions'

import '@/styles/globals.css'
import { SlugCheckWrapper } from '@/lib/apiConstants'

const meta = {
  title: 'components/pages/UserEdit',
  component: UserEdit,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof UserEdit>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  render: args => (
    <MockStoreWrapper authUser={authUser} apiClient={apiClient}>
      <UserEdit {...args} />
    </MockStoreWrapper>
  ),
}

export const TrialAccount: Story = {
  args: {},
  render: args => (
    <MockStoreWrapper
      authUser={{ ...authUser, isTrial: true }}
      apiClient={apiClient}
    >
      <UserEdit {...args} />
    </MockStoreWrapper>
  ),
}

const apiClient: ApiClient = {
  ...apiClientDefault,
  getSlugCheck: async ({ userSlug, provisionalName }) => {
    action('getSlugCheck')({ userSlug, provisionalName })
    const result: SlugCheckWrapper = {
      action: 'slugCheck',
      status: 200,
      success: true,
      payload: {
        check: {
          value: userSlug,
          available: true,
          valid: true,
        },
        currentSystem: authUser.systemSlug,
        source: 'system',
      },
    }
    return result
  },
}
