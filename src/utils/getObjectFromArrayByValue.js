const getObjectFromArrayByValue = (array, objectKey, objectValue) => {
    const res = array.find(el => el[objectKey] === objectValue);
    return res || null;
};

export default getObjectFromArrayByValue;