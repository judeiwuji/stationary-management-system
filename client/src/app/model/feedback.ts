export interface IFeedback<T> {
  success: boolean;
  data: T;
  results: T[];
  message: string;
  page: number;
  totalPages: number;
}
