import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '../../ui/Button';

export type MenuItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

interface AdminHeaderProps {
  user: {
    name: string;
  };
  onLogout: () => void;
}