import { IsEmail, IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class LoginDto {
	@IsNotEmpty({ message: 'Email обязателен' })
	@IsEmail({}, { message: 'Некорректный email' })
	email: string;

	@IsString()
	@IsNotEmpty({ message: 'Пароль обязателен' })
	@MinLength(6, {
		message: 'Пароль должен быть не менее 6 символов',
	})
	password: string;
}

export class RegisterDto {
	@IsNotEmpty({ message: 'Email обязателен' })
	@IsEmail({}, { message: 'Некорректный email' })
	email: string;

	@IsString()
	@IsNotEmpty({ message: 'Пароль обязателен' })
	@MinLength(6, {
		message: 'Пароль должен быть не менее 6 символов',
	})
	password: string;

	@IsString()
	@IsNotEmpty({ message: 'Имя обязательно' })
	name: string;
}

export class LoginResponseDto {
	@IsString()
	accessToken: string;

	@IsString()
	refreshToken: string;

	@IsString()
	@IsUUID()
	userId: string;
}
