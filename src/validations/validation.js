export function validate (schema, req){
    const result = schema.validate(req, {
        abortEarly: false,
        convert: true
    });

    if(result.error){
        throw result.error;
    }else{
        return result.value;
    }
}