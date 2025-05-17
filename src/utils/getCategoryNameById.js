const getCategoryNameById = (categories, categoryId) => {
    // @ts-ignore
    const category = categories.find((category) => category.id === categoryId);
    return category ? category.name : 'Неизвестная категория';
};

export default getCategoryNameById;