import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<Diploma.IThongTinVanBang>('api/thong-tin-van-bang', undefined, undefined, '');

  return {
    ...objInit,
  };
};
