import notifications from '@redhat-cloud-services/frontend-components-notifications/cjs/notifications';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/cjs/notificationsMiddleware';
import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/files/cjs/ReducerRegistry';
import promiseMiddleware from 'redux-promise-middleware';
import { AdvisoryDetailStore } from './Reducers/AdvisoryDetailStore';
import { AdvisoryListStore } from './Reducers/AdvisoryListStore';
import { AffectedSystemsStore } from './Reducers/AffectedSystemsStore';
import { SystemAdvisoryListStore } from './Reducers/SystemAdvisoryListStore';
import { SystemDetailStore } from './Reducers/SystemDetailStore';
import { SystemsListStore } from './Reducers/SystemsListStore';

let registry;
const persistenceMiddleware = store => next => action => {
    next(action);
    const storeContent = store.getState();
    sessionStorage.setItem('PatchStore', JSON.stringify(storeContent));
};

export function init(...middleware) {
    if (registry) {
        throw new Error('store already initialized');
    }

    registry = new ReducerRegistry({}, [promiseMiddleware(), notificationsMiddleware(), persistenceMiddleware, ...middleware]);

    const storage = JSON.parse(sessionStorage.getItem('PatchStore')) || {};

    registry.register({
        AdvisoryListStore: (state = storage.AdvisoryListStore, action) => AdvisoryListStore,
        SystemsListStore: (state = storage.SystemsListStore, action) => SystemsListStore(state, action),
        SystemDetailStore: (state = storage.SystemDetailStore, action) => SystemDetailStore(state, action),
        SystemAdvisoryListStore: (state = storage.SystemAdvisoryListStore, action) => SystemAdvisoryListStore(state, action),
        AdvisoryDetailStore: (state = storage.AdvisoryDetailStore, action) => AdvisoryDetailStore(state, action),
        AffectedSystemsStore: (state = storage.AffectedSystemsStore, action) => AffectedSystemsStore(state, action),
        notifications
    });

    return registry;
}

export function getStore() {
    return registry.getStore();
}

export function register(...args) {
    return registry.register(...args);
}
