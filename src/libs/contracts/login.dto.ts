import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
	@IsNotEmpty({ message: 'Email обязателен' })
	@IsEmail({}, { message: 'Некорректный email' })
	email: string;

	@IsString()
	@IsNotEmpty({ message: 'Пароль обязателен' })
	@MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
	password: string;
}
