import ADMIN from './admin'
import ADMIN_LOG from './admin-log';
import ROLE from './role'
import LOGIN from './login'
import MERCHANT_PRODUCTION from './merchant-production';
import MERCHANT_SANDBOX from './merchant-sandbox';
import DISBURSEMENT from './disbursement';
import FDS from './fds';

import { generateBreadcrumb } from 'reusables/utilities';

const thisBreadcrumb = {
  title: "Home",
  url: "/",
}

const breadcrumb = {
  [thisBreadcrumb.title]: [thisBreadcrumb],
  ...generateBreadcrumb(ADMIN.breadcrumb, [thisBreadcrumb]),
  ...generateBreadcrumb(ADMIN_LOG.breadcrumb, [thisBreadcrumb]),
  ...generateBreadcrumb(ROLE.breadcrumb, [thisBreadcrumb]),
  ...generateBreadcrumb(MERCHANT_PRODUCTION.breadcrumb, [thisBreadcrumb]),
  ...generateBreadcrumb(MERCHANT_SANDBOX.breadcrumb, [thisBreadcrumb]),
  ...generateBreadcrumb(DISBURSEMENT.breadcrumb, [thisBreadcrumb]),
  ...generateBreadcrumb(FDS.breadcrumb, [thisBreadcrumb]),
}

const HOME = {
  ...thisBreadcrumb,
  breadcrumb,
};


export {
  HOME,
  LOGIN,
  ADMIN,
  ADMIN_LOG,
  ROLE,
  FDS,
  MERCHANT_PRODUCTION,
  MERCHANT_SANDBOX,
  DISBURSEMENT
}

export const getBreadcrumb = (key: string) => breadcrumb[key];