import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export abstract class BaseHttpProvider {
	protected readonly httpService: HttpService;

	protected constructor(baseURL: string, timeout: number = 5000) {
		this.httpService = new HttpService();
		this.httpService.axiosRef.defaults.baseURL = baseURL;
		this.httpService.axiosRef.defaults.timeout = timeout;
	}

	async get(url: string, config?: AxiosRequestConfig) {
		const { data: responseData } = await firstValueFrom(this.httpService.get(url, config));
		return responseData?.data ?? responseData;
	}

	async post(url: string, data?: any, config?: AxiosRequestConfig) {
		const { data: responseData } = await firstValueFrom(this.httpService.post(url, data, config));
		return responseData?.data ?? responseData;
	}

	async put(url: string, data?: any, config?: AxiosRequestConfig) {
		const { data: responseData } = await firstValueFrom(this.httpService.put(url, data, config));
		return responseData?.data ?? responseData;
	}

	async patch(url: string, data?: any, config?: AxiosRequestConfig) {
		const { data: responseData } = await firstValueFrom(this.httpService.patch(url, data, config));
		return responseData?.data ?? responseData;
	}

	async delete(url: string, config?: AxiosRequestConfig) {
		const { data: responseData } = await firstValueFrom(this.httpService.delete(url, config));
		return responseData?.data ?? responseData;
	}

	async head(url: string, config?: AxiosRequestConfig) {
		const { data: responseData } = await firstValueFrom(this.httpService.head(url, config));
		return responseData?.data ?? responseData;
	}
}
