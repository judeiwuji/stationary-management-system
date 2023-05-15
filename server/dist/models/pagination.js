"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Pagination {
    constructor(page = 1, pageSize = 10) {
        this.page = page;
        this.pageSize = pageSize;
        this.startIndex = 0;
        this.endIndex = 0;
        this.startIndex = (page - 1) * pageSize;
        this.endIndex = page * pageSize;
    }
    totalPages(totalItems, pageSize = 10) {
        return Math.ceil(totalItems / pageSize);
    }
}
exports.default = Pagination;
//# sourceMappingURL=pagination.js.map