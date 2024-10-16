import { html } from '../utils/html'
import { ImageMetadata, Update } from '../lib/types'

export type Props = {
  update: Update
  imageMetadata: Map<string, ImageMetadata>
}

export default function ({ update, imageMetadata }: Props) {
  const image = update.imageAssetId && imageMetadata.get(update.imageAssetId)
  const icon = Icons[update.type] || Icons.text
  const date = new Date(update.didThisAt || update.createdAt)
  return html`
    <section class="update" id="${update.id}" datetime="${date.toISOString()}">
      <div class="header">
        <span class="icon">${icon}</span>
        <span class="date"><a href="#${update.id}">${date.toLocaleString()}</a></span>
      </div>
      <div class="body">
        ${image &&
        html`
          <span class="image">
            <img
              src="${image.path}"
              width="${image.width}"
              height="${image.height}"
            />
          </span>
        `}
        ${update.linkUrl &&
        html`
          <span class="link">
            ${update.linkMeta?.host &&
            html` <span class="host">${update.linkMeta.host}</span> `}
            <a href="${update.linkUrl}" target="_blank">
              ${update.linkMeta?.title ? update.linkMeta.title : update.linkUrl}
            </a>
          </span>
        `}
        ${update.description &&
        html`<span class="description">${update.description}</span>`}
      </div>
    </section>
  `
}

const Icons = {
  link: () => `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.40117 11.2161L2.45572 16.104C2.31132 16.247 2.19671 16.417 2.11849 16.6042C2.04027 16.7916 2 16.9925 2 17.1954C2 17.3983 2.04027 17.5992 2.11849 17.7865C2.19671 17.9737 2.31132 18.1437 2.45572 18.2867L5.72187 21.5453C5.86509 21.6894 6.0355 21.8037 6.22323 21.8818C6.41097 21.9599 6.61235 22 6.81572 22C7.0191 22 7.22048 21.9599 7.40822 21.8818C7.59597 21.8037 7.76636 21.6894 7.90958 21.5453L12.8088 16.6113M16.6451 12.7839L21.5443 7.89597C21.6886 7.75308 21.8033 7.58308 21.8815 7.39577C21.9598 7.20846 22 7.00755 22 6.80464C22 6.60172 21.9598 6.40081 21.8815 6.2135C21.8033 6.02619 21.6886 5.85619 21.5443 5.7133L18.3243 2.45467C18.1811 2.3106 18.0107 2.19626 17.823 2.11822C17.6352 2.04018 17.4339 2 17.2305 2C17.0271 2 16.8258 2.04018 16.638 2.11822C16.4503 2.19626 16.2799 2.3106 16.1366 2.45467L11.2374 7.38873M15.1043 8.92582L8.94171 15.0742"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  `,
  image: () => `
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.6815 22.0348C15.1865 19.3964 13.771 17.0198 11.6873 15.329C9.60373 13.6383 6.98764 12.7434 4.30588 12.8041C3.53215 12.802 2.75999 12.8741 2 13.0195M21.9859 16.5121C20.7478 16.0937 19.4496 15.8806 18.1428 15.8813C16.4886 15.8778 14.8512 16.2128 13.3312 16.866M3.55301 22.0352H20.4628C21.3118 22.0352 22 21.3464 22 20.4967V3.57362C22 2.72395 21.3118 2.03516 20.4628 2.03516H3.55301C2.70401 2.03516 2.01576 2.72395 2.01576 3.57362V20.4967C2.01576 21.3464 2.70401 22.0352 3.55301 22.0352ZM15.4517 11.2655C16.9374 11.2655 18.1419 10.0602 18.1419 8.57324C18.1419 7.08632 16.9374 5.88093 15.4517 5.88093C13.9659 5.88093 12.7615 7.08632 12.7615 8.57324C12.7615 10.0602 13.9659 11.2655 15.4517 11.2655Z"
        stroke="#757470"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  `,
  text: () => `
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_4140_10289)">
        <path
          d="M14.5715 23.1763H2.57146C2.11681 23.1763 1.68077 22.9957 1.35928 22.6742C1.03779 22.3527 0.857178 21.9167 0.857178 21.4621V2.60491C0.857178 2.15025 1.03779 1.71422 1.35928 1.39273C1.68077 1.07124 2.11681 0.890625 2.57146 0.890625H21.4286C21.8833 0.890625 22.3193 1.07124 22.6408 1.39273C22.9623 1.71422 23.1429 2.15025 23.1429 2.60491V14.6049L14.5715 23.1763Z"
          stroke="#757470"
          strokeWidth="1.71429"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.5715 15.4626V23.1769L23.143 14.6055H15.4287C15.2013 14.6055 14.9833 14.6958 14.8226 14.8565C14.6618 15.0173 14.5715 15.2353 14.5715 15.4626Z"
          stroke="#757470"
          strokeWidth="1.71429"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_4140_10289">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0 0.0351562)"
          />
        </clipPath>
      </defs>
    </svg>
  `,
}
