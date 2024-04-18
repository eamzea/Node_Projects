import { UserModel } from '../../config/data';
import { CustomError } from '../../domain';
import { LoginUserDto, RegisterUserDto } from '../../domain/dtos';
import { UserEntity } from '../../domain/entities';
import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { EmailService } from './email.service';

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const userExists = await UserModel.findOne({ email: registerUserDto.email });

    if (userExists) {
      throw CustomError.badRequest('Email already exists');
    }

    try {
      const user = new UserModel(registerUserDto);

      user.password = bcryptAdapter.hash(registerUserDto.password);

      await user.save();

      await this.sendValidationLinkEmail(user.email);

      const { password, ...userEntity } = UserEntity.fromObject(user);

      const token = await JwtAdapter.generateToken({ id: userEntity.id });

      if (!token) {
        throw CustomError.internalServer('Error while creating JWT');
      }

      return { user: userEntity, token };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const userExists = await UserModel.findOne({ email: loginUserDto.email });

    if (!userExists) {
      throw CustomError.badRequest('User does not exists');
    }

    try {
      const isValidPassword = bcryptAdapter.compare(loginUserDto.password, userExists.password);

      if (!isValidPassword) {
        throw CustomError.unauthorized('Invalid password');
      }

      const { password, ...user } = UserEntity.fromObject(userExists);

      const token = await JwtAdapter.generateToken({ id: user.id });

      if (!token) {
        throw CustomError.internalServer('Error while creating JWT');
      }

      return {
        user,
        token,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  private sendValidationLinkEmail = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });

    if (!token) {
      throw CustomError.internalServer('Error while creating JWT');
    }

    const link = `${envs.WEB_SERVICE_URL}/auth/validate-email/${token}`;

    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate your email: ${email}</a>
    `;

    const options = { to: email, subject: 'Validate your email', htmlBody: html };

    const wasSent = await this.emailService.sendEmail(options);

    if (!wasSent) {
      throw CustomError.internalServer('Error while sending email');
    }

    return true;
  };

  public validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) {
      throw CustomError.unauthorized('Invalid token');
    }

    const { email } = payload;

    if (!email) {
      throw CustomError.internalServer('Email not in token');
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      throw CustomError.internalServer('User not found');
    }

    user.emailValidated = true
    await user.save()
  };
}
