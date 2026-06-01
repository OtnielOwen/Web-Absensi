import { useEffect, useState } from 'react';
import { Grid, Menu } from 'antd';
import {
  TbHome,
  TbUserScan,
  TbPhoto,
  TbCalendar,
  TbUsers,
  TbBrandDatabricks,
  TbCircleDashed,
  TbFileText
} from 'react-icons/tb';
import { Link, useLocation } from 'react-router-dom';
import { useGetLoggedUser } from '@/utilities/authorization';
import { ROLE_KEYS } from '@/utilities/constant';

const createMenuItem = (key, label, icon, children) => ({
  key,
  label: children ? label : <Link to={key}>{label}</Link>,
  icon,
  children,
});

const menuItems = [
  createMenuItem('/dashboard', 'Dashboard', TbHome),
  createMenuItem('/dashboard/attendance', 'Absensi', TbUserScan),
  createMenuItem('/dashboard/facegallery', 'Album Wajah', TbPhoto),
  createMenuItem('/dashboard/rekap-bulanan', 'Rekap Bulanan', TbFileText),
];

const menuItemsAdmin = [
  createMenuItem('/admin-dashboard', 'Dashboard', <TbHome style={{ fontSize: 20 }} />),
  createMenuItem(
    '/admin-dashboard/attendance-list',
    'Data Absensi',
    <TbCalendar style={{ fontSize: 20 }} />
  ),
  createMenuItem('/admin-dashboard/users', 'Users', <TbUsers style={{ fontSize: 20 }} />),
  createMenuItem('master-data', 'Master Data', <TbBrandDatabricks style={{ fontSize: 20 }} />, [
    createMenuItem(
      '/admin-dashboard/master-data/squad',
      'Squad',
      <TbCircleDashed style={{ fontSize: 20 }} />
    ),
    createMenuItem(
      '/admin-dashboard/master-data/status-employee',
      'Status Pegawai',
      <TbCircleDashed style={{ fontSize: 20 }} />
    ),
    createMenuItem(
      '/admin-dashboard/master-data/status-work',
      'Status Kerja',
      <TbCircleDashed style={{ fontSize: 20 }} />
    ),
    createMenuItem(
      '/admin-dashboard/master-data/condition',
      'Kondisi Kesehatan',
      <TbCircleDashed style={{ fontSize: 20 }} />
    ),
  ]),
];

const findBestMatchPathname = (pathname, items) => {
  let bestMatch = '';
  let openKeys = [];

  const findMatch = (menuItems, parentKey = '') => {
    for (const item of menuItems) {
      const itemKey = item.key;
      if (pathname.startsWith(itemKey) && itemKey.length > bestMatch.length) {
        bestMatch = itemKey;
        if (parentKey) openKeys = [parentKey];
      }
      if (item.children) {
        const [childMatch, childOpenKeys] = findMatch(item.children, itemKey);
        if (childMatch.length > bestMatch.length) {
          bestMatch = childMatch;
          openKeys = [itemKey, ...childOpenKeys];
        } else if (childMatch === bestMatch && itemKey.length > parentKey.length) {
          openKeys = [itemKey, ...childOpenKeys];
        }
      }
    }
    return [bestMatch, openKeys];
  };

  return findMatch(items);
};

export default function MainMenu({ setIsDrawerOpen }) {
  const user = useGetLoggedUser();
  const { md } = Grid.useBreakpoint();
  const { pathname } = useLocation();

  const [selectedKeys, setSelectedKeys] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);

  const items = user?.isAdmin === ROLE_KEYS.admin ? menuItemsAdmin : menuItems;

  useEffect(() => {
    const [bestMatch, newOpenKeys] = findBestMatchPathname(pathname, items);
    setSelectedKeys(bestMatch ? [bestMatch] : []);
    setOpenKeys(newOpenKeys);
  }, [pathname, items]);

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <Menu
      mode="inline"
      items={items}
      selectedKeys={selectedKeys}
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      onClick={({ key }) => {
        setSelectedKeys([key]);
        if (!md) setTimeout(() => setIsDrawerOpen(false), 300);
      }}
      theme="light"
      style={{ background: 'transparent', marginTop: 16 }}
    />
  );
}
