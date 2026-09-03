interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SHOW_CATALOG?: string;
  // 他に環境変数があればここに追加
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
