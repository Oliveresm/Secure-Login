import Swal from 'sweetalert2';

const showSuccessAlert = (message, title = 'Éxito') => {
  return Swal.fire({
    icon: 'success',
    title,
    text: message,
    confirmButtonColor: '#28a745'
  });
};

export default showSuccessAlert;