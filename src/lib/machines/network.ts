import { useEffect, useState } from 'react';

export type MachineState<T> = { status: 'idle' } | { status: 'pending' } | FinishedMachineState<T>;

export type FinishedMachineState<T> = { status: 'successful'; result: T } | { status: 'failed'; reason: Error };

export interface MachineActions<T> {
  start: () => Promise<T | undefined>;
}

export interface MachineOptions<T> {
  autoStart?: boolean;
  onFinished?: (state: FinishedMachineState<T>) => Promise<void>;
}

export type RequestBuilder<T> = () => Promise<T>;

export function useNetworkRequest<T>(
  requestBuilder: RequestBuilder<T>,
  options?: MachineOptions<T>,
): [MachineState<T>, MachineActions<T>] {
  const [state, setState] = useState<MachineState<T>>({ status: 'idle' });

  const actions: MachineActions<T> = {
    start: async () => {
      // Prevent the request from being fired multiple times.
      if (state.status == 'pending') {
        console.log('This network request is already ongoing. Skipping...');
        return undefined;
      }

      try {
        // Transition to pending.
        setState({ status: 'pending' });

        // Fire the request.
        const result = await requestBuilder();

        if (options?.onFinished) {
          console.debug('Running the onFinished function.');
          await options.onFinished({ status: 'successful', result });
        }

        // Transition to successful.
        setState({ status: 'successful', result });

        return result;
      } catch (e) {
        // Transition to failed.
        setState({ status: 'failed', reason: e });

        throw e;
      }
    },
  };

  if (options?.autoStart === true) {
    // Automatically start the request upon mounting the component.
    useEffect(() => {
      actions
        .start()
        .then(() => console.debug('Automatic start finished successfully.'))
        .catch(() => console.debug('Automatic start finished with an error.'));
    }, []);
  }

  return [state, actions];
}
