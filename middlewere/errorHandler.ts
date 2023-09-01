
export const errorHandler = (err,req, res, next) => {
    if (err?.errorCode) {
    res.status(err.errorCode).send({message:err.message || 'Unknown Error',details:err.details || 'No specific details'});
    return next();
  }else{
    res.status(500).json({errorType:'Internal Server Error'});
  }
};
