import { FC } from 'react';
import { NextPage } from 'next';
import { PublicLayout } from './PublicLayout';
import { CmsLayout } from './CmsLayout';

export enum Layout {
	Public = 'public',
	Cms = 'cms',
}

export type NextPageWithLayout = NextPage & {
	layout?: Layout;
};

const layouts = new Map<string, FC<{ children: JSX.Element }>>();
layouts.set(Layout.Public, PublicLayout);
layouts.set(Layout.Cms, CmsLayout);

export const LayoutProvider: FC<{ children: JSX.Element }> = ({ children }) => {
	const layoutName = children.type.layout;
	const Layout = layouts.get(layoutName);
	if (!layoutName || !Layout) return children;
	return <Layout>{children}</Layout>;
};
