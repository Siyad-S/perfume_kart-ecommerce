// Functional ApiFeatures

export const applyApiFeatures = (query: any, queryString: any) => {
    // 1) Filtering
    const queryObj = { ...queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let mongooseQuery = query.find(JSON.parse(queryStr));

    // 2) Sorting
    if (queryString.sort) {
        const sortBy = queryString.sort.split(',').join(' ');
        mongooseQuery = mongooseQuery.sort(sortBy);
    } else {
        mongooseQuery = mongooseQuery.sort('-createdAt');
    }

    // 3) Field Limiting
    if (queryString.fields) {
        const fields = queryString.fields.split(',').join(' ');
        mongooseQuery = mongooseQuery.select(fields);
    } else {
        mongooseQuery = mongooseQuery.select('-__v');
    }

    // 4) Pagination
    const page = queryString.page * 1 || 1;
    const limit = queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    mongooseQuery = mongooseQuery.skip(skip).limit(limit);

    return mongooseQuery;
};
