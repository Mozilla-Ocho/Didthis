import type { Meta, StoryObj } from '@storybook/react'

import {
  MockStoreWrapper,
  MockStoreWrapperProps,
} from '../../mocks/store/storybook'
import apiClientDefault from '../../mocks/apiClient/storybook'
import authUser, { apiUserWithProject, apiUserBlankSlate } from '../../mocks/apiUser'
import apiProject from '../../mocks/apiProject'
import { ApiClient } from '../../lib/apiClient'

import StaticLayout from '../StaticLayout'
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
  render: args => (
    <MockStoreWrapper authUser={authUser} apiClient={apiClient}>
      <StaticLayout>
        <UserEdit {...args} />
      </StaticLayout>
    </MockStoreWrapper>
  ),
}

export const TrialAccountNoProjects: Story = {
  name: 'Trial (no projects)',
  render: args => (
    <MockStoreWrapper
      authUser={{ ...apiUserBlankSlate, isTrial: true }}
      apiClient={apiClient}
    >
      <StaticLayout>
        <UserEdit {...args} />
      </StaticLayout>
    </MockStoreWrapper>
  ),
}

export const TrialAccountWithProjects: Story = {
  name: 'Trial (with projects)',
  render: args => (
    <MockStoreWrapper
      authUser={{
        ...apiUserWithProject,
        isTrial: true,
      }}
      apiClient={apiClient}
    >
      <StaticLayout>
        <UserEdit {...args} />
      </StaticLayout>
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
