import {
	TextField as MuiTexfield,
	styled,
	TextFieldProps,
} from '@mui/material';
import { FC } from 'react';

const StyledMuiTexfield = styled((props: TextFieldProps) => (
	<MuiTexfield {...props} />
))`
	&& {
		& fieldset {
			border-radius: 8px;
		}
	}
`;

export const TextField: FC<TextFieldProps> = (props) => (
	<StyledMuiTexfield {...props} />
);
