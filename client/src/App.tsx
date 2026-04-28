import { useCallback } from 'react';
import { useAssets } from './hooks/useAssets';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { AssetCard } from './components/AssetCard';
import { AssetModal } from './components/AssetModal';
import { ActiveChips } from './components/ActiveChips';
import { getPreferredModalAsset } from './utils/assets';

function App() {
  const {
    assets, loading,
    query, setQuery,
    sort, setSort,
    showDeprecated, setShowDeprecated,
    showArchived, setShowArchived,
    filters, toggleFilter,
    modalAssetId, setModalAssetId,
    resetAll, recordClick,
    displayGroups, recommendations,
    isSearching,
  } = useAssets();

  const totalCount = assets.length;
  const recommendedCount = assets.filter((a) => a.recommended && a.status === "current").length;
  const matchCount = displayGroups.length;

  const openModal = useCallback((assetId: string) => {
    recordClick(assetId);
    setModalAssetId(assetId);
  }, [recordClick, setModalAssetId]);

  const closeModal = useCallback(() => {
    setModalAssetId(null);
  }, [setModalAssetId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[var(--muted)]">Loading assets…</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative z-1 flex flex-col w-[min(1440px,calc(100vw-40px))] mx-auto py-5 pb-10">
      <Header
        totalCount={totalCount}
        recommendedCount={recommendedCount}
        matchCount={matchCount}
      />

      <SearchBar
        query={query}
        onQueryChange={setQuery}
        sort={sort}
        onSortChange={setSort}
        showDeprecated={showDeprecated}
        onShowDeprecatedChange={setShowDeprecated}
        showArchived={showArchived}
        onShowArchivedChange={setShowArchived}
        filters={filters}
        onToggleFilter={toggleFilter}
        onReset={resetAll}
      />

      {/* Recommendations */}
      {!isSearching && (
        <section className="border border-[var(--line)] rounded-2xl bg-white shadow-sm mb-3.5 p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[var(--muted)] uppercase tracking-[0.12em] text-[0.69rem] mb-1">Recommended</p>
              <h2 className="text-[clamp(1.08rem,1.4vw,1.28rem)] leading-[1.2] m-0 font-semibold">よく使われるアセット</h2>
            </div>
            <span className="text-xs text-[var(--muted)]">クリック数が多い current アセットを優先表示</span>
          </div>
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {recommendations.map((group) => (
                <AssetCard
                  key={group.id}
                  group={group}
                  compact
                  onClick={() => openModal(getPreferredModalAsset(group).id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-[var(--muted)]">
              <h3 className="font-medium mb-1">おすすめ候補がありません</h3>
              <p>表示条件を少し広げると、推奨アセットが出てきます。</p>
            </div>
          )}
        </section>
      )}

      {/* Results */}
      <section className="border border-[var(--line)] rounded-2xl bg-white shadow-sm p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[var(--muted)] uppercase tracking-[0.12em] text-[0.69rem] mb-1">Results</p>
            <h2 className="text-[clamp(1.08rem,1.4vw,1.28rem)] leading-[1.2] m-0 font-semibold">検索結果</h2>
          </div>
          <div className="text-right">
            <div className="text-sm text-[var(--muted)] mb-1.5">
              {matchCount > 0 ? `${matchCount} 件のアセットグループ` : "—"}
            </div>
            <ActiveChips
              query={query}
              filters={filters}
              showDeprecated={showDeprecated}
              showArchived={showArchived}
              onClearQuery={() => setQuery("")}
              onToggleFilter={toggleFilter}
              onSetShowDeprecated={setShowDeprecated}
              onSetShowArchived={setShowArchived}
            />
          </div>
        </div>

        {displayGroups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {displayGroups.map((group) => (
              <AssetCard
                key={group.id}
                group={group}
                onClick={() => openModal(getPreferredModalAsset(group).id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-base font-medium mb-2">該当するアセットが見つかりませんでした</h3>
            <p className="text-sm text-[var(--muted)] mb-4">検索語を広げるか、Deprecated / Archived の表示を切り替えてみてください。</p>
            <button
              type="button"
              onClick={resetAll}
              className="px-5 py-2 text-sm font-medium rounded-lg bg-[var(--accent)] text-white hover:bg-gray-800 transition-colors cursor-pointer"
            >
              フィルタを解除して再検索
            </button>
          </div>
        )}
      </section>

      {/* Modal */}
      <AssetModal
        assetId={modalAssetId}
        assets={assets}
        onClose={closeModal}
        onRecordClick={recordClick}
      />
    </main>
  );
}

export default App;
