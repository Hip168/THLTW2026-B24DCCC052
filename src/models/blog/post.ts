import type { Effect, Reducer } from 'umi';
import type { Post } from '@/types/blog';
import { getPosts, getPostBySlug, createPost, updatePost, deletePost, incrementView } from '@/services/blog/post';

export interface PostModelState {
  list: Post[];
  detail: Post | null;
  total: number;
  loading: boolean;
}

export interface PostModelType {
  namespace: 'blogPost';
  state: PostModelState;
  effects: {
    fetchList: Effect;
    fetchDetail: Effect;
    create: Effect;
    update: Effect;
    remove: Effect;
    incrementView: Effect;
  };
  reducers: {
    save: Reducer<PostModelState>;
  };
}

const PostModel: PostModelType = {
  namespace: 'blogPost',

  state: {
    list: [],
    detail: null,
    total: 0,
    loading: false,
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { loading: true } });
      const res = yield call(getPosts, payload);
      yield put({
        type: 'save',
        payload: { list: res.data.data, total: res.data.total || res.data.data.length, loading: false },
      });
    },

    *fetchDetail({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { loading: true } });
      const res = yield call(getPostBySlug, payload.slug);
      yield put({ type: 'save', payload: { detail: res.data.data, loading: false } });
    },

    *create({ payload }, { call, put }) {
      yield call(createPost, payload);
      yield put({ type: 'fetchList', payload: {} });
    },

    *update({ payload }, { call, put }) {
      const { id, ...data } = payload;
      yield call(updatePost, id, data);
      yield put({ type: 'fetchList', payload: {} });
    },

    *remove({ payload }, { call, put }) {
      yield call(deletePost, payload.id);
      yield put({ type: 'fetchList', payload: {} });
    },

    *incrementView({ payload }, { call }) {
      yield call(incrementView, payload.id);
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default PostModel;
