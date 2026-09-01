import { useState } from "react";
import { Sidebar } from "./features/contents/components/Sidebar";
import { MainArea } from "./features/contents/components/MainArea";
import "./App.css";

function App() {
  // 選択中のページIDを親コンポーネントで一元管理
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-900">
      {/*
        ※手動確認を成立させるため、Sidebar側に selectedId と onSelect(id) を
        受け取るPropsが未実装の場合は追加してください
      */}
      <Sidebar selectedId={selectedId} onSelect={setSelectedId} />
      <MainArea selectedId={selectedId} />
    </div>
  );
}

export default App;
