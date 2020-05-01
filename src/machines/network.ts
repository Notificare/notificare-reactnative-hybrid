import { useEffect, useState } from 'react';

export type MachineState<T> =
  | { status: 'idle' }
  | { status: 'pending' }
  | { status: 'successful'; result: T }
  | { status: 'failed'; reason: Error };

export interface MachineActions {
  start: () => void;
}

export interface MachineOptions {
  autoStart?: boolean;
}

export function useNetworkRequest<T>(request: Promise<T>, options?: MachineOptions): [MachineState<T>, MachineActions] {
  const [state, setState] = useState<MachineState<T>>({ status: 'idle' });

  const actions: MachineActions = {
    start: async () => {
      // Prevent the request from being fired multiple times.
      if (state.status == 'pending') {
        console.log('This network request is already ongoing. Skipping...');
        return;
      }

      try {
        // Transition to pending.
        setState({ status: 'pending' });

        // Fire the request.
        const result = await request;

        // Transition to successful.
        setState({ status: 'successful', result });
      } catch (e) {
        // Transition to failed.
        setState({ status: 'failed', reason: e });
      }
    },
  };

  if (options?.autoStart === true) {
    // Automatically start the request upon mounting the component.
    useEffect(() => {
      actions.start();
    }, []);
  }

  return [state, actions];
}
