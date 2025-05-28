import {
	HttpException,
	HttpStatus,
	Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthConfigService } from '@/apps/auth/configs/env.config';
import { TokenService } from '@/apps/auth/token.service';
import { RedisService } from '@/dynamic-modules/redis/redis.service';
import {
	LoginResponseDto,
	RegisterDto,
} from '@/libs/contracts';
import { WhereByEmailScope } from '@/libs/models/scopes/common/where-by-email.scope';
import { UserLoginAttributesScope } from '@/libs/models/scopes/user/user-login.attributes.scope';
import { UserRepository } from '@/libs/modules/user/user.repository';

const UNAUTHORIZED_ERROR = {
	status: HttpStatus.UNAUTHORIZED,
	errorCode: 'AutorizationError',
	error: 'Ошибка авторизации',
	message: 'Логин или пароль неверный',
};

@Injectable()
export class AuthService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly tokenService: TokenService,
		private redisService: RedisService,
		private readonly configService: AuthConfigService,
	) {}

	async authUser(data): Promise<LoginResponseDto> {
		const { email, password } = data;

		const user = await this.userRepository
			.scope(new WhereByEmailScope(), email)
			.scope(new UserLoginAttributesScope())
			.plain()
			.findOne();
		
		if (!user) {
			throw new HttpException(
				UNAUTHORIZED_ERROR,
				HttpStatus.UNAUTHORIZED,
			);
		}
		
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		
		if (!isPasswordMatch) {
			throw new HttpException(
				UNAUTHORIZED_ERROR,
				HttpStatus.UNAUTHORIZED,
			);
		}
		const tokens = await this.tokenService.generateTokens(user);
		
		await this.redisService.set(
			`${user.id}:refreshToken`,
			tokens.refreshToken,
			this.configService.get('JWT_REFRESH_TOKEN_EXPIRE'),
		);
		
		return {
			...tokens,
			userId: user.id,
		}
	}
	
	async register(data: RegisterDto): Promise<null> {
		const userExist = await this.userRepository
			.scope(new WhereByEmailScope(), data.email)
			.plain()
			.findOne();
		
		if (userExist) {
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					errorCode: 'RegistrationError',
					error: 'Ошибка регистрации',
					message: 'Пользователь с таким email уже существует',
				},
				HttpStatus.BAD_REQUEST,
			);
		}
		
		const password = await bcrypt.hash(data.password, 10);
		
		const preparedData = {
			...data,
			password
		}
		
		try {
			await this.userRepository.create(preparedData);
		} catch (error) {
			throw new HttpException(
				{
					status: HttpStatus.BAD_REQUEST,
					errorCode: 'RegistrationError',
					error: 'Ошибка регистрации',
					message: 'Не удалось зарегистрировать пользователя',
				},
				HttpStatus.BAD_REQUEST,
			);
		}
		return null;
	}
}
