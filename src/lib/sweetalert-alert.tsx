import Swal from 'sweetalert2';


export interface AlertOptions {
  title?: string;
  html?: string;
  confirmButtonText?: string;
}

export const showAlertSuccess = ({title, html, confirmButtonText}: AlertOptions) => {
  Swal.fire({
    title: title || 'Information',
    html: html,
    icon: "success",
    confirmButtonText: confirmButtonText || 'OK',
    showCancelButton: false,
    showConfirmButton: confirmButtonText !== "" ? true : false,
  });
};

export const showAlertWarning = ({title, html, confirmButtonText}: AlertOptions) => {
  Swal.fire({
    title: title || 'Information',
    html: html,
    icon: "warning",
    confirmButtonText: confirmButtonText || 'OK',
    showCancelButton: false,
    showConfirmButton: confirmButtonText !== "" ? true : false,
  });
};

export const showAlertDanger = ({title, html, confirmButtonText}: AlertOptions) => {
  Swal.fire({
    title: title || 'Information',
    html: html,
    icon: "error",
    confirmButtonText: confirmButtonText || 'OK',
    showCancelButton: false,
    showConfirmButton: confirmButtonText !== "" ? true : false,
  });
};

export const showAlertInfo = ({title, html, confirmButtonText}: AlertOptions) => {
  Swal.fire({
    title: title || 'Information',
    html: html,
    icon: "info",
    confirmButtonText: confirmButtonText || 'OK',
    showCancelButton: false,
    showConfirmButton: confirmButtonText !== "" ? true : false,
  });
};