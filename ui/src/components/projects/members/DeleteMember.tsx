import React from 'react';
import { toast } from 'react-toastify';
import { Button } from '../../../commons/components/Button';
import { axios } from '../../../providers/axios';
import { CardModal } from '../../../commons/components/modals/CardModal';
import { useMountedState } from '../../../commons/hooks/use-mounted-state';
import { IsAdmin } from '../../auth/IsAdmin';
import { extractErrorMessage } from '../../../utils/extract-error-message';

export function DeleteMember({
  projectId, memberId, className, children, onDelete,
}: {
  projectId: string;
  memberId: string;
  children: any;
  className?: string;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useMountedState(false);
  const [loading, setLoading] = useMountedState(false);

  const deleteMember = () => {
    setLoading(true);
    return axios
      .delete(`/api/v1/projects/${projectId}/members/${memberId}`)
      .then(() => {
        setIsOpen(false);
        onDelete();
      })
      .catch(err => {
        toast.error(`Could not delete member: ${extractErrorMessage(err)}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <CardModal
        isOpen={isOpen}
        title="Delete member"
        closeModal={() => setIsOpen(false)}
      >
        <p>Are you sure you want to delete this member ?</p>
        <div className="d-flex align-items-center">
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <Button
            className="btn btn-danger ml-3"
            onClick={deleteMember}
            loading={loading}
          >
            Delete
          </Button>
        </div>
      </CardModal>

      <IsAdmin>
        <div onClick={() => setIsOpen(true)} className={className}>
          {children}
        </div>
      </IsAdmin>
    </>
  );
}
