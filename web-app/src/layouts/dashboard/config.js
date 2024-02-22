import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import BuildingOffice2Icon from '@heroicons/react/24/solid/BuildingOffice2Icon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import CreditCardIcon from '@heroicons/react/24/solid/CreditCardIcon';
import MegaphoneIcon from '@heroicons/react/24/solid/MegaphoneIcon';
import ChatBubbleOvalLeftEllipsisIcon from '@heroicons/react/24/solid/ChatBubbleOvalLeftEllipsisIcon';
import PaperAirplaneIcon from '@heroicons/react/24/solid/PaperAirplaneIcon';
import InformationCircleIcon from '@heroicons/react/24/solid/InformationCircleIcon';
import WalletIcon from '@heroicons/react/24/solid/WalletIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Overview',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Customers',
    path: '/customers',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Companies',
    path: '/companies',
    icon: (
      <SvgIcon fontSize="small">
        <BuildingOffice2Icon />
      </SvgIcon>
    )
  },
  {
    title: 'Ads',
    path: '/advertisements',
    icon: (
      <SvgIcon fontSize="small">
        <MegaphoneIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Sports',
    path: '/sports',
    icon: (
      <SvgIcon fontSize="small">
        <PaperAirplaneIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Payment Methods',
    path: '/paymentMethods',
    icon: (
      <SvgIcon fontSize="small">
        <CreditCardIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Send Notification ',
    path: '/sendNotification',
    icon: (
      <SvgIcon fontSize="small">
        <ChatBubbleOvalLeftEllipsisIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Subscription Plans ',
    path: '/subscriptionPlans',
    icon: (
      <SvgIcon fontSize="small">
        <WalletIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Account',
    path: '/account',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },
  {
    title: 'App Info',
    path: '/appInfo',
    icon: (
      <SvgIcon fontSize="small">
        <InformationCircleIcon />
      </SvgIcon>
    )
  },
];
