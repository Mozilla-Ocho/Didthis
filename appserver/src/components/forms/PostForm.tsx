import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { useState } from 'react'
import { Button, Select, Textarea } from '../uiLib'
import { NextRouter, useRouter } from 'next/router'
import profileUtils from '@/lib/profileUtils'
import { getParamString } from '@/lib/nextUtils'

// XXX_SKELETON

const ProjectSelector = ({
  projectId,
  setProjectId,
}: {
  projectId: string
  setProjectId: (arg0: string) => void
}) => {
  const store = useStore()
  if (!store.user) return <></>
  const profile = store.user.profile
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProjectId(e.target.value)
  }
  if (!store.user) return <></>
  const nameAndId: [string, string][] = []
  Object.values(profile.projects).forEach(proj => {
    nameAndId.push([proj.title, proj.id])
  })
  nameAndId.sort((a, b) => {
    return profile.projects[a[1]].createdAt - profile.projects[b[1]].createdAt
  })
  nameAndId.unshift(['Create a new project', 'new'])
  return (
    <div>
      <p>Project:</p>
      <Select onChange={handleChange} value={projectId}>
        {nameAndId.map(nid => (
          <option key={nid[1]} value={nid[1]}>
            {nid[0]}
          </option>
        ))}
      </Select>
    </div>
  )
}

const PostForm = observer(() => {
  // const store = useStore();
  // XXX spinner
  const router = useRouter()
  const store = useStore()
  let defaultPid = getParamString(router, 'projectId')
  if (!(store.user && store.user.profile.projects[defaultPid]))
    defaultPid = 'new'
  const [post, setPost] = useState<ApiPost>(
    profileUtils.mkBlankSlatePost(defaultPid)
  )
  if (!store.user) return <></>
  const setProjectId = (pid: string) => {
    const upd = { ...post, projectId: pid }
    setPost(upd)
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    store.savePost(post).then(newPost => {
      if (!store.user) return
      console.log('ok done', newPost)
      router.push(
        `/user/${store.user.urlSlug}/project/${newPost.projectId}/post/${newPost.id}`
      )
    })
  }
  const setBlurb = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const upd = { ...post, description: e.target.value }
    setPost(upd)
  }
  // XXX validation
  const hasContent = (post.description || '').trim().length > 0
  return (
    <div>
      <form onSubmit={handleSubmit} method="POST">
        <label>post content:</label>
        <ProjectSelector
          projectId={post.projectId}
          setProjectId={setProjectId}
        />
        <Textarea
          placeholder="Write your update here..."
          name="blurb"
          value={post.description || ''}
          onChange={setBlurb}
        />
        <Button type="submit" disabled={!hasContent}>
          POST
        </Button>
      </form>
    </div>
  )
})

export default PostForm
