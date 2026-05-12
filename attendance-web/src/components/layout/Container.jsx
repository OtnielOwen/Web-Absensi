import { Grid } from 'antd';
import styled, { css } from 'styled-components';

const ContainerStyled = styled((props) => (
  <div {...props} className={`hw-container ${props.className}`} />
))`
  max-width: 100%;
  padding: 0 16px;
  margin: 0 auto;

  ${({ xl, xxl }) =>
    (xl || xxl) &&
    css`
      max-width: 1200px;
    `};
`;

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {React.CSSProperties} [props.style]
 */
function Container({ children, ...props }) {
  const breakpoint = Grid.useBreakpoint();
  return (
    <ContainerStyled {...breakpoint} style={props.style}>
      {children}
    </ContainerStyled>
  );
}

export default Container;
