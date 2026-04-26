class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;
  
    constructor(statusCode: number, message: string, options?: ErrorOptions) {
      super(message, options);
  
      this.statusCode = statusCode;
      this.isOperational = true;
  
      // Set the prototype explicitly (important for TS/Node inheritance)
      Object.setPrototypeOf(this, new.target.prototype);
    }
  }
  
  export default ApiError;