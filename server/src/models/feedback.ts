export default class Feedback<T> {
  success = true;
  data!: T;
  results!: T[];
  message!: string;
  page!: number;
  totalPages!: number;
  redirect?: string;
}
