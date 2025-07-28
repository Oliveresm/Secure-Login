// src/components/alerts/alertService.js
import showSuccessAlert from './strategies/showSuccessAlert';
import showErrorAlert from './strategies/showErrorAlert';
import showConfirmAlert from './strategies/showConfirmAlert';

export const alertService = {
  success: showSuccessAlert,
  error: showErrorAlert,
  confirm: showConfirmAlert
};
