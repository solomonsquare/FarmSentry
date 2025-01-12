import React, { useState } from 'react';
import { Bird, Warehouse } from 'lucide-react';
import { FarmCategory } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { UserService } from '../../services/userService';

// Update the farmTypes array to use Warehouse instead of Home
const farmTypes = [
  {
    id: 'birds' as FarmCategory,
    title: 'Poultry Farm',
    icon: Bird,
    description: 'Manage broiler birds and layers'
  },
  {
    id: 'pigs' as FarmCategory,
    title: 'Pig Farm',
    icon: Warehouse,
    description: 'Manage pig breeding and growth'
  }
];

// Rest of the file remains the same