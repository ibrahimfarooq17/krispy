export const SET_CURRENT_SUB_FLOW = 'SET_CURRENT_SUB_FLOW';
export const SET_ALL_SUB_FLOWS = 'SET_ALL_SUB_FLOWS';
export const ADD_SUB_FLOW_NODE = 'ADD_SUB_FLOW_NODE';
export const ADD_SUB_FLOW_EDGE = 'ADD_SUB_FLOW_EDGE';
export const SET_SUB_FLOW_NODES = 'SET_SUB_FLOW_NODES';
export const SET_SUB_FLOW_EDGES = 'SET_SUB_FLOW_EDGES';
export const UPDATE_SUB_FLOW_NODE_POSITION = 'UPDATE_SUB_FLOW_NODE_POSITION';
export const UPDATE_SUB_FLOW_NODE_DATA = 'UPDATE_SUB_FLOW_NODE_DATA';
export const REMOVE_SUB_FLOW_NODE = 'REMOVE_SUB_FLOW_NODE';
export const REMOVE_SUB_FLOW_EDGE = 'REMOVE_SUB_FLOW_EDGE';
export const SAVE_SUB_FLOW = 'SAVE_SUB_FLOW';
export const REMOVE_SUB_FLOW = 'REMOVE_SUB_FLOW';
export const RESET_CURRENT_SUB_FLOW_NODES = 'RESET_CURRENT_SUB_FLOW_NODES';
export const RESET_CURRENT_SUB_FLOW_EDGES = 'RESET_CURRENT_SUB_FLOW_EDGES';
export const RESET_ALL_SUB_FLOWS = 'RESET_ALL_SUB_FLOWS';

// * TODO - implement this after writing backend route
export const getAllSubFlows = (subflows) => {
	return (dispatch) => {
		dispatch({
			type: GET_ALL_SUB_FLOWS,
			payload: subflows || [],
		});
	};
};

export const setCurrentSubFlow = ({ startNode }) => {
	return (dispatch) => {
		dispatch({
			type: SET_CURRENT_SUB_FLOW,
			payload: { startNode },
		});
	};
};

export const setAllSubFlows = (subFlows) => {
	return (dispatch) => {
		dispatch({
			type: SET_ALL_SUB_FLOWS,
			payload: subFlows,
		});
	};
};

// export const updateCurrentSubFlow = (subflowId, updatedSubFlow) => {
// 	return (dispatch) => {
// 		dispatch({
// 			type: UPDATE_CURRENT_SUB_FLOW,
// 			payload: { subflowId, updatedSubFlow },
// 		});
// 	};
// };

export const addSubFlowNode = (nodeData) => {
	return (dispatch) => {
		dispatch({
			type: ADD_SUB_FLOW_NODE,
			payload: nodeData,
		});
	};
};

export const setSubFlowNodes = (nodes) => {
	return (dispatch) => {
		dispatch({
			type: SET_SUB_FLOW_NODES,
			payload: nodes,
		});
	};
};

export const setSubFlowEdges = (edges) => {
	return (dispatch) => {
		dispatch({
			type: SET_SUB_FLOW_EDGES,
			payload: edges,
		});
	};
};

export const addSubFlowEdge = (edgeData) => {
	return (dispatch) => {
		dispatch({
			type: ADD_SUB_FLOW_EDGE,
			payload: edgeData,
		});
	};
};

export const updateSubFlowNodePosition = ({ id, position }) => {
	return (dispatch) => {
		dispatch({
			type: UPDATE_SUB_FLOW_NODE_POSITION,
			payload: { id, position },
		});
	};
};

export const updateSubFlowNodeData = ({ id, data }) => {
	return (dispatch) => {
		dispatch({
			type: UPDATE_SUB_FLOW_NODE_DATA,
			payload: { id, data },
		});
	};
};

export const removeSubFlowNode = ({ id }) => {
	return (dispatch) => {
		dispatch({
			type: REMOVE_SUB_FLOW_NODE,
			payload: { id },
		});
	};
};

export const removeSubFlowEdge = ({ id }) => {
	return (dispatch) => {
		dispatch({
			type: REMOVE_SUB_FLOW_EDGE,
			payload: { id },
		});
	};
};

export const saveSubFlow = ({ startNode }) => {
	return (dispatch) => {
		dispatch({
			type: SAVE_SUB_FLOW,
			payload: { startNode },
		});
	};
};

export const removeSubFlow = ({ id }) => {
	return (dispatch) => {
		dispatch({
			type: REMOVE_SUB_FLOW,
			payload: { id },
		});
	};
};

export const resetCurrentSubFlowNodes = () => {
	return (dispatch) => {
		dispatch({
			type: RESET_CURRENT_SUB_FLOW_NODES,
			payload: null,
		});
	};
};

export const resetCurrentSubFlowEdges = () => {
	return (dispatch) => {
		dispatch({
			type: RESET_CURRENT_SUB_FLOW_EDGES,
			payload: null,
		});
	};
};

export const resetAllSubFlows = () => {
	return (dispatch) => {
		dispatch({
			type: RESET_ALL_SUB_FLOWS,
			payload: null,
		});
	};
};
