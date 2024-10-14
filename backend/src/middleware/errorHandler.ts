import { NextFunction, Request, Response } from "express";

type err = {
  code: string;
  message: string;
  status: number;
  response: { text: string };
};

const errorHandler = (
  err: err,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log({ err });

  /* This is a check to see if the error code is ENOTFOUND. If it is, it returns a 500 status code with
 a message. */
  if (err.code === "ENOTFOUND") {
    return res.status(500).json({
      message: "Service not available at the moment. Please try again later",
      error: err.message,
      data: null,
    });
  }

  /* This is a check to see if the error status code is a 5xx error. If it is, it returns a 500 status
 code with a message. */
  if (/^5/.test(String(err.status)) || !err.status) {
    const message = err.message || "Unexpected Error!!. We will fix it";
    return res.status(500).json({ message, data: null });
  }

  /* This is a check to see if the error object has a response property. If it does, it parses the
  response text and returns a 400 status code with a message. */
  if (err.response) {
    const errorText = JSON.parse(err.response.text);

    if (errorText) {
      return res.status(400).json({
        message: errorText.message || errorText.error,
        data: null,
      });
    }
  }

  /* This is a check to see if the error object has a status property. If it does, it returns a 400
  status code with a message. */
  if (err) {
    return res.status(err.status).json({ message: err.message, data: null });
  }

  res.status(404).json({ message: "Not Found" });
};

export default errorHandler;
