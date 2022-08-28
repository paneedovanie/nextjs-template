import { FC } from 'react';
import {
	Box,
	AppBar,
	AppBarProps,
	Toolbar,
	Typography,
	TypographyProps,
	Button,
	styled,
} from '@mui/material';

const AppBarContainer = styled(Box)`
	&& {
		position: absolute;
		top: 0;
		width: 0;
		width: 100%;
	}
`;

const StyledAppBar = styled((props: AppBarProps) => (
	<AppBar {...props} position='static' color='transparent' />
))`
	&& {
		padding-inline: 16px;
		max-width: 1152px;
		margin-inline: auto;
		box-shadow: none;
	}
`;

const AppBarTitle = styled((props: TypographyProps) => (
	<Typography {...props} variant='h6' />
))`
	&& {
		flex-grow: 1;
	}
`;

export const PublicLayout: FC<{ children: JSX.Element }> = ({ children }) => {
	return (
		<>
			<AppBarContainer>
				<StyledAppBar>
					<Toolbar disableGutters>
						<AppBarTitle>News</AppBarTitle>
						<Button color='inherit' href='/login'>
							Login
						</Button>
					</Toolbar>
				</StyledAppBar>
			</AppBarContainer>
			<main>{children}</main>
		</>
	);
};
