const getChildNodeIds = (parentId, nodes) => {
	return nodes.filter((node) => node.parentId === parentId);
};

export default getChildNodeIds;
