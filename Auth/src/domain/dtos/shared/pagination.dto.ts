export class PaginationDto {
  private constructor(public readonly page: number, public readonly limit: number) {}

  static create(page: number = 1, limit: number = 10): [string?, PaginationDto?] {
    if (isNaN(page) || isNaN(limit)) {
      return ['Invalid pagination', undefined];
    }

    if (page < 1) {
      return ['Page must be greater than 0', undefined];
    }

    if (limit < 1) {
      return ['Limit must be greater than 0', undefined];
    }

    return [undefined, new PaginationDto(page, limit)];
  }
}
