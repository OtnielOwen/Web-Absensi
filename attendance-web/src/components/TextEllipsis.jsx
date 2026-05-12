import { Typography } from 'antd';
import styled from 'styled-components';

/**
 * @typedef {Object} Props
 * @property {number} maxLine
 * @property {React.ReactNode} children
 */

const TextStyled = styled(Typography.Text)`
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: ${({ maxLine }) => maxLine || 1};
  -webkit-box-orient: vertical;
`;

/** @param {Props & import('antd/es/typography/Text').TextProps} */
function TextEllipsis({ children, maxLine = 2, ...props }) {
  return (
    <TextStyled {...props} maxLine={maxLine}>
      {children}
    </TextStyled>
  );
}

export default TextEllipsis;
