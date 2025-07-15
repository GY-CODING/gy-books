'use client';

import React from 'react';
import { MenuIcons } from './MenuIcons';
import { MenuItem } from '@/domain/menu.model';

interface User {
  email?: string;
  name?: string;
  picture?: string;
}

export const getMenuItems = (user: User | null): MenuItem[] => {
  if (user) {
    return [
      {
        text: 'Home',
        icon: React.createElement(MenuIcons.Home),
        route: '/',
      },
      {
        text: 'Library',
        icon: React.createElement(MenuIcons.Library),
        route: '/books',
      },
      {
        text: 'Users',
        icon: React.createElement(MenuIcons.Users),
        route: '/users/search',
      },
      {
        text: 'Profile',
        icon: React.createElement(MenuIcons.Profile),
        route: '/profile',
      },
      {
        text: 'Friends',
        icon: React.createElement(MenuIcons.Friends),
        route: '/users/friends',
      },
    ];
  }

  return [
    {
      text: 'Inicio',
      icon: React.createElement(MenuIcons.Home),
      route: '/',
    },
    {
      text: 'Iniciar Sesión',
      icon: React.createElement(MenuIcons.Login),
      route: '/api/auth/login',
    },
  ];
};
