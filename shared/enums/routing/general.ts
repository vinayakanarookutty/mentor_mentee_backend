export enum Operations{
    CREATE='create',
    READ='read',
    REPLACE='replace',
    DELETE='delete',
    UPDATE= 'update',
    INVOKE='invoke',
}

export enum HTTP_RESPOSE_CODES{
    CREATE=201,
    READ = 200,
    UPDATE_SUCCESS = 200,
    DELETE = 204,
    DUPLICATE = 409,
    UPDATE_SUCCESS_NO_CONTENT = 204,
    UNKNOWN_ERROR = 500,
    BAD_INPUT = 400,
    UNAUTHORIZED = 401,
    RESOURCE_NOT_FOUND = 404
}
