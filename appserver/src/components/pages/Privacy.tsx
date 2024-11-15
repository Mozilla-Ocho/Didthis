import { PagePad } from '@/components/uiLib'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'
import RemindersAndAlerts from '../RemindersAndAlerts'
import PageTitle from '../PageTitle'
import { useAppShellTopBar } from '@/lib/appShellContent'

const Privacy = () => {
  const store = useStore()
  store.useTrackedPageEvent(trackingEvents.pvTerms)

  useAppShellTopBar({
    show: true,
    title: "",
    leftIsBack: true,
    leftLabel: 'Back',
    onLeftPress: () => store.goBack(),
  })

  return (
    <>
      <RemindersAndAlerts />
      <PagePad semiWide>
        <PageTitle title="Privacy Notice" />
        <div className="prose text-md text-bodytext">
          <h4>Privacy Notice</h4>
          <p>
            <em>Last Updated: June 29, 2023.</em>
            <br />
            <br />
          </p>
          <h3>At Mozilla, we design products with your privacy in mind.</h3>
          <p>
            We care about your privacy. The{' '}
            <a href="https://www.mozilla.org/privacy/">
              Mozilla Privacy Policy
            </a>{' '}
            describes how we handle any information that we collect about you.
            This Privacy Notice provides more information about what data
            Didthis collects and shares, and why.
          </p>
          <h3>Things you should know:</h3>
          <h4>Information we collect</h4>
          <p>
            <strong>Account information</strong>. In order to sign up for
            Didthis, you will need to provide us your email address and create a
            unique username and password for the Didthis account. We may contact
            you at the email address associated with your Didthis account about
            issues with your Didthis account, or with the service as a whole.
          </p>
          <p>
            You may also choose to enter additional profile information, such as
            a real name, a photo, and a biography or description, which will be
            viewable to anyone in the public who views your account. We will
            store the information you provide.
          </p>
          <p>
            <strong>Post Information</strong>. We maintain data about your
            activity on Didthis, including the content that you post to Didthis,
            your platform interactions, and any other information that you share
            publicly. The content you post on your Didthis webpage will, by
            default, be private and accessible only by you. If you choose to
            make your Didthis webpage publicly available by switching your
            Didthis webpage from “private” to “public”, the URL of your Didthis
            webpage will be publicly visible and can be accessible by other
            Didthis users or anyone else who visits your Didthis webpage.
          </p>
          <p>
            When you post content on your Didthis webpage, we store information
            about the date and time the post was created, and the device that it
            was posted from.
          </p>
          <p>
            <strong>Interaction data</strong>. Mozilla receives data about your
            interactions with Didthis, including when you log in and out, and
            the preferences you set. In addition to the information that you
            provide, such as the content you post to your Didthis webpage, we
            also receive information about your activity on Didthis, including
            your clicks and impressions. We may collect this interaction data
            through third parties, such as Amplitude and Google Analytics.
          </p>
          <p>
            We use the information that we collect for several purposes,
            including to:
          </p>
          <ul>
            <li>Provide the Didthis service;</li>
            <li>
              Learn how you and others are using Didthis to make improvements;
            </li>
            <li>
              Find and remove content and users that violate our policies;
            </li>
            <li>Send you information about changes to the service;</li>
            <li>
              Improve our security and trust & safety practices for you and
              other users;
            </li>
            <li>
              Fulfill any purpose that you have expressly authorized (for
              example, to contact you about a specific issue).
            </li>
          </ul>
          <p>
            <strong>Policy enforcement data</strong>. We will store data about
            any Terms of Service violations that you report, or that other
            people report about your account - including the reports themselves,
            data about the violations, and any related correspondence. If you
            submit a report about someone else’s violation, we will gather and
            store data related to that report (including the technical details
            and contents of that report, your contact information, any follow up
            interactions or decisions, and information about the adjudication of
            any disputes). We may also use this enforcement data to prevent
            abuse or to respond to future violations, and may share reporter or
            user data with third parties where it is required by law or
            necessary to enforce our policies
          </p>
          <p>
            <strong>Location information</strong>. Didthis receives your IP
            address when you sign up for and use the service. The latest IP
            address that you used is stored for up to 90 days. We may also
            retain server logs that store the IP address of every request made
            to our server.
          </p>
          <p>
            Except as indicated above, Didthis does not share any of your
            personal data with third parties. However, such data may become
            accessible to third parties when you publish it online.
          </p>
        </div>
      </PagePad>
    </>
  )
}

export default Privacy
