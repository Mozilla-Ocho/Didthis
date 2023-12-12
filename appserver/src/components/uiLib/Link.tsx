import NextLink from 'next/link'
import React, { CSSProperties, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { track } from '@amplitude/analytics-browser'
import { useStore } from '@/lib/store'
import { twMerge } from 'tailwind-merge'

const linkCVA = cva('link', {
  variants: {
    intent: {
      link: [
        'underline',
        'text-links',
        'hover:text-links-hover',
        'active:text-links-active',
        'visited:text-links-visited',
      ],
      internalNav: [
        // this used to be different from just regular 'link'
        'underline',
        'text-links',
        'hover:text-links-hover',
        'active:text-links-active',
        'visited:text-links-visited',
      ],
      primary: [
        // DRY_57530 button styles
        'inline-block',
        'text-center',
        'text-sm',
        'px-4',
        'py-3',
        'rounded',
        'bg-primary-bg',
        'hover:bg-primary-bg-hover',
        'active:bg-primary-bg-active',
        'disabled:bg-primary-bg-disabled',
        'text-primary-txt',
        'hover:text-primary-txt-hover',
        'active:text-primary-txt-active',
        'disabled:text-primary-txt-disabled',
      ],
      secondary: [
        // DRY_57530 button styles
        'inline-block',
        'text-center',
        'text-sm',
        'px-4',
        'py-3',
        'rounded',
        'bg-secondary-bg',
        'hover:bg-secondary-bg-hover',
        'active:bg-secondary-bg-active',
        'disabled:bg-secondary-bg-disabled',
        'text-secondary-txt',
        'hover:text-secondary-txt-hover',
        'active:text-secondary-txt-active',
        'disabled:text-secondary-txt-disabled',
        'border',
        'border-secondary-edge',
        'hover:border-secondary-edge-hover',
        'disabled:border-secondary-edge-disabled',
      ],
    },
  },
  defaultVariants: {
    intent: 'link',
  },
})

interface LinkProps extends VariantProps<typeof linkCVA> {
  id?: string
  href: string
  children: ReactNode
  className?: string
  style?: CSSProperties
  external?: boolean
  newTab?: boolean
  trackEvent?: EventSpec
  trackEventOpts?: EventSpec['opts']
  onClick?: React.MouseEventHandler
}

const Link: React.FC<LinkProps> = ({
  id,
  href,
  intent,
  className,
  style = {},
  children,
  external,
  newTab,
  trackEvent,
  trackEventOpts,
  onClick,
}) => {
  const store = useStore()
  const ourOnClick: React.MouseEventHandler = e => {
    if (trackEvent) store.trackEvent(trackEvent, trackEventOpts)
    if (onClick) onClick(e)
  }
  if (external) {
    return (
      <a
        id={id}
        rel="nofollow noreferer"
        target="_blank"
        className={twMerge(linkCVA({ intent}), className )}
        style={style}
        href={href}
        onClick={ourOnClick}
      >
        {children}
      </a>
    )
  }
  return (
    <NextLink
      id={id}
      target={newTab ? '_blank' : undefined}
      className={twMerge(linkCVA({ intent}), className )}
      style={style}
      href={href}
      onClick={ourOnClick}
    >
      {children}
    </NextLink>
  )
}

export default Link
