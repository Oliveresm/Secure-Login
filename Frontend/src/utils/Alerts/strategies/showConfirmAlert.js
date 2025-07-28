import Swal from 'sweetalert2';

const showConfirmAlert = async (message, title = '¿Estás seguro?') => {
  const result = await Swal.fire({
    title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#007bff',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar'
  });

  return result.isConfirmed;
};

export default showConfirmAlert;
