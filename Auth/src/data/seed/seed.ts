import { envs } from '../../config';
import { CategoryModel, MongoDataBase, UserModel, ProductModel } from '../../config/data';
import { seedData } from './data';

async () => {
  await MongoDataBase.connect({
    dbName: envs.DB_NAME,
    mongoUrl: envs.MONGO_URL,
  });

  await main();

  await MongoDataBase.disconnect();
};

const randomBetween0AndX = (x: number) => {
  return Math.floor(Math.random() * x);
};

async function main() {
  await Promise.all([
    UserModel.deleteMany(),
    CategoryModel.deleteMany(),
    ProductModel.deleteMany(),
  ]);

  const users = await UserModel.insertMany(seedData.users);
  const categories = await CategoryModel.insertMany(
    seedData.categories.map(category => ({
      ...category,
      user: users[randomBetween0AndX(seedData.users.length - 1)].id,
    })),
  );
  const products = await ProductModel.insertMany(seedData.products.map(product => ({
    ...product,
    user: users[randomBetween0AndX(seedData.users.length - 1)].id,
    category: categories[randomBetween0AndX(seedData.categories.length - 1)].id,
  })))
}
