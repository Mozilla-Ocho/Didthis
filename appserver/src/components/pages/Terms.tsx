import { PagePad } from '@/components/uiLib'
import { useStore } from '@/lib/store'
import { trackingEvents } from '@/lib/trackingEvents'

const Terms = () => {
  const store = useStore()
  store.useTrackedPageEvent(trackingEvents.pvTerms)
  return (
    <PagePad semiWide>
      <div className="prose text-md text-bodytext">
        <h3>Didthis Terms of Service</h3>
        <p><em>Last Updated: June 29, 2023.</em><br/><br/></p>
        <p>Didthis is a platform that allows you to document and share your hobbies and projects (“Didthis”). Didthis is currently in the beta phase and is available for select beta users only.</p>
        <p>Please read these Terms of Service (the “Terms”) carefully because they explain important information about your use of Didthis. By using Didthis, you agree to be bound by these Terms, the <a href="/privacy">Privacy Notice</a>, and the <a href="/content">Didthis Content Policies</a>. If you agree to these Terms on behalf of an entity, such as your employer, you represent that you are authorized to and intend to bind that entity.</p>
        <h4>You’ll Need A Didthis Account</h4>
        <p>To use Didthis, you will need to create a Didthis account, which requires you to provide your email address and create a username and password.</p>
        <h4>Your Privacy</h4>
        <p>The Didthis Privacy Notice explains what information you provide to Mozilla when you use Didthis, and how we handle that information.</p>
        <h4>You Must Be Eligible</h4>
        <p>You must be 18 or older to sign up for and use Didthis.</p>
        <h4>Permissions for Didthis</h4>
        <p>Your Use of the Service. Mozilla gives you permission to use Didthis according to these Terms. This permission is only for beta testing and internal evaluation purposes only.  You may not transfer, sublicense, or resell the Didthis service.</p>
        <p>Your Feedback and Suggestions. Mozilla may collect suggestions, ideas or feedback (collectively, the “Feedback”) directly from you (including through third-party platforms such as Mozilla’s discord channels) or through your usage/interaction of Didthis (for example, your clicks on Didthis). You grant Mozilla permission to use, reproduce, distribute, and modify the Feedback for any purpose (including incorporating your Feedback into Didthis), without any obligation of compensation or attribution to you.</p>
        <p>Mozilla’s Intellectual Property. Neither Mozilla nor its licensors grant you any intellectual property rights in Didthis or other Mozilla services that are not specifically stated in these Terms. For example, these Terms do not provide the right to use any copyrights, trademarks, or other distinctive brand features of Mozilla or its licensors.</p>
        <p>Your Intellectual Property. You retain your rights to any content you post or submit through Didthis. By submitting or posting content to Didthis, you grant us a worldwide, non-exclusive, sublicensable, and royalty-free license to use, copy, modify, publish, and display your content on Didthis. This license authorizes us to make your content available publicly and to let others do the same.</p>
        <p>To learn more about how Didthis works and the data we process, you can see the Didthis <a href="/privacy">Privacy Notice</a>.</p>
        <h4>You May Cancel Your Account at Any Time</h4>
        <p>You may cancel your Didthis account at any time. You can do this by emailing <a href="mailto:support@Didthis.app">support@Didthis.app</a>. If you choose to cancel, we may delete your Didthis account and any of your personal information associated with your Didthis account. However, we may retain such data to the extent necessary in order to enforce our policies or comply with the law, as described in the Didthis <a href="/privacy">Privacy Notice</a>.</p>
        <h4>You Are Responsible For the Content You Provide</h4>
        <ul>
          <li>The content you post will be, by default, only viewable by you. However, if you choose to share your content publicly, you should only post content that you are comfortable sharing publicly. You can learn more about who can access the content that you share in the Didthis <a href="/privacy">Privacy Notice</a>.</li>
          <li>You assure Mozilla that you will not use Didthis to infringe anyone’s rights or violate any law, and that you have all rights and permissions necessary to grant us the rights in these Terms.</li>
          <li>Content posted on Didthis reflects the views of the person who posted it, not those of Mozilla. People may post–and you may see–content you disagree with or that offends you on Didthis. You agree that you will comply with the Didthis <a href="/content">Content Policies</a>. We reserve the right to remove or limit the visibility of such content, and to suspend any users we reasonably believe have violated the Didthis Content Policies, however, we cannot take responsibility for all content posted on Didthis.</li>
        </ul>
        <h4>You Are Responsible For the Consequences of Your Use of the Didthis Service</h4>
        <ul>
          <li>To the extent permitted by applicable law, you agree that Mozilla will not be liable in any way for any inability to use Didthis or for any limitations of the service. Mozilla specifically disclaims the following: Indirect, special, incidental, consequential, or exemplary damages, direct or indirect damages for loss of goodwill, work stoppage, lost profits, loss of data, or computer malfunction. IN NO EVENT WILL MOZILLA’S AGGREGATE LIABILITY TO YOU FOR ANY DAMAGES ARISING FROM OR RELATED TO THESE TERMS BE IN EXCESS OF $100 (USD).</li>
          <li>You agree to indemnify and hold Mozilla harmless for any liability or claim that results from your activities on Didthis, to the extent permitted by applicable law.</li>
          <li>You acknowledge that Didthis is experimental in nature and that Didthis is provided “AS IS”. Mozilla does not represent or warrant that the performance of Didthis will (i) be uninterrupted or secure, (ii) be free of defects, inaccuracies, or errors, or (iii) meet your requirements or perform according to your expectations. For clarity, Mozilla has no obligation to make Didthis available past the beta phase or to the general public. MOZILLA DISCLAIMS ALL WARRANTIES RELATED TO Didthis, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION, ANY WARRANTIES AGAINST INFRINGEMENT OR THIRD PARTY RIGHTS, MERCHANTABILITY, AND FITNESS FOR A PARTICULAR PURPOSE.</li>
        </ul>
        <h4>We Can Update These Terms</h4>
        <p>Mozilla Can Update These Terms. Every once in a while, Mozilla may decide to update these Terms. We will post the updated Terms online. We will take your continued use of Didthis as acceptance of such changes. We will post an effective date at the top of this page to make it clear when we made our most recent update. If the update is significant, we will contact you at the email address associated with your Didthis account to let you know about the changes.</p>
        <p>Termination. These Terms apply until they are modified, or until either you or Mozilla decide to end them. You can choose to end them at any time for any reason by stopping your use of Didthis and deactivating your account. Mozilla can suspend or end anyone’s access at any time for any reason, including if Mozilla decides to end Didthis. If we decide to suspend or end your access, we will notify you at the email address associated with your account or the next time you attempt to access your account.</p>
        <h4>California Law Applies</h4>
        <p>California law applies to this contract, except California’s conflict of law provisions.</p>
        <p>You may have other rights under your own country’s laws. Nothing in these Terms is intended to affect those rights.</p>
        <h4>You Can Contact Mozilla</h4>
        <p>If you encounter content on Didthis that you believe is illegal or violates these Terms, you can email us at <a href="mailto:support@Didthis.app">support@Didthis.app</a>.</p>
        <p>To learn more about how Mozilla responds to claims of intellectual property infringement, see our <a href="https://www.mozilla.org/about/legal/report-infringement/">copyright or trademark infringement claims policy</a>.</p>
        <p>You can contact Mozilla’s Legal Department or notify us of legal claims using the information below.</p>
        <p>Mozilla Corporation<br/>
        Attn: Mozilla – Legal Notices<br/>
        2 Harrison St. #175,<br/>
        San Francisco, CA 94105<br/>
        legal-notices@mozilla.com</p>
        <h4>Translations</h4>
        <p>If there is a conflict or ambiguity between a translated version of these terms and the English language version, the English language version applies.</p>
      </div>
    </PagePad>
  )
}

export default Terms
