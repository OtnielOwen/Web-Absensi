import { notification } from 'antd';
import useMutationSubmit from '@/utilities/hooks/useMutationSubmit';

function useFacesGalleryMutator({ onAddSuccess, onDeleteSuccess, slug = null } = {}) {
  const baseOnSuccess = (response) => {
    if (response.success) {
      notification.open({
        type: 'success',
        message: 'Berhasil',
        description: response.message,
        placement: 'bottomLeft',
      });
    }
  };

  const { submit: submitAdd, isLoading: isLoadingAdd } = useMutationSubmit({
    url: '/photos/create',
    onSuccess(response) {
      baseOnSuccess(response);
      onAddSuccess?.(response);
    },
  });

  const { submit: submitDelete, isLoading: isLoadingDelete } = useMutationSubmit({
    url: `/photos/delete/${slug}`,
    method: 'DELETE',
    onSuccess(response) {
      baseOnSuccess(response);
      onDeleteSuccess?.(response);
    },
  });

  return {
    submitAdd,
    isLoadingAdd,
    submitDelete,
    isLoadingDelete,
    isLoading: isLoadingAdd || isLoadingDelete,
  };
}

export default useFacesGalleryMutator;
