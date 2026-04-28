import {
  Button,
  ButtonGroup,
  ContentHeader,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Text,
} from "@legalforce/aegis-react";

interface DeleteThreadDialogProps {
  open: boolean;
  pending?: boolean;
  threadLabel: string;
  commentCount: number;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export const DeleteThreadDialog = ({
  open,
  pending = false,
  threadLabel,
  commentCount,
  onOpenChange,
  onConfirm,
}: DeleteThreadDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent width="medium" data-comment-ui>
        <DialogHeader>
          <ContentHeader>
            <ContentHeader.Title>{threadLabel} を削除しますか</ContentHeader.Title>
            <ContentHeader.Description>
              この操作は元に戻せません。thread に含まれるコメントもまとめて削除されます。
            </ContentHeader.Description>
          </ContentHeader>
        </DialogHeader>
        <DialogBody>
          <Text variant="body.medium">{commentCount} 件のコメントが削除対象です。</Text>
        </DialogBody>
        <DialogFooter>
          <ButtonGroup>
            <Button variant="plain" disabled={pending} onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
            <Button color="danger" loading={pending} onClick={() => void onConfirm()}>
              削除する
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
