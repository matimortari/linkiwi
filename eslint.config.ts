import antfu from "@antfu/eslint-config"
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss"

export default antfu({
  vue: true,
  typescript: true,
  jsonc: true,
  formatters: {
    css: true,
    html: true,
    markdown: true,
  },
  stylistic: {
    indent: 2,
    quotes: "double",
    semi: false,
  },
  plugins: {
    "better-tailwindcss": eslintPluginBetterTailwindcss,
  },
  settings: {
    "better-tailwindcss": {
      entryPoint: "app/assets/styles.css",
      detectComponentClasses: true,
    },
  },
  rules: {
    "no-new": "off",
    "no-undef": "off",
    "no-alert": "off",
    "no-console": "off",
    "node/prefer-global/process": "off",
    "curly": ["error", "all"],
    "object-curly-newline": ["error", {
      ObjectExpression: { multiline: false, consistent: true },
      ObjectPattern: { multiline: false, consistent: true },
      ImportDeclaration: { multiline: false, consistent: true },
      ExportDeclaration: { multiline: false, consistent: true },
    }],
    "vue/object-curly-newline": ["error", {
      ObjectExpression: { multiline: false, consistent: true },
      ObjectPattern: { multiline: false, consistent: true },
      ImportDeclaration: { multiline: false, consistent: true },
      ExportDeclaration: { multiline: false, consistent: true },
    }],
    "vue/block-order": ["error", {
      order: ["template", "script", "style"],
    }],
    "vue/define-macros-order": ["error", {
      order: ["defineProps", "defineEmits"],
    }],
    "vue/singleline-html-element-content-newline": ["error", {
      ignoreWhenEmpty: true,
      ignoreWhenNoAttributes: true,
    }],
    "vue/multiline-html-element-content-newline": ["error", {
      ignoreWhenEmpty: true,
      allowEmptyLines: false,
    }],
    "vue/html-closing-bracket-newline": ["error", {
      singleline: "never",
      multiline: "always",
      selfClosingTag: { singleline: "never", multiline: "always" },
    }],
    "vue/max-attributes-per-line": ["warn", {
      singleline: { max: 4 },
      multiline: { max: 2 },
    }],
    ...eslintPluginBetterTailwindcss.configs["recommended-warn"].rules,
    "better-tailwindcss/no-unregistered-classes": "off",
    "better-tailwindcss/no-unknown-classes": "off",
    "better-tailwindcss/enforce-consistent-line-wrapping": "off",
  },
})
