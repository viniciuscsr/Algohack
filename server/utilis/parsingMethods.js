const getElementByText = (text, nodeList) => {
  //convert node list
  const arr = Array.from(nodeList);
  const foundElement = arr.find((el) => {
    return el.textContent.toLowerCase().trim().includes(text.toLowerCase());
  });

  //return HTML element object.
  return foundElement;
};

const getElementByExactText = (text, nodeList) => {
  //convert node list
  const arr = Array.from(nodeList);
  const foundElement = arr.find((el) => {
    return el.textContent == text;
  });
  //return HTML element object.
  return foundElement;
};

const getElementByAttributeValue = (nodeList, attributeValue) => {
  const arr = Array.from(nodeList);
  let descriptionElement;
  arr.forEach((el) => {
    el.getAttributeNames().forEach((attrName) => {
      if (
        el.getAttribute(attrName).toLocaleLowerCase().includes(attributeValue)
      ) {
        descriptionElement = el;
        return;
      }
    });
  });
  return descriptionElement;
};

module.exports = {
  getElementByText,
  getElementByExactText,
  getElementByAttributeValue,
};
