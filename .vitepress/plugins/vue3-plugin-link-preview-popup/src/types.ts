export interface LinkPreviewPopupOptions {
  previewHostNames?: string[]
  selectorsToBeHided?: string[]
  handleIframeLoaded?: (element: HTMLIFrameElement) => Promise<void> | void
}

export const defaultLinkPreviewPopupOptions: LinkPreviewPopupOptions = {
  previewHostNames: [],
  selectorsToBeHided: ['.VPNav', '.VPFooter', '.VPLocalNav', '.VPSidebar', '.VPDocFooter > .prev-next'],
}

export const linkPreviewPopupInjectionKey = Symbol('link-preview-popup-options')
