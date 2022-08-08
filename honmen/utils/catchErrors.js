const catchErrors = (error) => {
  let errorMsg;

  if (error.response) {
    // If the request was made and the server didn't respond with a status code in the range of 2xx
    errorMsg = error.response.data;

    console.error(errorMsg);
  } else if (error.request) {
    // If the request was made and no response was received from the server
    errorMsg = error.request;

    console.error(errorMsg);
  } else {
    // If something else happened while making the request
    errorMsg = error.message;

    console.error(errorMsg);
  }
  return errorMsg;
};

export default catchErrors;
