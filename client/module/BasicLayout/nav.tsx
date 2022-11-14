import DashboardIcon from '@mui/icons-material/Dashboard';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import WorkIcon from '@mui/icons-material/Work';
import { Payment, Settings, Storefront, TrendingUp } from '@mui/icons-material';
import { ADMIN, DISBURSEMENT, FDS, HOME, MERCHANT_PRODUCTION, MERCHANT_SANDBOX, ROLE } from 'pageConstant';

export const getNav = (list: string[]) => {
  const navList = [
    {
      permission: '',
      name: 'dashboard',
      label: 'Dashboard',
      link: HOME.url,
      logo: DashboardIcon
    },
    {
      permission: 'admin',
      name: 'admin',
      label: 'Admin',
      link: ADMIN.url,
      logo: SupervisorAccountIcon
    },
    {
      permission: 'role',
      name: 'role',
      label: 'Role',
      link: ROLE.url,
      logo: WorkIcon
    },
    {
      permission: 'production-merchant',
      name: 'production-merchant',
      label: 'Production Merchant',
      link: MERCHANT_PRODUCTION.url,
      logo: TrendingUp
    },
    {
      permission: 'sandbox-merchant',
      name: 'sandbox-merchant',
      label: 'Sandbox Merchant',
      link: MERCHANT_SANDBOX.url,
      logo: Storefront
    },
    {
      permission: 'disbursement',
      name: 'disbursement',
      label: 'Disbursement',
      link: DISBURSEMENT.url,
      logo: Payment
    },
    {
      permission: 'fds',
      name: 'fds',
      label: 'FDS Control',
      link: FDS.url,
      logo: Settings
    },
  ]

  if (!list) return []
  return navList.filter((nav) => (
    nav.permission === '' ||
    list?.find((permission) => permission == nav.permission
  )))
}