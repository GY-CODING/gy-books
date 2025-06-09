'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import { FeatureCard } from '../molecules/FeatureCard';
import BookIcon from '@mui/icons-material/Book';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';

const features = [
  {
    title: 'Biblioteca Personal',
    description:
      'Organiza tus libros en estanterías personalizadas. Marca tus lecturas actuales y mantén un registro de tus libros favoritos.',
    features: [
      'Estanterías personalizadas',
      'Lectura actual',
      'Lista de deseos',
    ],
    icon: <BookIcon />,
  },
  {
    title: 'Red Social',
    description:
      'Conecta con otros lectores, comparte tus lecturas y descubre nuevas recomendaciones de tus amigos.',
    features: ['Amigos lectores', 'Actividad de amigos', 'Recomendaciones'],
    icon: <PeopleIcon />,
  },
  {
    title: 'Reseñas y Ratings',
    description:
      'Comparte tus opiniones, califica los libros y descubre las reseñas de otros lectores.',
    features: [
      'Sistema de calificación',
      'Reseñas detalladas',
      'Estadísticas de lectura',
    ],
    icon: <StarIcon />,
  },
  {
    title: 'Exploración',
    description:
      'Descubre nuevos libros, autores y tendencias. Búsqueda avanzada y recomendaciones personalizadas.',
    features: ['Búsqueda avanzada', 'Perfiles de autores', 'Tendencias'],
    icon: <SearchIcon />,
  },
];

export const FeaturesSection = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
          },
          gap: '2.5rem',
        }}
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            features={feature.features}
            icon={feature.icon}
          />
        ))}
      </Box>
    </Container>
  );
};
