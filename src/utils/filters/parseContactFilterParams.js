const parseIsFavourite = (favourite) => {
  const isString = typeof favourite === 'string';
  if (!isString) return;

  const isBoollean = favourite === 'true' || favourite === 'false';
  if (!isBoollean) return;

  return favourite;
};

const parseContactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;

  const isContactType = (contactType) =>
    ['personal', 'work', 'home'].includes(contactType);

  if (isContactType(contactType)) return contactType;
};

export const parseContactFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseContactType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
