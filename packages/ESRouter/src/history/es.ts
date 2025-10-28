import {info} from '../log/info'
import {
  RouterHistory,
  NavigationCallback,
  NavigationType,
  NavigationDirection,
  NavigationInformation,
  HistoryLocation,
  ValueContainer,
  START
} from './common'

export type ESRouterHistory = RouterHistory & {
  position: number;
};


const TRAILING_SLASH_RE = /\/$/;
const removeTrailingSlash = (path: string) => path.replace(TRAILING_SLASH_RE, '');

// remove any character before the hash
const BEFORE_HASH_RE = /^[^#]+#/;

function createHref(base: string, location: HistoryLocation): string {
  return `${base.replace(BEFORE_HASH_RE, '#')}${location}`;
}

/**
 * normalize router path base
 *
 * @param rawBase
 */
function normalizeBase(rawBase?: string) {
  let base = rawBase;
  if (!base) {
    base = '/';
  }

  // ensure leading slash when it was removed by the regex above avoid leading
  // slash with hash because the file could be read from the disk like file://
  // and the leading slash would cause problems
  if (base[0] !== '/' && base[0] !== '#') {
    base = `/${base}`;
  }

  // remove the trailing slash so all other method can just do `base + fullPath`
  // to build a href
  return removeTrailingSlash(base);
}

/**
 * Create an in-memory based history. similar with memory history in vue-router.
 * the only different is this history mode support hardware back press for android.
 *
 * @public
 */
export function createESHistory(rawBase = ''): ESRouterHistory {
  // history queue
  let queue: HistoryLocation[] = [START];
  // current position
  let position = 0;
  let listeners: NavigationCallback[] = [];
  // normalize base
  const base = normalizeBase(rawBase);
  //
  let currentLocation: ValueContainer<HistoryLocation> = {
    value: START
  };

  function setLocation(location: HistoryLocation): void {
    position += 1;
    queue.push(location);
    info('history::setLocation', 'position:' + position, 'queue:', queue.length)
  }

  function triggerListeners(
    to: HistoryLocation,
    from: HistoryLocation,
    {direction, delta}: Pick<NavigationInformation, 'direction' | 'delta'>,
  ): void {
    const info: NavigationInformation = {
      direction,
      delta,
      type: NavigationType.pop,
    };

    for (const callback of listeners) {
      callback(to, from, info);
    }
  }

  const routerHistory: ESRouterHistory = {
    // rewritten by Object.defineProperty
    location: START,
    state: {},
    base,
    createHref: createHref.bind(null, base),

    replace(to) {
      info('history::replace start...', 'position:' + position, 'queue:', queue.length)
      queue.splice(position, 1);
      //
      position -= 1;
      setLocation(to);
      currentLocation.value = to;
      info('history::replace end...', 'position:' + position, 'queue:', queue.length)
    },

    push(to: HistoryLocation) {
      setLocation(to);
      currentLocation.value = to;
      info('history::push', 'position:' + position, 'queue:', queue.length)
    },

    splice(to: HistoryLocation) {
      info('history::splice start...', 'position:' + position, 'queue:', queue.length)
      const index = queue.findIndex((location) => location.key == to.key
        && location.location == to.location)
      if (index > -1) {
        const location: HistoryLocation = queue[index]
        position = Math.min(position - 1, queue.length - 1);
        if (position < 0) {
          queue = [START];
          currentLocation.value = START;
        } else {
          queue.splice(index, 1);
          currentLocation.value = queue[queue.length - 1];
        }
        const direction: NavigationDirection = NavigationDirection.back;
        const from = currentLocation.value;
        const delta: number = -1;
        triggerListeners(currentLocation.value, location, {
          direction,
          delta,
        });
        return true
      }
      return false
    },

    listen(callback: NavigationCallback) {
      listeners.push(callback);

      return () => {
        const index = listeners.indexOf(callback);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    },

    destroy() {
      listeners = [];
      queue = [START];
      position = 0;
      currentLocation.value = START;
    },
    go(delta: number, shouldTrigger = true): boolean {
      info('history::go start', 'position:' + position)
      if (position + delta < 0) {
        return false;
      }
      const from = currentLocation.value;
      const direction: NavigationDirection = delta < 0 ? NavigationDirection.back : NavigationDirection.forward;
      position = Math.min(position + delta, queue.length - 1);

      info('history::go ', 'queue:' + queue.length, 'position:' + position)

      if (position <= 0) {
        queue = [START];
        currentLocation.value = START;
        return false
      } else {
        queue.splice(position + 1);
        currentLocation.value = queue[queue.length - 1];
      }
      if (shouldTrigger) {
        triggerListeners(currentLocation.value, from, {
          direction,
          delta,
        });
      }
      return true;
    },

    get position(): number {
      return position;
    },

    getLocation(): HistoryLocation {
      return currentLocation.value
    },

    getHistoryLocations(): HistoryLocation[] {
      return queue;
    },

    clearHistoryLocations(): HistoryLocation[] {
      info('history::clearHistoryLocations start...', 'position:' + position, 'queue:', queue.length)
      let ret = [...queue]
      queue = [START];
      position = 0;
      currentLocation.value = START;
      info('history::clearHistoryLocations end...', 'position:' + position, 'queue:', queue.length)
      return ret;
    },

    popHistoryLocations(delta: number): HistoryLocation[] {
      info('history::popHistoryLocations start...', 'delta:' + delta, 'position:' + position, 'queue:', queue.length)
      if (delta < queue.length) {
        position -= delta;
        let index = queue.length - delta;
        let ret = queue.splice(index, delta);
        currentLocation.value = queue[queue.length - 1];
        info('history::popHistoryLocations end...', 'delta:' + delta, 'position:' + position, 'queue:', queue.length)
        return ret;
      } else if (delta >= queue.length) {
        queue = [START];
        position = 0;
        currentLocation.value = START;
        info('history::popHistoryLocations end...', 'delta:' + delta, 'position:' + position, 'queue:', queue.length)
        return queue;
      }
    }
  };
  return routerHistory;
}
