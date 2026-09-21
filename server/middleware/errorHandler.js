export const errorHandler = (err, req, res, next) => {
  console.error('Server error:', err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Unable to connect to SkillNexus. Please try again.',
    code: err.code || 'SERVER_ERROR',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
