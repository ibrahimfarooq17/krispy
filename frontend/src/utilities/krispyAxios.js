import axios from 'axios';
import { toast } from 'react-hot-toast';

//@params  method: string, url: string, body: object, auth: boolean
const krispyAxios = async ({
	headers,
	method,
	url,
	body,
	auth = true,
	aiApi = false,
	loadingStateSetter,
	loadingMessage,
	successMessage,
	onSuccess,
	onError,
}) => {
	let toastId;

	const AI_URL = process.env.NEXT_PUBLIC_AI_URL;
	const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

	if (!auth) {
		try {
			if (loadingMessage)
				toastId = toast.loading(loadingMessage, {
					id: toastId,
				});
			if (loadingStateSetter) loadingStateSetter(true);
			const response = await axios({
				method: method,
				url: url?.startsWith('https://')
					? url
					: aiApi
					? `${AI_URL}${url}`
					: `${BASE_URL}${url}`,
				data: body,
			});
			if (toastId || successMessage)
				toast.success(successMessage ? successMessage : 'Successful!', {
					id: toastId,
				});
			if (onSuccess) onSuccess(response.data);
			if (loadingStateSetter) loadingStateSetter(false);
			return response.data;
		} catch (error) {
			console.error(error);
			toast.error(
				error?.response?.data?.msg
					? error?.response?.data?.msg
					: 'Something went wrong!',
				{
					id: toastId,
				}
			);
			if (onError) onError(error?.response?.data);
			if (loadingStateSetter) loadingStateSetter(false);
			return { error: true, errorData: error };
		}
	} else {
		if (typeof window === 'undefined') return;
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
			try {
				if (loadingMessage)
					toastId = toast.loading(loadingMessage, {
						id: toastId,
					});
				if (loadingStateSetter) loadingStateSetter(true);
				const response = await axios({
					method: method,
					headers: {
						Authorization: `Bearer ${accessToken}`,
						...(headers && { ...headers }),
					},
					url: url?.startsWith('https://')
						? url
						: aiApi
						? `${AI_URL}${url}`
						: `${BASE_URL}${url}`,
					data: body,
				});
				if (toastId || successMessage)
					toast.success(successMessage ? successMessage : 'Successful!', {
						id: toastId,
					});
				if (onSuccess) onSuccess(response.data);
				if (loadingStateSetter) loadingStateSetter(false);
				return response.data;
			} catch (error) {
				console.error(error);
				if (error?.response?.status == 401 || error?.response?.status == 403) {
					localStorage.clear();
					window.location.reload();
					toast.error('Session expired!', {
						id: toastId,
					});
					return;
				}
				toast.error(
					error?.response?.data?.msg
						? error?.response?.data?.msg
						: 'Something went wrong!',
					{
						id: toastId,
					}
				);
				if (onError) onError(error?.response?.data);
				if (loadingStateSetter) loadingStateSetter(false);
				return { error: true, errorData: error };
			}
		}
	}
};

export default krispyAxios;
