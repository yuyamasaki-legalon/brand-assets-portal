import { LfEllipsisDot } from "@legalforce/aegis-icons";
import { Box } from "@legalforce/aegis-illustrations/react";
import {
  ActionList,
  Button,
  ButtonGroup,
  ContentHeader,
  ContentHeaderTitle,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  EmptyState,
  FormControl,
  IconButton,
  Menu,
  PageLayout,
  PageLayoutBody,
  PageLayoutContent,
  PageLayoutHeader,
  Skeleton,
  Text,
  TextField,
  Tooltip,
} from "@legalforce/aegis-react";
import type { CSSProperties, FormEvent, MouseEventHandler } from "react";
import { startTransition, useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocSidebarLayout } from "../../_shared";

type ConversationItem = {
  id: string;
  title: string;
};

type ConversationGroup = {
  timeSpanLabel: string;
  conversationHistoryList: ConversationItem[];
};

const MAX_CONVERSATION_TITLE_LENGTH = 50;
const INITIAL_VISIBLE_GROUP_COUNT = 4;
const LOAD_MORE_GROUP_COUNT = 2;

const INITIAL_GROUPS: ConversationGroup[] = [
  {
    timeSpanLabel: "今日",
    conversationHistoryList: [
      { id: "conv-001", title: "この契約書の矛盾点を教えて" },
      {
        id: "conv-002",
        title:
          "この契約書の前のバージョンと比較して一番内容が変わった条文は何？出来るだけ簡潔に教えてくれるとすごく助かります",
      },
      { id: "conv-003", title: "NDAの秘密情報の定義が広すぎないか確認して" },
    ],
  },
  {
    timeSpanLabel: "昨日",
    conversationHistoryList: [
      { id: "conv-004", title: "業務委託契約の再委託条項で注意すべき点を整理して" },
      { id: "conv-005", title: "損害賠償責任の上限が相手方有利か見てほしい" },
    ],
  },
  {
    timeSpanLabel: "先週",
    conversationHistoryList: [
      { id: "conv-006", title: "レビュー結果を事業部向けに短く要約して" },
      { id: "conv-007", title: "準拠法と裁判管轄の条項だけ抜き出して比較して" },
    ],
  },
  {
    timeSpanLabel: "2週間前",
    conversationHistoryList: [
      { id: "conv-008", title: "この取引基本契約で不利になりそうな支払条件を教えて" },
      { id: "conv-009", title: "競業避止義務の期間は一般的にどの程度？" },
    ],
  },
  {
    timeSpanLabel: "先月",
    conversationHistoryList: [
      { id: "conv-010", title: "サービス利用規約の免責条項をレビューして" },
      { id: "conv-011", title: "個人情報処理条項に不足している観点はある？" },
    ],
  },
  {
    timeSpanLabel: "3ヶ月前",
    conversationHistoryList: [{ id: "conv-012", title: "ライセンス契約の解除条項を確認したい" }],
  },
];

const styles: Record<string, CSSProperties> = {
  pageRoot: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-large)",
  },
  loadingSection: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-medium)",
    paddingBlock: "var(--aegis-space-small)",
  },
  emptyState: {
    padding: "var(--aegis-space-xxLarge)",
  },
  editFieldWrap: {
    paddingBlockStart: "var(--aegis-space-xxSmall)",
  },
  deleteBody: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--aegis-space-small)",
  },
};

const LoadingState = () => (
  <div style={styles.loading}>
    {["skeleton-1", "skeleton-2", "skeleton-3"].map((id) => (
      <div key={id}>
        <div style={styles.loadingSection}>
          <Skeleton.Text width="small" />
          <Skeleton.Text width="full" />
          <Skeleton.Text width="full" />
          <Skeleton.Text width="full" />
          <Skeleton.Text width="full" />
        </div>
      </div>
    ))}
  </div>
);

const EmptyConversationState = () => (
  <div style={styles.emptyState}>
    <EmptyState size="medium" title="会話履歴がありません" visual={<Box />} />
  </div>
);

