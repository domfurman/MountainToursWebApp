import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

export const requestInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  let token = sessionStorage.getItem('token');

  if (token) {
    req = req.clone({ headers: req.headers.set('Authorization', token) });
  }

  return next(req);
};
