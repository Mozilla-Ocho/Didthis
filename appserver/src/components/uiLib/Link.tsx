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
        'bg-primary',
        'hover:bg-primary-hover',
        'p-4',
        'text-white',
        'py-2',
        'px-4',
        'rounded',
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
