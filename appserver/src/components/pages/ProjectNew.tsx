import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import ProjectForm from '../forms/ProjectForm'
import { PagePad } from '@/components/uiLib'
import Breadcrumbs from '../Breadcrumbs'
import { trackingEvents } from '@/lib/trackingEvents'
import PageTitle from '../PageTitle'
import RemindersAndAlerts from '../RemindersAndAlerts'

const NewProjectPage = observer(() => {
  const store = useStore()
  store.useTrackedPageEvent(trackingEvents.pvNewProject)
  return (
    <>
      <PageTitle title="New project" />
      <Breadcrumbs crumbs={[{ name: 'New project' }]} />
      <RemindersAndAlerts/>
      <PagePad>
        <h3>Create a project</h3>
        <div className="pt-8" />
        <ProjectForm mode="new" />
      </PagePad>
    </>
  )
})

export default NewProjectPage
