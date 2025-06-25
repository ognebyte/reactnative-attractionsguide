const getCategoryNameById = (categories, categoryId) => {
    const category = categories.find((category) => category.id === categoryId);
    return category ? category.name : 'Другое';
};

export default getCategoryNameById;