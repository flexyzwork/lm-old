'use client';

import { useRef } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { setupListeners } from '@reduxjs/toolkit/query';
import globalReducer from '@/states';
// import authReducer from '@/states/auth'; // authSlice 리듀서 추가
import { api } from '@/states/api';

/* REDUX STORE */
const rootReducer = combineReducers({
  global: globalReducer, // 기존 글로벌 상태 리듀서
  // auth: authReducer, // authSlice 리듀서 추가
  [api.reducerPath]: api.reducer, // API 상태 리듀서
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer, // 결합된 리듀서 사용
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            'api/executeMutation/pending',
            'api/executeMutation/fulfilled',
            'api/executeMutation/rejected',
          ],
          ignoredActionPaths: [
            'meta.arg.originalArgs.file',
            'meta.arg.originalArgs.formData',
            'payload.chapter.video',
            'meta.baseQueryMeta.request',
            'meta.baseQueryMeta.response',
          ],
          ignoredPaths: [
            'global.courseEditor.sections',
            'entities.videos.data',
            'meta.baseQueryMeta.request',
            'meta.baseQueryMeta.response',
          ],
        },
      }).concat(api.middleware), // API 미들웨어
  });
};

/* REDUX TYPES: Redux 타입 설정 */
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/* PROVIDER: Redux StoreProvider 컴포넌트 */
export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch);
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