const stopRowPropagation: MouseEventHandler<HTMLElement> = (event) => {
  event.stopPropagation();
};

const updateConversationTitle = (
  groups: ConversationGroup[],
  conversationId: string,
  nextTitle: string,
): ConversationGroup[] =>
  groups.map((group) => ({
    ...group,
    conversationHistoryList: group.conversationHistoryList.map((conversation) =>
      conversation.id === conversationId ? { ...conversation, title: nextTitle } : conversation,
    ),
  }));

const deleteConversation = (groups: ConversationGroup[], conversationId: string): ConversationGroup[] =>
  groups
    .map((group) => ({
      ...group,
      conversationHistoryList: group.conversationHistoryList.filter(
        (conversation) => conversation.id !== conversationId,
      ),
    }))
    .filter((group) => group.conversationHistoryList.length > 0);

type ConversationActionMenuProps = {
  conversation: ConversationItem;
  onOpenEdit: (conversation: ConversationItem) => void;
  onOpenDelete: (conversation: ConversationItem) => void;
};

const ConversationActionMenu = ({ conversation, onOpenEdit, onOpenDelete }: ConversationActionMenuProps) => (
  <Menu placement="bottom-end">
    <Menu.Anchor>
      <Tooltip title="メニュー" placement="left">
        <IconButton aria-label="会話に関するメニュー" variant="plain" onClick={stopRowPropagation}>
          <LfEllipsisDot />
        </IconButton>
      </Tooltip>
    </Menu.Anchor>
    <Menu.Box width="auto">
      <ActionList>
        <ActionList.Group>
          <ActionList.Item
            onClick={(event) => {
              event.stopPropagation();
              onOpenEdit(conversation);
            }}
          >
            <ActionList.Body>会話名を編集</ActionList.Body>
          </ActionList.Item>
        </ActionList.Group>
        <ActionList.Group>
          <ActionList.Item
            color="danger"
            onClick={(event) => {
              event.stopPropagation();
              onOpenDelete(conversation);
            }}
          >
            <ActionList.Body>削除</ActionList.Body>
          </ActionList.Item>
        </ActionList.Group>
      </ActionList>
    </Menu.Box>
  </Menu>
);

