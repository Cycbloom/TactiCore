import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(message: string, details?: any) {
    super(
      {
        message,
        error: 'Business Error',
        details,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string, details?: any) {
    super(
      {
        message,
        error: 'Not Found',
        details,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class ValidationException extends HttpException {
  constructor(message: string, details?: any) {
    super(
      {
        message,
        error: 'Validation Error',
        details,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string, details?: any) {
    super(
      {
        message,
        error: 'Unauthorized',
        details,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string, details?: any) {
    super(
      {
        message,
        error: 'Forbidden',
        details,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
