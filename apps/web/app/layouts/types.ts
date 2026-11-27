import type { Breadcrumb } from '~/components/ui/Breadcrumbs/types';

export type DefaultLayoutProps = {
  breadcrumbs?: Breadcrumb[];
  compactProductHeader?: boolean;
};

export type MyAccountSubsection = {
  label: string;
  link: string;
  hide?: boolean;
};

export type CheckoutLayoutProps = {
  heading: string;
  backLabelMobile: string;
  backLabelDesktop: string;
};
