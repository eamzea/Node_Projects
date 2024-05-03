import { Validators } from "../../../config";

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly description: number,
    public readonly user: string,
    public readonly category: string,
  ) {}

  static create(object: Record<string, any>): [string?, CreateProductDto?] {
    const { name, available, price, description, user, category } = object;

    if (!name) {
      return ['Name is required'];
    }
    if (!user) {
      return ['User is required'];
    }
    if (!Validators.isMongoID(user)) {
      return ['User is not valid'];
    }
    if (!category) {
      return ['Category is required'];
    }
    if (!Validators.isMongoID(category)) {
      return ['Category is not valid']
    }

    return [undefined, new CreateProductDto(name, !!available, price, description, user, category)];
  }
}
