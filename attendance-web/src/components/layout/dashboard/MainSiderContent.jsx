import BrandLogo from './BrandLogo';
import MainMenu from './MainMenu';

function MainSiderContent({ isCollapsed, setIsDrawerOpen }) {
  return (
    <>
      <BrandLogo isCollapsed={isCollapsed} />
      <MainMenu setIsDrawerOpen={setIsDrawerOpen} />
    </>
  );
}

export default MainSiderContent;
