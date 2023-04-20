export default class Feedback<T> {
  success = true;
  data!: T;
  results!: T[];
  message!: string;
}
