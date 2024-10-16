import { Link, PagePad } from '@/components/uiLib'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import PageTitle from '../PageTitle'
import { useAppShellTopBar } from '@/lib/appShellContent'
import PathBuilder from '@/lib/pathBuilder'

const Sunset = () => {
  const store = useStore()
  store.useTrackedPageEvent(trackingEvents.pvSupport)

  useAppShellTopBar({
    show: true,
    title: '',
    leftIsBack: true,
    leftLabel: 'Back',
    onLeftPress: () => store.goBack(),
  })

  const settingsLink = store.user ? (
    <Link href={PathBuilder.userEdit(store.user.systemSlug)}>
      account details
    </Link>
  ) : (
    <span>account details</span>
  )

  return (
    <>
      <PagePad semiWide>
        <PageTitle title="Didthis Sunset" />
        <div className="prose text-md text-bodytext">
          <h3>Didthis Sunset Announcement</h3>
          <p>October 15, 2024</p>
          <p>Dear Didthis Community,</p>
          <p>
            We are sad to announce that Didthis will be shutting down on
            November 15th. This includes the Didthis app, website, and Discord.
            We understand that this may come as unexpected news, and we’re
            incredibly grateful for the time you’ve spent with us sharing your
            projects with the Didthis community.
          </p>

          <p>
            We’ve been inspired by the wonderful projects you shared — whether
            it was documenting hikes through breathtaking national forests,
            crocheting everything under the sun, or even building your own
            furniture from scratch. In a world increasingly shaped by generative
            AI and the impersonal nature of technology, your creativity is a
            refreshing reminder of what truly connects us. It’s been a breath of
            fresh air, showing us that the things that bring us joy are still
            rooted in genuine human connection.
          </p>

          <p>
            We believe the vision for Didthis - a healthy space for hobbyists to
            capture and share their projects - is valuable and important.
            However, we weren’t able to find a path forward for Didthis in the
            Mozilla ecosystem at this time.
          </p>

          <p>
            As we prepare to close this chapter, we want to ensure that you have
            time to export your data before the shutdown. To download a copy of
            your data, simply navigate to {settingsLink}, find the “Account data
            export” section at the bottom of this page, and click “Export
            account”. Your data will then be packaged up and made available as a
            link to a ZIP file on that same page.
          </p>

          <p>This zip will include:</p>
          <ul>
            <li>All your images</li>
            <li>All your projects and project updates in HTML + CSS</li>
            <li>
              Your profile and project data, public & private, in JSON form
            </li>
            <li>The Didthis logo in SVG form</li>
          </ul>
          <p>
            Please note that this data is provided in a raw format (JSON and
            HTML) which can be opened directly with your web-browser of choice,
            but may require technical skills to use for any other purpose.{' '}
          </p>

          <p>
            We will also be open sourcing the code behind Didthis. Mozilla is a
            leader in the open source community, and sharing our work is one of
            our most closely held values. We hope this code will be interesting
            or helpful to others.
          </p>

          <p>
            Thank you for being a part of this journey with us. It has been a
            privilege to support you, and we’ll always be thankful for the
            community we’ve built together.
          </p>

          <p>
            With gratitude,
            <br />
            Josh, Les, Kate, Amy, and Stephen
          </p>
        </div>
      </PagePad>
    </>
  )
}

export default Sunset
