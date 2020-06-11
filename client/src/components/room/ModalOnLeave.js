import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import RateUsers from './RateUsers'

export default function ModalOnLeave(props) {
  const {open, setOpen} = props.openModalState;

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <RateUsers userData={props.userData} roomState={ props.roomState }/>
      </Dialog>
    </div>
  );
}