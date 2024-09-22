import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const CustomBreadcrumbs = ({ links, current }) => {
  return (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" sx={{ marginBottom: '16px' }}>
      {links.map((link, index) => (
        <Link key={index} underline="hover" color="inherit" href={link.href}>
          {link.label}
        </Link>
      ))}
      <Typography color="text.primary">{current}</Typography>
    </Breadcrumbs>
  );
};

export default CustomBreadcrumbs;
