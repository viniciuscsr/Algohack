const getElementByText = (text, nodeList) => {
  //convert node list
  const arr = Array.from(nodeList);
  const foundElement = arr.find((el) => {
    return el.textContent.toLowerCase().trim().includes(text.toLowerCase());
  });

  //return HTML element object.
  return foundElement;
};

module.exports = { getElementByText };
