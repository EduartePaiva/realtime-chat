// biome-ignore lint/correctness/noUnusedVariables: <env file>
interface ViteTypeOptions {}

interface ImportMetaEnv {
	readonly VITE_API_URL: string;
}

// biome-ignore lint/correctness/noUnusedVariables: <env file>
interface ImportMeta {
	readonly env: ImportMetaEnv;
}
