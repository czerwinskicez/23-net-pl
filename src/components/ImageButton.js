import React from 'react';
import { Button } from '@mui/material';
import ModalImage from 'react-modal-image';

const ImageButton = ({ imageUrl }) => {
  return (
    <Button onClick={() => {}}>
      <ModalImage
        small={imageUrl}
        large={imageUrl}
        alt="Post Image"
        hideDownload={true}
        hideZoom={true}
        smallHeight={123}
        style={{ maxHeight: '123px' }}
      />
    </Button>
  );
};

export default ImageButton;
