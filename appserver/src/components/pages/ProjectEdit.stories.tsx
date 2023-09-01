import type { Meta, StoryObj } from '@storybook/react'
import { MockStoreWrapper } from '../../mocks/store/storybook'
import { apiUser, apiUserWithProject } from '../../mocks/apiUser'
import StaticLayout from '../StaticLayout'
import ProjectEditPage from './ProjectEdit'

import '@/styles/globals.css'

const meta = {
  title: 'components/pages/ProjectEdit',
  component: ProjectEditPage,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof ProjectEditPage>

export default meta

type Story = StoryObj<typeof meta>

const Subject = () => (
  <StaticLayout>
    <ProjectEditPage />
  </StaticLayout>
)

export const NotFound: Story = {
  render: () => (
    <MockStoreWrapper authUser={apiUser}>
      <Subject />
    </MockStoreWrapper>
  ),
}

const parametersProjectRoute = {
  nextjs: {
    router: {
      query: {
        projectId: 'project-8675309',
      }
    }
  }
};

export const Default: Story = {
  parameters: parametersProjectRoute,
  render: () => (
    <MockStoreWrapper authUser={apiUserWithProject}>
      <Subject />
    </MockStoreWrapper>
  ),
}

export const Trial: Story = {
  parameters: parametersProjectRoute,
  render: () => (
    <MockStoreWrapper authUser={{ ...apiUserWithProject, isTrial: true }}>
      <Subject />
    </MockStoreWrapper>
  ),
}
