import { IAlphaRule, IRuleFunction, IRuleResult } from '../types';
import { ensureRule } from './utils/ensureRule';

export const alphabetical: IRuleFunction<IAlphaRule> = (object, r, ruleMeta) => {
  const results: IRuleResult[] = [];

  const { keyedBy, properties: inputProperties } = r.input;

  let properties = inputProperties;
  if (properties && !Array.isArray(properties)) {
    properties = [properties];
  }

  for (const property of properties) {
    if (!object[property] || object[property].length < 2) {
      continue;
    }

    const arrayCopy: object[] = object[property].slice(0);

    // If we aren't expecting an object keyed by a specific property, then treat the
    // object as a simple array.
    if (keyedBy) {
      arrayCopy.sort((a, b) => {
        if (a[keyedBy] < b[keyedBy]) {
          return -1;
        } else if (a[keyedBy] > b[keyedBy]) {
          return 1;
        }

        return 0;
      });
    } else {
      arrayCopy.sort();
    }

    const res = ensureRule(() => {
      object.should.have.property(property);
      object[property].should.be.deepEqual(arrayCopy);
    }, ruleMeta);

    if (res) {
      results.push(res);
    }
  }

  return results;
};