"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Converter {
    static toJson(data) {
        try {
            return JSON.parse(data);
        }
        catch (error) {
            return null;
        }
    }
}
exports.default = Converter;
//# sourceMappingURL=converter.js.map