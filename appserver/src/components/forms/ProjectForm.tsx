import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { Select, Input, Textarea, Button } from '@/components/uiLib'
import { useState } from 'react'
import profileUtils from '@/lib/profileUtils'
import pathBuilder from '@/lib/pathBuidler'
import {useRouter} from 'next/router'

// XXX_SKELETON

const ProjectForm = observer(
  ({ mode, project }: { mode: 'edit' | 'new'; project?: ApiProject }) => {
    const router = useRouter()
    const store = useStore()
    const user = store.user
    if (!user) return <></>
    const [data, setData] = useState<ApiProject>(() => {
      if (project) {
        return JSON.parse(JSON.stringify(project)) as ApiProject
      } else {
        const profile = JSON.parse(JSON.stringify(user.profile)) as ApiProfile
        const r = profileUtils.mkNewProject(profile)
        return r.project
      }
    })
    if (!store.user) return <></>
    const handleSubmit = (e: React.FormEvent) => {
      e.stopPropagation()
      e.preventDefault()
      store.saveProject(data).then(newProject => {
        if (!store.user) return
        router.push( pathBuilder.project(store.user.urlSlug, newProject.id))
      })
    }
    const setTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
      const upd = { ...data, title: e.target.value }
      setData(upd)
    }
    const setDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const upd = { ...data, description: e.target.value }
      setData(upd)
    }
    const setVisibility = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const upd = { ...data, scope: e.target.value as Scope }
      setData(upd)
    }
    const setStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const upd = { ...data, currentStatus: e.target.value as ProjectStatus }
      setData(upd)
    }
    const valid = !!data.title.trim()
    return (
      <div>
        <form onSubmit={handleSubmit} method="POST">
          <div>
            <label htmlFor="title">
              title:
              <Input
                type="text"
                id="title"
                name="title"
                value={data.title || ''}
                onChange={setTitle}
                className="w-full"
                error={valid ? false : "required"}
              />
            </label>
          </div>
          <div>
            <label htmlFor="description">
              description:
              <Textarea
                placeholder=""
                id="description"
                name="description"
                value={data.description || ''}
                onChange={setDescription}
              />
            </label>
          </div>
          <div>
            <label htmlFor="visibility">
              visibility:
              <Select id="visibility" onChange={setVisibility} value={data.scope}>
                <option key="public" value="public">
                  public
                </option>
                <option key="private" value="private">
                  private
                </option>
              </Select>
            </label>
          </div>
          <div>
            <label htmlFor="status">
              status:
              <Select id="status" onChange={setStatus} value={data.currentStatus}>
                <option key="active" value="active">
                  active
                </option>
                <option key="complete" value="complete">
                  complete
                </option>
                <option key="paused" value="paused">
                  paused
                </option>
              </Select>
            </label>
          </div>
          <Button type="submit" disabled={!valid}>
            Save
          </Button>
        </form>
      </div>
    )
  }
)

export default ProjectForm
