import React from 'react'
import Link from 'next/link'
import { Link as MUILink } from '@mui/material';
import { UrlObject } from 'url';

export interface NextLinkProps {
  children: JSX.Element;
  href: UrlObject;
}

const NextLink = ({children, href, ...pass}: NextLinkProps) => {

  return (
    <Link {...pass} href={href} passHref >
        <MUILink
          variant="body2"
          underline="none"
          color="inherit"
        >
          {children}
        </MUILink>
    </Link>
  )
}

export default NextLink