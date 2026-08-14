import js from "@eslint/js";
import jest from "eslint-plugin-jest";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { 
      globals: globals.node, 
    } 
  },
  { 
    files: ["**/*.js"], 
    languageOptions: { 
      sourceType: "commonjs",
    },
  },
  {
    rules: {
      "no-duplicate-imports": "error",
      "no-self-compare": "error",
      "no-console": ["error", { allow: ["warn", "error" ] }],
      "no-else-return": "error",
      "no-empty-function": "error",
      "no-unassigned-vars": "error",
      "no-var": "error",
      "no-script-url": "error",
      "no-eval": "error",
      "no-alert": "error",
      "func-names": "error",
      "init-declarations": "error",
      "no-implied-eval": "error",
      "no-loop-func": "error",
      "no-multi-assign": "error",
      "prefer-const": "error",
      "semi": "error",
    }
  },

  {
    files: ['tests/**/*.spec.js'],
    plugins: { jest },
    languageOptions: {
      globals: jest.environments.globals.globals
    },
    rules: {
      ...jest.configs['flat/recommended'].rules,
    }
  }
]);
