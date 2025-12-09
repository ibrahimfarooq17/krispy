import React from 'react'
import ReplyIcon from '@mui/icons-material/Reply';
import { IconButton } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch } from 'react-redux';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { editShopifyProductModal } from '../../../redux/actions/modal.actions';
import krispyAxios from '../../../utilities/krispyAxios';
import { getKnowledgeBase } from '../../../redux/actions/knowledgeBase.actions';

const ProductContextMenu = ({ product }) => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const viewProduct = () => {
    handleMenuClose();
    window.open(product?.product_url, '_blank')
  };

  const editProduct = () => {
    handleMenuClose();
    dispatch(editShopifyProductModal({
      isOpen: true,
      product: product
    }));
  }

  const deleteProduct = async () => {
    handleMenuClose();
    await krispyAxios({
      method: 'DELETE',
      url: `knowledge-bases/shopify/products/${product?.id}`,
      loadingMessage: 'Deleting product...',
      successMessage: 'Product deleted!',
      onSuccess: () => dispatch(getKnowledgeBase())
    });
  }

  return (
    <div className='d-flex align-items-center'>
      <IconButton onClick={handleMenuClick}>
        <img src='/images/ellipsis-vertical-icon.svg' width={20} height={20} />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        sx={{
          '& .MuiMenu-list': {
            padding: 0,
          }
        }}
        meni
      >
        <MenuItem onClick={viewProduct}>
          <IconButton onClick={viewProduct}>
            <RemoveRedEyeIcon fontSize='small' />
          </IconButton>
          View Product
        </MenuItem>
        <MenuItem onClick={editProduct}>
          <IconButton onClick={editProduct}>
            <BorderColorIcon fontSize='small' />
          </IconButton>
          Edit Product
        </MenuItem>
        <MenuItem onClick={deleteProduct}>
          <IconButton onClick={deleteProduct}>
            <DeleteIcon fontSize='small' />
          </IconButton>
          Delete product
        </MenuItem>
      </Menu>
    </div>
  )
}

export default ProductContextMenu;