import { useState } from "react";
import { Sidebar } from "./features/contents/components/Sidebar";
import { MainArea } from "./features/contents/components/MainArea";
import { LabelButton } from "./components/ui/LabelButton";
import "./App.css";

function App() {
  // 選択中のページIDを親コンポーネントで一元管理
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-screen w-full font-sans text-gray-900">

      {/* --- ここから一時的なカタログ領域 --- */}
      <div className="p-8 border-b-4 border-dashed border-gray-300 bg-white">
        <h2 className="mb-4 text-lg font-bold">UI調整 Sandbox</h2>
        <div className="grid grid-cols-3 gap-4 items-center">
          <LabelButton variant="primary">Edit (Primary)</LabelButton>
          <LabelButton variant="secondary">Done (Secondary)</LabelButton>
          <LabelButton variant="normal">Cancel (Normal)</LabelButton>
          <LabelButton variant="primary" disabled>Edit (disabled)</LabelButton>
          <LabelButton variant="secondary" disabled>Done (disabled)</LabelButton>
          <LabelButton variant="normal" disabled>Cancel (disabled)</LabelButton>
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
