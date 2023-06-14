import { observer } from 'mobx-react-lite'
import { useStore } from '@/lib/store'
import { useState } from 'react'
import { Button, Input, Select, Textarea } from '../uiLib'
import { useRouter } from 'next/router'
import { getParamString } from '@/lib/nextUtils'
import pathBuilder from '@/lib/pathBuidler'
import {makeAutoObservable, action } from 'mobx'
import { debounce } from 'lodash-es'
import apiClient from '@/lib/apiClient'
import log from '@/lib/log'
import {ApiError} from '@/lib/apiCore'
import LinkPreview from '../LinkPreview'

  // const mkBlankSlatePost = (projectId: 'new' | string): ApiPost => {
  //   const seconds = Math.floor(new Date().getTime() / 1000)
  //   return {
  //     id: 'new', // assigned on save
  //     createdAt: seconds, // asigned on save
  //     updatedAt: seconds, // asigned on save
  //     projectId: projectId, // assigned on save if "new"
  //     scope: 'public',
  //     description: '',
  //   }
  // }
class PostStore {
  description = ""
  scope: ApiScope = "public"
  projectId: ApiProjectId | "new" = "new"
  linkUrl = ""
  fetchingUrl = ""
  fetching = false
  error : false | 'bad_url' | 'remote_fetch' | 'other' = false
  urlMeta : ApiUrlMeta | false = false
  fetchUrlMetaAndUpdateDebounced: () => void

  constructor() {
    this.fetchUrlMetaAndUpdateDebounced = debounce(this.fetchUrlMetaAndUpdate, 1000, {
      // leading=true because i assume they'll copy+paste the url in one event, so
      // start right away
      leading: true,
    });
    makeAutoObservable(this, {
      fetchUrlMetaAndUpdateDebounced: false
    })
  }

  setDescription(x:string) {
    this.description = x
  }
  setProjectId(x:string) {
    this.projectId = x
  }
  setScope(x:ApiScope){
    this.scope = x
  }


  setUrlWithSideEffects(x: string) {
    this.linkUrl = x
    this.fetchUrlMetaAndUpdateDebounced()
  }

  fetchUrlMetaAndUpdate() : void {
    const url = this.linkUrl
    if (url.trim() === "") {
      this.fetching = false
      this.fetchingUrl = ""
      this.error = false
      this.urlMeta = false
      return
    }
    try {
      // validation is done on the server in a more complete fashion but this
      // also reduces api calls if we know in advance the url isn't worth
      // fetching
      const check = new URL(url)
      if (check.protocol !== 'https:' && check.protocol !== 'http:') {
        throw new Error('bad proto');
      }
    } catch(e) {
      this.fetching = false
      this.fetchingUrl = ""
      this.error = 'bad_url'
      this.urlMeta = false
      return
    }
    this.fetchingUrl = url
    this.fetching = true
    apiClient.getUrlMeta({ url }).then(action(wrapper => {
      this.fetchingUrl = ""
      this.fetching = false
      this.error = false
      this.urlMeta = wrapper.payload.urlMeta
    })).catch(err => {
      log.error('error fetching url', {url,err})
      this.error = 'other'
      if (err instanceof ApiError) {
        if (err.apiInfo?.errorId === "ERR_BAD_INPUT") {
          this.error = 'bad_url'
        }
        if (err.apiInfo?.errorId === "ERR_REMOTE_FETCH_FAILED") {
          this.error = 'remote_fetch'
        }
      }
      this.urlMeta = false
    })
  }

  getApiPost() : ApiPost {
    const seconds = Math.floor(new Date().getTime() / 1000)
    return {
      id: 'new', // assigned on save
      createdAt: seconds, // asigned on save
      updatedAt: seconds, // asigned on save
      projectId: this.projectId, // assigned on save if "new"
      scope: 'public',
      description: this.description.trim(),
      linkUrl: this.linkUrl && this.linkUrl.trim() ? this.linkUrl.trim() : undefined,
      urlMeta: this.urlMeta ? this.urlMeta : undefined,
    }
  }
}


const ProjectSelector = observer(({
  postStore,
}: {
  postStore: PostStore
}) => {
  const store = useStore()
  if (!store.user) return <></>
  const profile = store.user.profile
  const handleChangeProject = (e: React.ChangeEvent<HTMLSelectElement>) => {
    postStore.setProjectId(e.target.value)
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
      <Select onChange={handleChangeProject} value={postStore.projectId}>
        {nameAndId.map(nid => (
          <option key={nid[1]} value={nid[1]}>
            {nid[0]}
          </option>
        ))}
      </Select>
    </div>
  )
})

const DescriptionField = observer(({
  postStore,
}: {
  postStore: PostStore
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    postStore.setDescription(e.target.value)
  }
  return (
    <>
      <label>
        description:
        <Textarea
          placeholder="Write your update here..."
          name="description"
          value={postStore.description}
          onChange={handleChange}
        />
      </label>
    </>
  )
})

const LinkField = observer(({
  postStore,
}: {
  postStore: PostStore
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    postStore.setUrlWithSideEffects(e.target.value)
  }
  return (
    <>
      <label>
        link:
        <Input
          type="text"
          name="linkUrl"
          value={postStore.linkUrl}
          onChange={handleChange}
        />
        <LinkPreview loading={postStore.fetching} error={postStore.error} urlMeta={postStore.urlMeta} linkUrl={postStore.linkUrl} />
        <p>fetching: {JSON.stringify(postStore.fetching)}</p>
        <p>urlMeta: {JSON.stringify(postStore.urlMeta)}</p>
        <p>error: {JSON.stringify(postStore.error)}</p>
      </label>
    </>
  )
})

const PostForm = observer(() => {
  // const store = useStore();
  // XXX spinner
  const router = useRouter()
  const store = useStore()
  let defaultPid = getParamString(router, 'projectId')
  if (!(store.user && store.user.profile.projects[defaultPid]))
    defaultPid = 'new'
  const [postStore] = useState(() => new PostStore())
  if (!store.user) return <></>
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    store.savePost(postStore.getApiPost()).then(newPost => {
      if (!store.user) return
      console.log('ok done', newPost)
      router.push(
        pathBuilder.post(store.user.urlSlug, newPost.projectId, newPost.id)
      )
    })
  }
  // XXX validation
  const hasContent = (postStore.description).trim().length > 0
  return (
    <div>
      <form onSubmit={handleSubmit} method="POST">
        <label>post content:</label>
        <ProjectSelector
          postStore={postStore}
        />
        <DescriptionField postStore={postStore} />
        <LinkField postStore={postStore} />
        <Button type="submit" disabled={!hasContent}>
          POST
        </Button>
      </form>
    </div>
  )
})

export default PostForm
