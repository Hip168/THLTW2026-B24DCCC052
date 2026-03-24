import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<Diploma.ICauHinhBieuMau>('api/cau-hinh-bieu-mau', undefined, undefined, '');

  return {
    ...objInit,
  };
};
