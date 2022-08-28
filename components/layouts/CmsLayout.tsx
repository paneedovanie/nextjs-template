import { FC } from 'react';
import Image from 'next/image';

export const CmsLayout: FC<{ children: JSX.Element }> = ({ children }) => {
	return (
		<>
			<nav className='bg-gray-800'>
				<div className='px-2 sm:px-6 lg:px-8'>
					<div className='relative flex items-center justify-between h-16'>
						<Image
							className='hidden lg:block h-8 w-auto'
							src='https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg'
							alt='Workflow'
							width='80px'
							height='80px'
						/>
					</div>
				</div>
			</nav>
			<main>{children}</main>
		</>
	);
};
