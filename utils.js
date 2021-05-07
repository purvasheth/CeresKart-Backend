async function wrapWithTryCatch(res, callback, statusCode = 500) {
  try {
    await callback();
  } catch (error) {
    res.status(statusCode).json({ message: error.message });
  }
}

module.exports = { wrapWithTryCatch };
