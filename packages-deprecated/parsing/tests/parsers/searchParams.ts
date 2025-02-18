import { expect, it } from 'vitest';

import { date, searchParams, string } from '../../src/index.js';

it('should throw an error in case, passed value is not of type string or URLSearchParams', () => {
  const parser = searchParams({});
  expect(() => parser.parse(true)).toThrow();
  expect(() => parser.parse({})).toThrow();
  expect(() => parser.parse('true')).not.toThrow();
  expect(() => parser.parse(new URLSearchParams())).not.toThrow();
});

it('should throw an error in case, passed value does not contain required field presented in schema', () => {
  const parser = searchParams({ prop: string() });

  try {
    parser.parse('abc=123');
  } catch (e) {
    expect(e).toMatchObject({
      message: 'Unable to parse value',
      cause: {
        message: 'Unable to parse field "prop" as string',
        cause: {
          message: 'Unable to parse value as string',
          cause: {
            message: 'Value has unexpected type',
          },
        },
      },
    });
  }
  expect.assertions(1);
});

it('should not throw an error in case, passed value does not contain optional field presented in schema', () => {
  const parser = searchParams<{ prop?: string }>({
    prop: string().optional(),
  });
  expect(parser.parse('')).toEqual({});
  expect(parser.parse('prop=abc')).toEqual({ prop: 'abc' });
});

it('should use parser with unspecified type', () => {
  const parser = searchParams<{ prop: unknown }>({
    prop: () => {
      throw new Error('Just an error');
    },
  });

  try {
    parser.parse('prop=');
  } catch (e) {
    expect(e).toMatchObject({
      message: 'Unable to parse value',
      cause: {
        message: 'Unable to parse field "prop"',
        cause: {
          message: 'Just an error',
        },
      },
    });
  }
  expect.assertions(1);
});

it('should throw an error in case, passed value contains field of different type presented in schema', () => {
  const parser = searchParams({ prop: date() });

  try {
    parser.parse('prop=abc');
  } catch (e) {
    expect(e).toMatchObject({
      message: 'Unable to parse value',
      cause: {
        message: 'Unable to parse field "prop" as Date',
        cause: {
          message: 'Unable to parse value as Date',
          cause: {
            message: 'Unable to parse value as number',
            cause: {
              message: 'Value has unexpected type',
            },
          },
        },
      },
    });
  }
  expect.assertions(1);
});

it('should correctly parse built-in types', () => {
  const parser = searchParams({
    date: date(),
    string: string(),
  });
  const params = new URLSearchParams();
  params.set('date', '66653332');
  params.set('string', 'some string');
  expect(parser.parse(params)).toEqual({
    date: new Date(66653332000),
    string: 'some string',
  });
});
