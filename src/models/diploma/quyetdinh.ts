import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<Diploma.IQuyetDinh>('api/quyet-dinh', undefined, undefined, '');

  return {
    ...objInit,
  };
};
