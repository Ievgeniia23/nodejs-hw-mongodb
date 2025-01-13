export const handleSaveError = (error, doc, next) => {
  const { name, code } = error;
  
  error.status = (name === "MongoServerError" && code === 11000) ? 409 : 400;
  next();
};

export const setUpdateSettings = function (next) {
    this.getOptions.new = true;
    this.getOptions.runvalidators = true;
    next();
};

