import packageInfo from "../../package.json";

// How to use this:
// ============================================================
// This file is used to store all the environment variables and constants used in the application.

// # To add a new variable:
// ============================================================
// - For environment variables & constants that are the same across all environments, add them to the GLOBAL_CONSTANTS object.
// - For environment-specific variables (i.e they change depending on the environemnt), add them to the environment's object in each of the CONFIG_BUILDER object.

// # To add a new environment:
// ============================================================
// 1. Add a new key to the CONFIG_BUILDER object with the environment name.
// 2. Duplicate the development object and replace the values with the new environment's values.

const APP_VERSION = packageInfo.version;

const NODE_ENV = import.meta.env.MODE || "development";
// const NODE_ENV = "production";

const GLOBAL_CONSTANTS = {
	// System Constants
	// ============================================================
	APP_NAME: packageInfo.name,

	URL: {
		API_BASE_URL: process.env.VITE_BASE_URL,
		API_BASE_EMR_URL: process.env.VITE_BASE_EMR_URL,
		API_VERSION: process.env.VITE_APP_API_VERSION,
		CLIENT_URL: process.env.VITE_CLIENT_URL,
	},

	// App Level Configs

	// Monitoring Configs
	// ============================================================
};

// const CONFIG_BUILDER = {
// 	development: {
// 		...GLOBAL_CONSTANTS,

// 		// System Constants
// 		// ============================================================
// 		URL: {
// 			API_BASE_URL: process.env.VITE_DEV_API_BASE_URL,
// 			API_VERSION: process.env.VITE_APP_API_VERSION,
// 			CLIENT_URL: process.env.VITE_DEV_CLIENT_URL,
// 		},

// 		// App Level Configs
// 		// ============================================================

// 		HEAP: {
// 			HEAP_ID: process.env.VITE_HEAP_ID,
// 		},

// 		INTERCOM: {
// 			APP_ID: process.env.VITE_INTERCOM_APP_ID,
// 		},

// 		PUSHER: {
// 			APP_KEY: process.env.VITE_DEV_PUSHER_APP_KEY,
// 			APP_CLUSTER: process.env.VITE_PUSHER_APP_CLUSTER,
// 		},
// 	},

// 	production: {
// 		...GLOBAL_CONSTANTS,

// 		// System Constants
// 		// ============================================================
// 		URL: {
// 			API_BASE_URL: process.env.VITE_PROD_API_BASE_URL,
// 			API_VERSION: process.env.VITE_APP_API_VERSION,
// 			CLIENT_URL: import.meta.env.VITE_PROD_CLIENT_URL,
// 		},

// 		// App Level Configs
// 		// ============================================================

// 		HEAP: {
// 			HEAP_ID: import.meta.env.VITE_HEAP_ID,
// 		},

// 		INTERCOM: {
// 			APP_ID: import.meta.env.VITE_INTERCOM_APP_ID,
// 		},

// 		PUSHER: {
// 			APP_KEY: import.meta.env.VITE_PROD_PUSHER_APP_KEY,
// 			APP_CLUSTER: import.meta.env.VITE_PUSHER_APP_CLUSTER,
// 		},
// 	},
// } as const;

// Check if NODE_ENV is valid
// if (!Object.keys(CONFIG_BUILDER).includes(NODE_ENV)) {
// 	throw new Error(`Invalid NODE_ENV: ${NODE_ENV}`);
// }

const CONFIGS = GLOBAL_CONSTANTS;

// Uncomment below to check configs set
// console.log("CONFIGS:", CONFIGS);

export { NODE_ENV, APP_VERSION, CONFIGS };
