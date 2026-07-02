import { createActionGroup, emptyProps } from '@ngrx/store';

export const AuthenticationPageActions = createActionGroup({
  source: 'AuthenticationPage',
  events: {
    Load: emptyProps(),
  },
});
