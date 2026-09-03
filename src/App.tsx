import { useState } from "react";
import "./App.css";
import { MainArea } from "./features/contents/components/MainArea";
import { Sidebar } from "./features/contents/components/Sidebar";
// カタログ領域用
import { ButtonAction } from "./features/contents/components/ButtonAction";
import { ButtonIcon } from "./components/ui/ButtonIcon";
import trashIcon from "@/assets/delete.svg";

function App() {
  // 選択中のページIDを親コンポーネントで一元管理
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const isCatalogMode = import.meta.env.VITE_SHOW_CATALOG === "true";

  return (
    <div className="flex flex-col h-screen w-full font-sans text-black-80">
      {/* --- ここから一時的なカタログ領域 フラグが true の時だけレンダリング --- */}
      {isCatalogMode && (
        <div className="p-8 border-b-4 border-dashed border-gray-300 bg-white">
          <h2 className="mb-4 text-lg font-bold">UIボタン カタログ</h2>
          <div className="grid grid-cols-3 gap-4 items-center">
            <ButtonAction action="edit" />
            <ButtonAction action="new" />
            <ButtonAction action="cancel" />
            <ButtonAction action="edit" disabled />
            <ButtonAction action="new" disabled />
            <ButtonAction action="cancel" disabled />
            <ButtonIcon aria-label="delete" icon={<img src={trashIcon} alt="Delete" />} />
            <ButtonIcon aria-label="delete" icon={<img src={trashIcon} alt="Delete" />} disabled />
          </div>
        </div>
      )}
      {/* --- ここまで --- */}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar selectedId={selectedId} onSelect={setSelectedId} />
        <MainArea className="flex-1" selectedId={selectedId} />
      </div>
    </div>
  );
}

export default App;
