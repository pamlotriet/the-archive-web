import { createActionGroup, emptyProps } from '@ngrx/store';

export const AuthenticationActions = createActionGroup({
  source: 'Authentication',
  events: {
    'Load': emptyProps(),
  },
});
