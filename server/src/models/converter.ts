export default class Converter {
  static toJson(data: string) {
    try {
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }
}
