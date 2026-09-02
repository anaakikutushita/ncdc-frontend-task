import { useState } from "react";
import "./App.css";
import { ButtonLabel } from "./components/ui/ButtonLabel";
import { MainArea } from "./features/contents/components/MainArea";
import { Sidebar } from "./features/contents/components/Sidebar";

function App() {
  // 選択中のページIDを親コンポーネントで一元管理
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-screen w-full font-sans text-gray-900">

      {/* --- ここから一時的なカタログ領域 --- */}
      <div className="p-8 border-b-4 border-dashed border-gray-300 bg-white">
        <h2 className="mb-4 text-lg font-bold">UI調整 Sandbox</h2>
        <div className="grid grid-cols-3 gap-4 items-center">
          <ButtonLabel variant="primary">Edit (Primary)</ButtonLabel>
          <ButtonLabel variant="secondary">Done (Secondary)</ButtonLabel>
          <ButtonLabel variant="normal">Cancel (Normal)</ButtonLabel>
          <ButtonLabel variant="primary" disabled>Edit (disabled)</ButtonLabel>
          <ButtonLabel variant="secondary" disabled>Done (disabled)</ButtonLabel>
          <ButtonLabel variant="normal" disabled>Cancel (disabled)</ButtonLabel>
        </div>
      </div>
      {/* --- ここまで --- */}

      <div className="flex flex-1 overflow-hidden bg-gray-50">
        <Sidebar selectedId={selectedId} onSelect={setSelectedId} />
        <MainArea selectedId={selectedId} />
      </div>
    </div>
  );
}

export default App;
