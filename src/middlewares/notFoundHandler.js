export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: 404,
    message: 'Route not found',
  });
};

// export const notFoundHandler = (req, res) => {
//     res.status(404).json({
//         message: `${req.url} not found`,
//     });
// };