export const LoaHistoryTemplate = () => {
  const navigate = useNavigate();
  const editFormId = useId();

  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [visibleGroupCount, setVisibleGroupCount] = useState(
    Math.min(INITIAL_VISIBLE_GROUP_COUNT, INITIAL_GROUPS.length),
  );
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [editingConversation, setEditingConversation] = useState<ConversationItem | null>(null);
  const [deletingConversation, setDeletingConversation] = useState<ConversationItem | null>(null);
  const [draftTitle, setDraftTitle] = useState("");

  const totalGroupCountRef = useRef(groups.length);
  const loadMoreTimerRef = useRef<number | null>(null);

  useEffect(() => {
    totalGroupCountRef.current = groups.length;
  }, [groups.length]);

  useEffect(() => {
    setDraftTitle(editingConversation?.title ?? "");
  }, [editingConversation]);

  useEffect(() => {
    return () => {
      if (loadMoreTimerRef.current !== null) {
        window.clearTimeout(loadMoreTimerRef.current);
      }
    };
  }, []);

  const visibleGroups = groups.slice(0, visibleGroupCount);
  const hasNextPage = visibleGroupCount < groups.length;
  const hasValidationError = draftTitle.trim().length === 0 || draftTitle.length > MAX_CONVERSATION_TITLE_LENGTH;

  const handleClickConversation = (conversationId: string) => {
    navigate("/template/loc/loa", { state: { conversationId } });
  };

  const handleFetchNextPage = () => {
    setIsFetchingNextPage(true);

    loadMoreTimerRef.current = window.setTimeout(() => {
      startTransition(() => {
        setVisibleGroupCount((current) => Math.min(current + LOAD_MORE_GROUP_COUNT, totalGroupCountRef.current));
        setIsFetchingNextPage(false);
      });
    }, 480);
  };

  const handleSaveConversationTitle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingConversation || hasValidationError) {
      return;
    }

    setGroups(updateConversationTitle(groups, editingConversation.id, draftTitle.trim()));
    setEditingConversation(null);
  };

  const handleDeleteConversation = () => {
    if (!deletingConversation) {
      return;
    }

    const nextGroups = deleteConversation(groups, deletingConversation.id);
    totalGroupCountRef.current = nextGroups.length;
    setGroups(nextGroups);
    setVisibleGroupCount((current) => Math.min(current, nextGroups.length));
    setDeletingConversation(null);
  };

  return (
    <LocSidebarLayout activeId="assistant">
      <PageLayout>
        <PageLayoutContent as="main" maxWidth="large">
          <PageLayoutHeader>
            <ContentHeader>
              <ContentHeaderTitle as="h1">会話履歴</ContentHeaderTitle>
            </ContentHeader>
          </PageLayoutHeader>
          <PageLayoutBody>
            <div style={styles.pageRoot}>
              {visibleGroups.length === 0 ? (
                <EmptyConversationState />
              ) : (
                <ActionList>
                  {visibleGroups.map(({ timeSpanLabel, conversationHistoryList }) => (
                    <ActionList.Group title={timeSpanLabel} key={timeSpanLabel}>
                      {conversationHistoryList.map((conversation) => (
                        <ActionList.Item
                          as="div"
                          key={conversation.id}
                          onClick={() => handleClickConversation(conversation.id)}
                        >
                          <ActionList.Body
                            trailing={
                              <ConversationActionMenu
                                conversation={conversation}
                                onOpenEdit={setEditingConversation}
                                onOpenDelete={setDeletingConversation}
                              />
                            }
                          >
                            <Text variant="body.medium">{conversation.title}</Text>
                          </ActionList.Body>
                        </ActionList.Item>
                      ))}
                    </ActionList.Group>
                  ))}
                </ActionList>
              )}

              {isFetchingNextPage ? (
                <LoadingState />
              ) : hasNextPage ? (
                <Button variant="plain" width="full" onClick={handleFetchNextPage}>
                  もっと見る
                </Button>
              ) : null}
            </div>
          </PageLayoutBody>
        </PageLayoutContent>
      </PageLayout>

      <Dialog open={editingConversation !== null} onOpenChange={(open) => !open && setEditingConversation(null)}>
        <DialogContent width="medium">
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>会話名を編集</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <form id={editFormId} onSubmit={handleSaveConversationTitle}>
              <div style={styles.editFieldWrap}>
                <FormControl error={hasValidationError}>
                  <TextField
                    value={draftTitle}
                    onChange={(event) => setDraftTitle(event.target.value)}
                    required
                    maxLength={MAX_CONVERSATION_TITLE_LENGTH}
                  />
                  <FormControl.Caption>
                    {draftTitle.length > 0
                      ? `会話名は${MAX_CONVERSATION_TITLE_LENGTH}文字以内にしてください`
                      : "会話名の入力は必須です"}
                  </FormControl.Caption>
                </FormControl>
              </div>
            </form>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain" onClick={() => setEditingConversation(null)}>
                キャンセル
              </Button>
              <Button type="submit" form={editFormId} disabled={hasValidationError}>
                保存
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deletingConversation !== null} onOpenChange={(open) => !open && setDeletingConversation(null)}>
        <DialogContent width="medium">
          <DialogHeader>
            <ContentHeader>
              <ContentHeaderTitle>削除してもよろしいですか？</ContentHeaderTitle>
            </ContentHeader>
          </DialogHeader>
          <DialogBody>
            <div style={styles.deleteBody}>
              {deletingConversation ? <Text variant="body.medium.bold">{deletingConversation.title}</Text> : null}
              <Text variant="body.medium">この操作は元に戻すことはできません。</Text>
            </div>
          </DialogBody>
          <DialogFooter>
            <ButtonGroup>
              <Button variant="plain" onClick={() => setDeletingConversation(null)}>
                キャンセル
              </Button>
              <Button color="danger" onClick={handleDeleteConversation}>
                削除
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LocSidebarLayout>
  );
};

export default LoaHistoryTemplate;
