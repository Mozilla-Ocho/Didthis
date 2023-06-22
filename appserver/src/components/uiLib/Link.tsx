import NextLink from 'next/link'
import React, { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const linkCVA = cva('link', {
  variants: {
    intent: {
      link: [
        'underline',
        'text-links',
        'hover:text-links-hover',
        'visited:text-links',
        'active:text-links-active',
      ],
      internalNav: [
        'text-links',
        'hover:text-links-hover',
        'hover:underline',
        'visited:text-links',
        'active:text-links-active',
      ],
      logo: [
        'text-yellow-500',
        'hover:text-yellow-500',
        'hover:underline',
        'visited:text-yellow-500',
        'active:text-links-active',
      ],
      primary: [
        'inline-block',
        'text-center',
        'text-bs',
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
        'inline-block',
        'text-center',
        'text-bs',
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
  href: string
  children: ReactNode
  className?: string
  external?: boolean
}

const Link: React.FC<LinkProps> = ({
  href,
  intent,
  className,
  children,
  external,
}) => {
  if (external) {
    return (
      <a
        rel="nofollow noreferer"
        target="_blank"
        className={linkCVA({ intent, className })}
        href={href}
      >
        {children}
      </a>
    )
  }
  return (
    <NextLink className={linkCVA({ intent, className })} href={href}>
      {children}
    </NextLink>
  )
}

export default Link
