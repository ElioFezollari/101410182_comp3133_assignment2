import { ApplicationConfig, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo, APOLLO_NAMED_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        cache: new InMemoryCache(),
        link: httpLink.create({
          uri: 'http://localhost:4000/graphql/user', 
        }),
      };
    }),
    {
      provide: APOLLO_NAMED_OPTIONS,
      useFactory: () => {
        const httpLink = inject(HttpLink);
        return {
          employee: {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: 'http://localhost:4000/graphql/employee', 
            }),
          },
        };
      },
      deps: [HttpLink],
    }
  ]
};
