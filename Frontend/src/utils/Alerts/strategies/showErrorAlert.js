import Swal from 'sweetalert2';

const showErrorAlert = (message, title = 'Error') => {
  return Swal.fire({
    icon: 'error',
    title,
    text: message,
    confirmButtonColor: '#dc3545'
  });
};

export default showErrorAlert;
