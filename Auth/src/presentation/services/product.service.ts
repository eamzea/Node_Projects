import { CustomError } from '../../domain/errors';
import { CreateProductDto, PaginationDto } from '../../domain/dtos';
import { ProductModel } from '../../config/data';

export class ProductService {
  constructor() {}

  async createProduct(createProductDto: CreateProductDto) {
    const productExists = await ProductModel.findOne({ name: createProductDto.name });

    if (productExists) {
      throw CustomError.badRequest('Category already exists');
    }

    try {
      const product = new ProductModel({
        ...createProductDto,
      });

      await product.save();

      return product;
    } catch (error) {
      throw error instanceof CustomError ? error : CustomError.internalServer(`${error}`);
    }
  }

  async getProducts(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [total, products] = await Promise.all([
        ProductModel.countDocuments(),
        ProductModel.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate('user')
          .populate('category'),
      ]);

      return {
        page,
        limit,
        total,
        next: `/api/product?page${page + 1}&limit=${limit}`,
        prev: page - 1 > 0 ? `/api/product?page${page - 1}&limit=${limit}` : null,
        products,
      };
    } catch (error) {
      throw error instanceof CustomError ? error : CustomError.internalServer(`${error}`);
    }
  }
}
