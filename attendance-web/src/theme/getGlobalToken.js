import { theme } from 'antd';
import themeConfig from './themeConfig';

const { getDesignToken } = theme;

const getGlobalToken = () => getDesignToken(themeConfig);

export default getGlobalToken;
