interface ImportMetaEnv {
  readonly VITE_TORDER_FLAG: boolean,
  readonly VITE_US_EAST_FLAG: boolean,
  readonly VITE_US_FLAG: boolean,
  readonly VITE_SINGAPORE_FLAG: boolean,
  readonly VITE_SYDNEY_FLAG: boolean,
}

interface ImportMeta {
  readonly env: ImportMetaEnv,
}
