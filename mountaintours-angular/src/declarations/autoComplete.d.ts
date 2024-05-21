declare module '@tarekraafat/autocomplete.js/dist/autoComplete.js' {
  interface DataSrc {
    src: (query: string) => Promise<any[]>;
    keys: string[];
    cache?: boolean;
  }

  interface ResultsList {
    element?: (list: HTMLElement, data: any) => void;
    noResults?: boolean;
  }

  interface ResultItem {
    highlight?: boolean;
    element?: (item: HTMLElement, data: any) => void;
  }

  interface OnSelection {
    detail: { selection: { value: { data: any } } };
  }

  interface AutoCompleteConfig {
    selector: string | (() => HTMLInputElement | null);
    placeHolder?: string;
    searchEngine?: (query: string, record: any) => string;
    data: DataSrc;
    resultsList?: ResultsList;
    resultItem?: ResultItem;
    onSelection?: (feedback: OnSelection) => void;
  }

  export default class AutoComplete {
    constructor(config: AutoCompleteConfig);
  }
}
