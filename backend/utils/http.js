function sendError(res, status, message, details) {
  const payload = { message };

  if (details) {
    payload.details = details;
  }

  return res.status(status).json(payload);
}

function sendSuccess(res, status, data) {
  return res.status(status).json(data);
}

module.exports = {
  sendError,
  sendSuccess,
};
