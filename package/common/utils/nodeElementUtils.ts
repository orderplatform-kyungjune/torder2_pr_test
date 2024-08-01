/* eslint-disable no-undef */
const convertNodeListsToArray = (nodes: NodeListOf<Element>) => Array.prototype.slice.call(nodes) as Element[];

export default convertNodeListsToArray;
