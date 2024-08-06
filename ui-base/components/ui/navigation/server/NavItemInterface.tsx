'use client';

export interface NavItemInterface {
  id?: string;
  url?: string;
  name: string;
  _level?: number;
  superAlias?: string;
  children?: NavItemInterface[];
  showInNavigation?: boolean;
  className: string;
  productPhoto?: any;
}
