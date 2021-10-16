export type ApiResponse = {
  success: boolean;
  data?: any;
  message?: string;
};

export const apiResponse = (
  success: boolean,
  data?: any,
  message?: string,
): ApiResponse => {
  return {
    success,
    data,
    message,
  };
};
