export interface UploadedImage {
  id: string;
  dataUrl: string;
  originalName: string;
  width: number;
  height: number;
}

export interface TimingLabel {
  imageId: string;
  text: string;
}

export interface TemplateConfig {
  images: UploadedImage[];
  timingLabels: TimingLabel[];
  showPanelLetters: boolean;
  showTimeArrow: boolean;
}

export interface ImageElement {
  type: "image";
  imageId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  dataUrl: string;
}

export interface LabelElement {
  type: "label";
  text: string;
  x: number;
  y: number;
  fontSize: number;
}

export interface PanelLetterElement {
  type: "panel-letter";
  letter: string;
  x: number;
  y: number;
  fontSize: number;
}

export interface ArrowElement {
  type: "arrow";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strokeWidth: number;
  label?: string;
}

export type LayoutElement =
  | ImageElement
  | LabelElement
  | PanelLetterElement
  | ArrowElement;

export interface LayoutResult {
  viewBoxWidth: number;
  viewBoxHeight: number;
  elements: LayoutElement[];
}

export interface Template {
  slug: string;
  name: string;
  description: string;
  minImages: number;
  maxImages: number;
  computeLayout: (config: TemplateConfig) => LayoutResult;
}
