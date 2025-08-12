interface GoogleTranslateElementStatic {
  InlineLayout: {
    SIMPLE: string;
  };
  getInstance(): unknown;
}

interface Window {
  google: {
    translate: {
      TranslateElement: new (
        options: {
          pageLanguage: string;
          includedLanguages: string;
          layout: string;
        },
        elementId: string
      ) => unknown & {
        dispose(): void;
      };
    } & GoogleTranslateElementStatic;
  };
  googleTranslateElementInit: () => void;
}
