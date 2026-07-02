import fs from 'fs';
import path from 'path';

const storeName = process.argv[2];

if (!storeName) {
  console.error('Please provide a store name');
  process.exit(1);
}

// npm runs scripts from the directory containing package.json, even when the
// command was started in a nested directory. INIT_CWD preserves that directory.
const basePath = process.env.INIT_CWD || process.cwd();

fs.mkdirSync(basePath, { recursive: true });

const files = {
  [`${storeName}.interface.ts`]: `export interface ${capitalize(storeName)} {

}
`,

  [`${storeName}.service.ts`]: `import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ${capitalize(storeName)}Service {}
`,

  [`${storeName}.actions.ts`]: `import { createActionGroup, emptyProps } from '@ngrx/store';

export const ${capitalize(storeName)}Actions = createActionGroup({
  source: '${capitalize(storeName)}',
  events: {
    'Load': emptyProps(),
  },
});
`,

  [`${storeName}.state.ts`]: `export interface ${capitalize(storeName)}State {

}

export const initialState: ${capitalize(storeName)}State = {

};
`,

  [`${storeName}.reducer.ts`]: `import { createReducer } from '@ngrx/store';
import { initialState } from './${storeName}.state';

export const ${storeName}FeatureKey = '${storeName}';

export const ${storeName}Reducer = createReducer(
  initialState,
);
`,

  [`${storeName}.selectors.ts`]: `import { createFeatureSelector } from '@ngrx/store';
import { ${capitalize(storeName)}State } from './${storeName}.state';

export const select${capitalize(storeName)}State =
  createFeatureSelector<${capitalize(storeName)}State>('${storeName}');
`,

  [`${storeName}.effects.ts`]: `import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class ${capitalize(storeName)}Effects {
  constructor(private actions$: Actions) {}
}
`,

  [`${storeName}.facade.ts`]: `import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ${capitalize(storeName)}Actions } from './${storeName}.actions';
import { select${capitalize(storeName)}State } from './${storeName}.selectors';

@Injectable({
  providedIn: 'root',
})
export class ${capitalize(storeName)}Facade {
  private readonly store = inject(Store);

  readonly state = this.store.selectSignal(select${capitalize(storeName)}State);

  load(): void {
    this.store.dispatch(${capitalize(storeName)}Actions.load());
  }
}
`,

  ['index.ts']: `export * from './${storeName}.actions';
export * from './${storeName}.effects';
export * from './${storeName}.facade';
export * from './${storeName}.interface';
export * from './${storeName}.reducer';
export * from './${storeName}.selectors';
export * from './${storeName}.service';
export * from './${storeName}.state';
`,
};

for (const [file, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(basePath, file), content);
}

console.log(`✓ Created store: ${storeName}`);

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
