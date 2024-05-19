import { ApplicationConfig } from '@angular/core';

import { routes } from './app.routes';
import {provideRouter} from "@angular/router";
import {AuthService} from "./services/auth.service";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {requestInterceptor} from "./core/interceptor/request.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
  AuthService,
  provideHttpClient(withInterceptors([requestInterceptor]))]
};
