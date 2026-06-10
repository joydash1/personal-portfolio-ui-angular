import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

export interface AlertOptions {
  title?: string;
  message?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  timer?: number;
  showConfirmButton?: boolean;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  backdrop?: boolean;
  allowOutsideClick?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private defaultConfirmColor = '#4CAF50';
  private defaultCancelColor = '#d33';
  private defaultErrorColor = '#f44336';
  private defaultWarningColor = '#ff9800';
  private defaultInfoColor = '#2196f3';

  constructor() { }

  /**
   * Success Alert
   */
  async success(message: string, title: string = 'Success!', timer: number = 3000) {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: this.defaultConfirmColor,
      timer: timer,
      timerProgressBar: true,
      backdrop: true,
      allowOutsideClick: false
    });
  }

  /**
   * Error Alert
   */
  async error(message: string, title: string = 'Error!') {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: this.defaultErrorColor,
      backdrop: true,
      allowOutsideClick: false
    });
  }

  /**
   * Warning Alert
   */
  async warning(message: string, title: string = 'Warning!') {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      confirmButtonText: 'OK',
      confirmButtonColor: this.defaultWarningColor,
      backdrop: true,
      allowOutsideClick: false
    });
  }

  /**
   * Info Alert
   */
  async info(message: string, title: string = 'Information', timer: number = 3000) {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'info',
      confirmButtonText: 'Got it',
      confirmButtonColor: this.defaultInfoColor,
      timer: timer,
      timerProgressBar: true,
      backdrop: true,
      allowOutsideClick: false
    });
  }

  /**
   * Question/Confirmation Alert
   */
  async confirm(
    message: string, 
    title: string = 'Are you sure?', 
    confirmText: string = 'Yes, proceed!',
    cancelText: string = 'Cancel'
  ): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: this.defaultConfirmColor,
      cancelButtonColor: this.defaultCancelColor,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      backdrop: true,
      allowOutsideClick: false
    });
    return result.isConfirmed;
  }

  /**
   * Custom Alert with options
   */
  async custom(options: AlertOptions) {
    return Swal.fire({
      title: options.title || 'Notice',
      text: options.message,
      icon: options.icon || 'info',
      confirmButtonText: options.confirmButtonText || 'OK',
      cancelButtonText: options.cancelButtonText || 'Cancel',
      showCancelButton: options.showCancelButton || false,
      timer: options.timer,
      showConfirmButton: options.showConfirmButton !== undefined ? options.showConfirmButton : true,
      confirmButtonColor: options.confirmButtonColor || this.defaultConfirmColor,
      cancelButtonColor: options.cancelButtonColor || this.defaultCancelColor,
      backdrop: options.backdrop !== undefined ? options.backdrop : true,
      allowOutsideClick: options.allowOutsideClick !== undefined ? options.allowOutsideClick : false
    });
  }

  /**
   * Loading Alert (for async operations)
   */
  async loading(message: string = 'Please wait...', title: string = 'Processing') {
    Swal.fire({
      title: title,
      text: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  /**
   * Close loading alert
   */
  close() {
    Swal.close();
  }

  /**
   * Toast Notification (non-intrusive)
   */
  async toast(message: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success', duration: number = 3000) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: duration,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });
    
    await Toast.fire({
      icon: icon,
      title: message
    });
  }

  /**
   * Alert with HTML content
   */
  async html(content: string, title: string = 'Information', icon: 'success' | 'error' | 'warning' | 'info' = 'info') {
    return Swal.fire({
      title: title,
      html: content,
      icon: icon,
      confirmButtonText: 'Close',
      confirmButtonColor: this.defaultConfirmColor
    });
  }

  /**
   * Alert with custom styling
   */
  async styled(options: {
    title: string;
    message?: string;
    html?: string;
    icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
    backgroundColor?: string;
    color?: string;
    confirmButtonColor?: string;
    confirmButtonText?: string;
  }) {
    return Swal.fire({
      title: options.title,
      text: options.message,
      html: options.html,
      icon: options.icon || 'info',
      background: options.backgroundColor || '#ffffff',
      color: options.color || '#333333',
      confirmButtonColor: options.confirmButtonColor || this.defaultConfirmColor,
      confirmButtonText: options.confirmButtonText || 'OK'
    });
  }

  /**
   * Alert with input field
   */
  async prompt(
    message: string, 
    title: string = 'Enter value',
    inputType: 'text' | 'email' | 'number' | 'password' = 'text',
    placeholder?: string
  ): Promise<string | null> {
    const result = await Swal.fire({
      title: title,
      text: message,
      input: inputType,
      inputPlaceholder: placeholder,
      showCancelButton: true,
      confirmButtonColor: this.defaultConfirmColor,
      cancelButtonColor: this.defaultCancelColor,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'This field is required!';
        }
        if (inputType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address!';
        }
        return null;
      }
    });

    if (result.isConfirmed && result.value) {
      return result.value;
    }
    return null;
  }

  /**
   * Alert with timer and auto-close
   */
  async autoClose(message: string, title: string = 'Notice', duration: number = 5000) {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'info',
      timer: duration,
      timerProgressBar: true,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  /**
   * Success with redirect after confirmation
   */
  async successWithRedirect(message: string, redirectUrl: string, title: string = 'Success!') {
    const result = await Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonText: 'Continue',
      confirmButtonColor: this.defaultConfirmColor,
      showCancelButton: true,
      cancelButtonText: 'Stay Here',
      cancelButtonColor: this.defaultCancelColor
    });

    if (result.isConfirmed) {
      window.location.href = redirectUrl;
    }
  }

  /**
   * Multiple button options alert
   */
  async multiChoice(options: {
    title: string;
    message: string;
    buttons: { text: string; value: any; color?: string }[];
  }): Promise<any> {
    const buttons: any = {};
    options.buttons.forEach(btn => {
      buttons[btn.text] = btn.value;
    });

    const result = await Swal.fire({
      title: options.title,
      text: options.message,
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: options.buttons[0]?.text || 'Yes',
      denyButtonText: options.buttons[1]?.text || 'No',
      cancelButtonText: 'Cancel',
      confirmButtonColor: options.buttons[0]?.color || this.defaultConfirmColor,
      denyButtonColor: options.buttons[1]?.color || this.defaultCancelColor
    });

    if (result.isConfirmed) return options.buttons[0]?.value;
    if (result.isDenied) return options.buttons[1]?.value;
    return null;
  }
}