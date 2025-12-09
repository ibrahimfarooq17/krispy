import krispyAxios from '../../utilities/krispyAxios';

export const GET_ALL_TEMPLATES = 'GET_ALL_TEMPLATES';
export const REMOVE_SINGLE_TEMPLATE = 'REMOVE_SINGLE_TEMPLATE';

export const getAllTemplates = () => {
	return async (dispatch) => {
		const { templates } = await krispyAxios({
			method: 'GET',
			url: 'templates',
		});
		dispatch({
			type: GET_ALL_TEMPLATES,
			payload: templates || [],
		});
	};
};

export const removeSingleTemplate = (templateId) => {
	return (dispatch) => {
		dispatch({
			type: REMOVE_SINGLE_TEMPLATE,
			payload: templateId,
		});
	};
};
