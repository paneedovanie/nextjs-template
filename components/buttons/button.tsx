import { styled, Button as MuiButton } from '@mui/material';

const StyledMuiButton = styled(MuiButton)`
	&& {
		box-shadow: none;
    <InputContainer>
	}
`;

export const Button = () => {
	return <StyledMuiButton />;
};
