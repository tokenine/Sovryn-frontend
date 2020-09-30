import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { BigNumber, bignumber, Fraction, MathArray, Matrix } from 'mathjs';

type BN =
  | number
  | string
  | Fraction
  | BigNumber
  | MathArray
  | Matrix
  | boolean
  | null;

export interface IAmountStateOptions {
  min: BN;
  max: BN;
}

export function useAmountState(
  initialValue: BN,
  options?: Partial<IAmountStateOptions>,
): [string, Dispatch<SetStateAction<string>> | any] {
  const [value, setValue] = useState<string>(initialValue as any);

  const handleValueChange = useCallback(
    (newValue: BN) => {
      try {
        if (
          newValue === '' ||
          newValue === '0' ||
          newValue === '0.' ||
          newValue === '0,'
        ) {
          setValue(newValue.replace(',', '.'));
          return;
        }

        let bnValue = bignumber(newValue);
        if (bnValue.lessThanOrEqualTo(0)) {
          bnValue = bignumber(0);
        }

        if (
          options?.max !== undefined &&
          bnValue.greaterThan(bignumber(options.max))
        ) {
          bnValue = bignumber(options.max);
        }

        if (
          options?.min !== undefined &&
          bnValue.lessThan(bignumber(options.min))
        ) {
          bnValue = bignumber(options.min);
        }

        setValue(String(bnValue));
      } catch (e) {
        setValue('0');
      }
    },
    [options],
  );

  return [value, handleValueChange];
}