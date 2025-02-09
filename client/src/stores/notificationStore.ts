import { makeAutoObservable } from "mobx";

interface Notification {
  id: string; 
  message: string;
}

class NotificationStore {
  messages: Notification[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addMessage(message: string) {
    const newNotification = {
      id: Date.now().toString(),
      message,
    };
    this.messages.push(newNotification);

    setTimeout(() => {
      this.removeMessage(newNotification.id);
    }, 5000);
  }

  removeMessage(id: string) {
    this.messages = this.messages.filter((msg) => msg.id !== id);
  }

  clearMessages() {
    this.messages = [];
  }
}

export const notificationStore = new NotificationStore();