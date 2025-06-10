import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "@/style/css/react-confirm-alert.scss";

export const confirmModal = (
  message: string,
  onConfirm: () => void,
  title: string = ""
) => {
  confirmAlert({
    title,
    message,
    buttons: [
      {
        label: "Yes",
        onClick: onConfirm,
      },
      {
        label: "No",
        onClick: () => console.log('Cancled'),
      },
    ],
  });
};
