export enum MessageBoxTypes {
  INFO,
  PROMPT,
}

export enum MessageBoxResponse {
  OK,
  CANCEL,
  DISMISS,
}

export interface IMessageBoxOptions {
  message?: string;
  type: MessageBoxTypes;
  onConfirm: () => void;
  onCancel: () => void;
  onDismiss: () => void;
}
