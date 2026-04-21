import type { Effect, Reducer } from 'umi';
import type { Tag } from '@/types/blog';
import { getTags, createTag, updateTag, deleteTag } from '@/services/blog/tag';

export interface TagModelState {
  list: Tag[];
  loading: boolean;
}

export interface TagModelType {
  namespace: 'blogTag';
  state: TagModelState;
  effects: {
    fetchList: Effect;
    create: Effect;
    update: Effect;
    remove: Effect;
  };
  reducers: {
    save: Reducer<TagModelState>;
  };
}

const TagModel: TagModelType = {
  namespace: 'blogTag',

  state: {
    list: [],
    loading: false,
  },

  effects: {
    *fetchList(_action, { call, put }) {
      yield put({ type: 'save', payload: { loading: true } });
      const res = yield call(getTags);
      yield put({ type: 'save', payload: { list: res.data.data, loading: false } });
    },

    *create({ payload }, { call, put }) {
      yield call(createTag, payload);
      yield put({ type: 'fetchList' });
    },

    *update({ payload }, { call, put }) {
      const { id, ...data } = payload;
      yield call(updateTag, id, data);
      yield put({ type: 'fetchList' });
    },

    *remove({ payload }, { call, put }) {
      yield call(deleteTag, payload.id);
      yield put({ type: 'fetchList' });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default TagModel;
