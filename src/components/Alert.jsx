import { useEffect, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { XMarkIcon, BellAlertIcon } from "@heroicons/react/24/outline";
import { notificationStore } from "../stores/notificationStore";
import { store } from "../stores/store";

const Alert = observer(() => {
  const handleClose = useCallback(
    (id) => {
      notificationStore.removeMessage(id);
    },
    []
  );

  useEffect(() => {
    if (store.message) {
      notificationStore.addMessage(store.message);
      store.setMessage("");
    }
  }, [store.message]);

  if (notificationStore.messages.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
      {notificationStore.messages.map((notification) => (
        <div
          key={notification.id}
          className="bg-white border border-pink-300 p-4 rounded-lg shadow-md flex items-center justify-between space-x-4 animate-slide-in"
        >
          <BellAlertIcon className="h-6 w-6 text-pink-500" />
          <p className="text-gray-800">{notification.message}</p>
          <button
            onClick={() => handleClose(notification.id)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
});

export default Alert;