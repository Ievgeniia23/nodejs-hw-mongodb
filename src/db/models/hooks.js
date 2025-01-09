export const handleSaveError = (error, doc, next) => {
  error.status = 400;
  next();
};

export const setUpdateSettings = function (next) {
    this.getOptions.new = true;
    this.getOptions.runvalidators = true;
    next();
};

