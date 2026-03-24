import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<Diploma.ISoVanBang>('api/so-van-bang', undefined, undefined, '');

  return {
    ...objInit,
  };
};
