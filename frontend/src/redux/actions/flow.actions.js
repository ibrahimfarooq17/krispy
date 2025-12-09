import krispyAxios from '../../utilities/krispyAxios';

export const GET_ALL_FLOWS = 'GET_ALL_FLOWS';
export const CLEAR_ALL_FLOWS = 'CLEAR_ALL_FLOWS';
export const SET_NODES = 'SET_NODES';
export const SET_EDGES = 'SET_EDGES';
export const ADD_NODE = 'ADD_NODE';
export const ADD_EDGE = 'ADD_EDGE';
export const UPDATE_NODE_POSITION = 'UPDATE_NODE_POSITION';
export const UPDATE_NODE_DATA = 'UPDATE_NODE_DATA';
export const REMOVE_EDGE = 'REMOVE_EDGE';
export const REMOVE_NODE = 'REMOVE_NODE';
export const RESET_NODES = 'RESET_NODES';
export const RESET_EDGES = 'RESET_EDGES';
export const SET_FLOW_ANALYTICS = 'SET_FLOW_ANALYTICS';

export const getAllFlows = () => {
	return async (dispatch) => {
		const { flows } = await krispyAxios({
			method: 'GET',
			url: 'flows',
		});
		dispatch({
			type: GET_ALL_FLOWS,
			payload: flows || [],
		});
	};
};

export const clearAllFlows = () => {
	return (dispatch) => {
		dispatch({
			type: CLEAR_ALL_FLOWS,
			payload: null,
		});
	};
};

export const setNodes = (nodes) => {
	return (dispatch) => {
		dispatch({
			type: SET_NODES,
			payload: nodes,
		});
	};
};

export const setEdges = (edges) => {
	return (dispatch) => {
		dispatch({
			type: SET_EDGES,
			payload: edges,
		});
	};
};

export const addNode = (nodeData) => {
	return (dispatch) => {
		dispatch({
			type: ADD_NODE,
			payload: nodeData,
		});
	};
};

export const addEdge = (edgeData) => {
	return (dispatch) => {
		dispatch({
			type: ADD_EDGE,
			payload: edgeData,
		});
	};
};

export const updateNodePosition = ({ id, position }) => {
	return (dispatch) => {
		dispatch({
			type: UPDATE_NODE_POSITION,
			payload: { id, position },
		});
	};
};

export const updateNodeData = ({ id, data }) => {
	return (dispatch) => {
		dispatch({
			type: UPDATE_NODE_DATA,
			payload: { id, data },
		});
	};
};

export const removeEdge = ({ id }) => {
	return (dispatch) => {
		dispatch({
			type: REMOVE_EDGE,
			payload: { id },
		});
	};
};

export const removeNode = ({ id }) => {
	return (dispatch) => {
		dispatch({
			type: REMOVE_NODE,
			payload: { id },
		});
	};
};

export const resetNodes = () => {
	return (dispatch) => {
		dispatch({
			type: RESET_NODES,
			payload: null,
		});
	};
};

export const resetEdges = () => {
	return (dispatch) => {
		dispatch({
			type: RESET_EDGES,
			payload: null,
		});
	};
};

export const setFlowAnalytics = ({ analytics }) => {
	return (dispatch) => {
		dispatch({
			type: SET_FLOW_ANALYTICS,
			payload: analytics,
		});
	};
};
